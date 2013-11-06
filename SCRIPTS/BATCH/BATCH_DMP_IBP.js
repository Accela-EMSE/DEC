/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_DMP_IBP.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch Script  
| Agency  : DEC
| Purpose : DMP - Intermediate Batch Process.
| Notes   : 07/17/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "");
aa.env.setValue("showDebug", "Y");
/*------------------------------------------------------------------------------------------------------/
| END: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var maxSeconds = 4.5 * 60; 	    // number of seconds allowed for batch processing, usually < 5*60
var message = "";
var br = "<br>";
/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
/*------------------------------------------------------------------------------------------------------/
| START: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var emailAddress = getParam("emailAddress"); 				// email to send report
var reportName = getParam("reportName");
/*------------------------------------------------------------------------------------------------------/
| END: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
var servProvCode = aa.getServiceProviderCode();
var showDebug = isNull(aa.env.getValue("showDebug"), "N") == "Y";
var batchJobID = 0;
var batchJobName = "";
var batchJobDesc = "";
var batchJobResult = "";
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var currentUser = aa.person.getCurrentUser().getOutput();
var startDate = new Date();
var startTime = startDate.getTime(); 		// Start timer
var appTypeArray = new Array();
var showDebug = isNull(aa.env.getValue("showDebug"), "N") == "Y";
/*------------------------------------------------------------------------------------------------------/
| END: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/
var isPartialSuccess = false;
var timeExpired = false;
var capId = null;
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
var ordAinfo = null;
var AInfo = new Array();

logDebug("Start of Job");
if (!timeExpired) var isSuccess = mainProcess();
logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
if (isSuccess) {
    aa.print("Passed");
    aa.env.setValue("ScriptReturnCode", "0");
    if (isPartialSuccess) {
        aa.env.setValue("ScriptReturnMessage", "A script timeout has caused partial completion of this process.  Please re-run.");
        aa.eventLog.createEventLog("Batch Job run partial successful.", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
    } else {
        aa.env.setValue("ScriptReturnMessage", "Batch Job run successfully.");
        aa.eventLog.createEventLog("Batch Job run successfully.", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
    }
}
else {
    aa.print("Failed");
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Batch Job failed: " + emailText);
}

if (emailAddress.length)
    aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
/*------------------------------------------------------------------------------------------------------/
| END: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
    var vError = null;
    try {
        var vSuccess = checkBatch();
        if (!vSuccess) return false;

        logDebug("****** Start logic ******");

        callIBPlogic();

        logDebug("****** End logic ******");

        return vSuccess;
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return true;
    }
}

function checkBatch() {
    var vBatchJobResult = aa.batchJob.getJobID();
    batchJobName = "" + aa.env.getValue("BatchJobName");

    if (vBatchJobResult.getSuccess()) {
        batchJobID = vBatchJobResult.getOutput();
        logDebug("Batch job ID found " + batchJobID);
        return true;
    }
    else {
        logDebug("Batch job ID not found " + vBatchJobResult.getErrorMessage());
        return false;
    }
}

function callIBPlogic() {

    //STEP1: Init Sets to process
    logDebug("***** START: STEP1 - Set Init ***** ");
    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult = createIBPSet("IBP");
    logDebug(setResult.setID);
    logDebug("***** END: STEP1 - Set Init ***** ");

    //STEP2: Create Set if not exists, set exists only if IBP process is interrupted due to timeout 
    logDebug("***** START: STEP2 - Set creation ***** ");
    if (setResult.getSetComment() == "Initialized") {
        logDebug('Create to get all Approved DMP applications for season sales');

        var seasonPeriod = GetLicenseSeasonPeriod();
        var overLapPeriod = GetOverLapPeriod();
        var fromDate = aa.date.parseDate(jsDateToMMDDYYYY(overLapPeriod[0]));
        var toDate = aa.date.parseDate(jsDateToMMDDYYYY(seasonPeriod[1]));
        var currYear = seasonPeriod[0].getFullYear();
        logDebug("License Year : " + currYear);
        logDebug("Seseon sales start date : " + fromDate);
        logDebug("Seseon sales end date : " + toDate);

        var emptyCm = aa.cap.getCapModel().getOutput();
        var emptyCt = emptyCm.getCapType();
        emptyCt.setGroup("Licenses");
        emptyCt.setType("Annual");
        emptyCt.setSubType("Hunting");
        emptyCt.setCategory("Deer Management Permit");
        emptyCm.setCapType(emptyCt);
        emptyCm.setCapStatus("Active");

        //Find all recods (Maximum record around 50000)
        //    a. Licenses/Annual/Hunting/Deer Management Permit permits 
        //    b. Status "ACTIVE/APPROVED"
        //    c  In a given Date Range (From date - To date)
        //    d. Ainfo["WMU Choice 1 Result"] == 'LOST' or Ainfo["WMU Choice 2 Result"] == 'LOST'

        //appListResult = aa.cap.getCapIDListByCapModel(capModel);
       //var res = aa.cap.getCapListByCollection(emptyCm, null, null, fromDate, toDate, null, new Array());
	   var res = aa.cap.getCapIDListByCapModel(emptyCm);
        if (res.getSuccess()) {
            var vCapList = res.getOutput();
            for (thisCap in vCapList) {
                var dmpId = vCapList[thisCap].getCapID();
                var dmpca = String(dmpId).split("-");
                var dmpCapId = aa.cap.getCapID(dmpca[0], dmpca[1], dmpca[2]).getOutput();
                var dmpCap = aa.cap.getCap(dmpCapId).getOutput();
                var dmpStatus = dmpCap.getCapStatus();
                aa.print(dmpId);
                aa.print(dmpCapId.getCustomID());
                if (dmpStatus == "Active") {
                    //logDebug(dmpCapId);
					logDebug("Adding record to set: " + dmpCapId.getCustomID());
                    addCapSetMember(dmpCapId, setResult);
                }       
            }
        }

        logDebug("Change set status to Pending: ");
        updateSetStatus(setResult.setID, setResult.setID, "Processing", "Pending", "Pending");
    }

    logDebug("***** END: STEP2 - Set creation ***** ");

    //STEP3: Process set and create choice 1 and choice 2 process array
    logDebug("***** START: STEP3 - record array creation ***** ");
    var drw = new Draw_Obj(currYear, 'NA', 0, DRAW_IBP, false);
    ordAinfo = drw.getPreorderAinfo();  //used to set preference bucket order

    var choice1RecordsArray = new Array();
    var choice2RecordsArray = new Array();

    var settprocess = new capSet(setResult.setID);
    var vSetMembers = settprocess.members;
    for (thisCap in vSetMembers) {
        if (elapsed() > maxSeconds) // only continue if time hasn't expired
        {
            isPartialSuccess = true;
            showDebug = true;
            logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
            timeExpired = true;
            break;
        }

        var dmpca = String(vSetMembers[thisCap]).split("-");
        var dmpCapId = aa.cap.getCapID(dmpca[0], dmpca[1], dmpca[2]).getOutput();
        var dmpCap = aa.cap.getCap(dmpCapId).getOutput();
        var dmpAltId = dmpCapId.getCustomID();
        var dmpStatus = dmpCap.getCapStatus();
        appTypeResult = dmpCap.getCapType();
        appTypeString = appTypeResult.toString();
        //logDebug(dmpCapId);
        //logDebug(dmpAltId);
        //logDebug(appTypeString);

        var dmpAinfo = new Array();
        loadAppSpecific(dmpAinfo, dmpCapId);
        //logGlobals(dmpAinfo);
		var drawTable = loadASITable("DRAW RESULT", dmpCapId);
		for(i in drawTable)
		{
			var row = drawTable[i];
			if(row["Draw Type"] == "INSTANT")
			{
				if(row["Choice Number"] == 1 && row["Result"] == "LOST")
				{
					var newIbpRec = new IBPREC_OBJ(dmpAinfo["Year"]);
                    newIbpRec.appTypeString = appTypeString;
                    newIbpRec.CapStatus = dmpStatus;
                    newIbpRec.DisabledVet = (dmpAinfo["Military Disabled"] == "CHECKED");
                    newIbpRec.dmpCap = dmpCap;
                    newIbpRec.dmpCapId = dmpCapId;
                    newIbpRec.dmpId = dmpId;
                    newIbpRec.dmpAltId = dmpAltId;
                    newIbpRec.DrawType = dmpAinfo["Draw Type"];
                    newIbpRec.Landowner = (dmpAinfo["Landowner"] == "CHECKED");
                    newIbpRec.PreferencePoints = dmpAinfo["Preference Points"];
                    newIbpRec.PreferenceBucket = dmpAinfo["Preference Bucket"];
                    newIbpRec.Resident = (dmpAinfo["Resident"] == "CHECKED");
                    newIbpRec.ItemCode = dmpAinfo["Item Code"];
                    newIbpRec.Order = getOrderForBucket(newIbpRec.PreferenceBucket, ordAinfo);
                    newIbpRec.ChoiceNum = 1;
                    newIbpRec.WMU = dmpAinfo["WMU Choice 1"];
                    newIbpRec.ApplyLandowner = (dmpAinfo["Apply Land Owner for Choice1"] == "CHECKED");
                    choice1RecordsArray.push(newIbpRec);
				}
				
				if(row["Choice Number"] == 2 && row["Result"] == "LOST")
				{
					var newIbpRec = new IBPREC_OBJ(dmpAinfo["Year"]);
                    newIbpRec.appTypeString = appTypeString;
                    newIbpRec.CapStatus = dmpStatus;
                    newIbpRec.DisabledVet = (dmpAinfo["Military Disabled"] == "CHECKED");
                    newIbpRec.dmpCap = dmpCap;
                    newIbpRec.dmpCapId = dmpCapId;
                    newIbpRec.dmpId = dmpId;
                    newIbpRec.dmpAltId = dmpAltId;
                    newIbpRec.DrawType = dmpAinfo["Draw Type"];
                    newIbpRec.Landowner = (dmpAinfo["Landowner"] == "CHECKED");
                    newIbpRec.PreferencePoints = dmpAinfo["Preference Points"];
                    newIbpRec.PreferenceBucket = dmpAinfo["Preference Bucket"];
                    newIbpRec.Resident = (dmpAinfo["Resident"] == "CHECKED");
                    newIbpRec.ItemCode = dmpAinfo["Item Code"];
                    newIbpRec.Order = getOrderForBucket(newIbpRec.PreferenceBucket, ordAinfo);
                    newIbpRec.ChoiceNum = 2;
                    newIbpRec.WMU = dmpAinfo["WMU Choice 2"];
                    newIbpRec.ApplyLandowner = dmpAinfo["Apply Land Owner for Choice2"];
                    choice2RecordsArray.push(newIbpRec);
				}
			}
		}
    }
    logDebug("***** END: STEP3 - record array creation ***** ");

    //STEP4: SortArrays
    logDebug("***** START: STEP4 - sort arrays ***** ");
    sortIbpRecByAltId(choice1RecordsArray);
    sortIbpRecByOrder(choice1RecordsArray);
    sortIbpRecByAltId(choice2RecordsArray);
    sortIbpRecByOrder(choice2RecordsArray);
    logDebug("***** END: STEP4 - sort arrays ***** ")

    //STEP5: Run IBP lottery for each record in  array
    logDebug("***** START: STEP5 - Run IBP lottery ***** ");
    for (var itm in choice1RecordsArray) {
        if (elapsed() > maxSeconds) // only continue if time hasn't expired
        {
            isPartialSuccess = true;
            showDebug = true;
            logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
            timeExpired = true;
            break;
        }

        RunIBPlotteryForDMP(choice1RecordsArray[itm]);
    }
    for (var itm in choice2RecordsArray) {
        if (elapsed() > maxSeconds) // only continue if time hasn't expired
        {
            isPartialSuccess = true;
            showDebug = true;
            logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
            timeExpired = true;
            break;
        }

        RunIBPlotteryForDMP(choice2RecordsArray[itm]);
    }
    logDebug("***** END: STEP5 - Run IBP lottery ***** ");

    //STEP5: Update Set Status
    (!isPartialSuccess)
    {
        logDebug("***** START: STEP6 - Update Set Status ***** ");
        updateSetStatus(setResult.setID, setResult.setID, "Successfully processed", "Completed", "Completed");
        logDebug("***** END: STEP6 - Update Set Status ***** ");
    }

}
function createIBPSet(recordType) {
    var id = recordType;
    var name = null;
    var setType = "DMP IBP";
    var setStatus = "Initialized";
    var setComment = "Initialized";
    var setStatusComment = "Initialized";
    return createSetbylogic(id, name, setType, setComment, setStatus, setStatusComment)
}

function RunIBPlotteryForDMP(dmpIbpItem) {
    var ibpRec = dmpIbpItem;
    var drw = new Draw_Obj(ibpRec.Year, ibpRec.WMU, ibpRec.ChoiceNum, ibpRec.DrawType, ibpRec.ApplyLandowner);
    drw.IsNyResiDent = ibpRec.Resident;
    drw.IsDisableForYear = ibpRec.DisabledVet;
    drw.IsMilitaryServiceman = ibpRec.DisabledVet;
    drw.PreferencePoints = ibpRec.PreferencePoints;
    drw.ordbAinfo = ordAinfo;
    drw.PreferenceBucketForIbp = ibpRec.PreferenceBucket;

    //Run Lottery and create tags
    //logDebug(ibpRec.ChoiceNum);
    wmu1Result = drw.RunLottery();
	logDebug("Lottery result: " + wmu1Result);
	wmu1Result.Selected = true;
    if (wmu1Result.Selected) {
        //No need to check rule for DMP since DMP is available only fo qualified customers only
        var ruleParams = null;
        var parentCapId = getParent(ibpRec.dmpCap);
		
        CreateTags(arryTags_DMP, ruleParams, ibpRec.ItemCode, wmu1Result, parentCapId);
        if (ibpRec.ChoiceNum == 1) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 1 IBP", " - " + ibpRec.WMU + ":  SELECTED", AInfo["CODE.NEW_DEC_DOCID"], ibpRec.dmpCapId);
        } else if (ibpRec.ChoiceNum == 2) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 2 IBP", " - " + ibpRec.WMU + ":  SELECTED", AInfo["CODE.NEW_DEC_DOCID"], ibpRec.dmpCapId);
        }
    } else {
        if (ibpRec.ChoiceNum == 1) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 1 IBP", " - " + ibpRec.WMU + ":  NOT SELECTED", "", ibpRec.dmpCapId);
        } else if (ibpRec.ChoiceNum == 2) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 2 IBP", " - " + ibpRec.WMU + ":  NOT SELECTED", "", ibpRec.dmpCapId);
        }
    }
    //logDebug(wmu1Result.Result());
    //connect tag to DMP record
    var result = aa.cap.createAppHierarchy(ibpRec.dmpCapId, AInfo["CODE.NEW_DOC_CAP_ID"]);
    if (result.getSuccess()) {
        logDebug("Parent DMP successfully linked");
    }
    else {
        logDebug("Could not link DMP" + result.getErrorMessage());
    }

    //UpdateDMP Fields
    var newAInfo = new Array();
    if (ibpRec.ChoiceNum == 1) {
        newAInfo.push(new NewLicDef("WMU Choice 1 Result IBP", wmu1Result.Result()));
    }
    if (ibpRec.ChoiceNum == 2) {
        newAInfo.push(new NewLicDef("WMU Choice 2 Result IBP", wmu1Result.Result()));
    }
    copyLicASI(ibpRec.dmpCapId, newAInfo);

}
function IBPREC_OBJ(year) {
    this.Year = year;
    this.WMU = null;
    this.DrawType = null;
    this.ChoiceNum = null;
    this.PreferencePoints = null;
    this.Landowner = null;
    this.DisabledVet = null;
    this.Resident = null;
    this.PreferenceBucket = null;
    this.dmpId = null;
    this.dmpCapId = null;
    this.dmpCap = null;
    this.dmpAltId = null;
    this.CapStatus = null;
    this.appTypeString = '';
    this.ApplyLandowner = null;
    this.Order = 0;
    this.ItemCode = null;
}
function sortIbpRecByAltId(elements) {
    for (var out = elements.length - 1; out > 0; out--) {
        for (var inn = 0; inn < out; inn++) {
            if (elements[inn].dmpCapId > elements[inn + 1].dmpCapId) {
                var t = elements[inn + 1];
                elements[inn + 1] = elements[inn];
                elements[inn] = t;
            }
        }
    }
    return elements;
}

function sortIbpRecByOrder(elements) {
    for (var out = elements.length - 1; out > 0; out--) {
        for (var inn = 0; inn < out; inn++) {
            if (parseFloat(elements[inn].Order) > parseFloat(elements[inn + 1].Order)) {
                var t = elements[inn + 1];
                elements[inn + 1] = elements[inn];
                elements[inn] = t;
            }
        }
    }
    return elements;
}