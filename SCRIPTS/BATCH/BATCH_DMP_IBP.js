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
eval(getScriptText("INCLUDES_REBUILD_TAGS"));

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
        logDebug("Runtime error occurred in line " + vError.lineNumber + " : " + vError.message);
		logDebug("at " + vError.stack);
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

		var ffConitions = new COND_IBP();

        emptyCm.setCapConditionModel(ffConitions.GetQryForSetforIBPChoice());

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
			var dmpASITinfo = drawTable[i];
			logDebug(dmpAltId + " (" + i + ") " + dmpASITinfo["DRAW TYPE"] + " " + dmpASITinfo["Choice Number"] + " " + dmpASITinfo["Result"]);
			if(dmpASITinfo["DRAW TYPE"] == "INSTANT")
			{
				if(dmpASITinfo["Choice Number"] == 1 && dmpASITinfo["Result"] == "LOST")
				{
					var newIbpRec = new IBPREC_OBJ(dmpAinfo["Year"]);
                    newIbpRec.appTypeString = appTypeString;
                    newIbpRec.CapStatus = dmpStatus;
                    newIbpRec.DisabledVet = (dmpAinfo["Military Disabled"] == "CHECKED");
                    newIbpRec.dmpCap = dmpCap;
                    newIbpRec.dmpCapId = dmpCapId;
                    newIbpRec.dmpId = dmpId;
                    newIbpRec.dmpAltId = dmpAltId;
                    newIbpRec.DrawType = dmpASITinfo["DRAW TYPE"];
                    newIbpRec.Landowner = (dmpASITinfo["Land Owner"] == "CHECKED");
                    newIbpRec.PreferencePoints = dmpAinfo["Preference Points"];
                    newIbpRec.PreferenceBucket = dmpASITinfo["Preference Bucket"];
                    newIbpRec.Resident = (dmpAinfo["Resident"] == "CHECKED");
                    newIbpRec.ItemCode = dmpAinfo["Item Code"];
                    newIbpRec.Order = getOrderForBucket(newIbpRec.PreferenceBucket, ordAinfo);
                    newIbpRec.ChoiceNum = 1;
                    newIbpRec.WMU = dmpASITinfo["WMU"];
                    newIbpRec.ApplyLandowner = (dmpASITinfo["Apply Land Owner"] == "CHECKED");
                    choice1RecordsArray.push(newIbpRec);
				}
				
				if(dmpASITinfo["Choice Number"] == 2 && dmpASITinfo["Result"] == "LOST")
				{
					var newIbpRec = new IBPREC_OBJ(dmpAinfo["Year"]);
                    newIbpRec.appTypeString = appTypeString;
                    newIbpRec.CapStatus = dmpStatus;
                    newIbpRec.DisabledVet = (dmpAinfo["Military Disabled"] == "CHECKED");
                    newIbpRec.dmpCap = dmpCap;
                    newIbpRec.dmpCapId = dmpCapId;
                    newIbpRec.dmpId = dmpId;
                    newIbpRec.dmpAltId = dmpAltId;
                    newIbpRec.DrawType = dmpASITinfo["DRAW TYPE"];
                    newIbpRec.Landowner = (dmpASITinfo["Landowner"] == "CHECKED");
                    newIbpRec.PreferencePoints = dmpAinfo["Preference Points"];
                    newIbpRec.PreferenceBucket = dmpASITinfo["Preference Bucket"];
                    newIbpRec.Resident = (dmpAinfo["Resident"] == "CHECKED");
                    newIbpRec.ItemCode = dmpAinfo["Item Code"];
                    newIbpRec.Order = getOrderForBucket(newIbpRec.PreferenceBucket, ordAinfo);
                    newIbpRec.ChoiceNum = 2;
                    newIbpRec.WMU = dmpASITinfo["WMU"];
                    newIbpRec.ApplyLandowner = dmpASITinfo["Apply Land Owner"];
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

    var dmpTag = new TagProp(LIC53_TAG_DMP_DEER, AA53_TAG_DMP_DEER, "", TAG_TYPE_4_DMP_DEER_TAG, 1);

    var condFulfill = new COND_FULLFILLMENT();
    fullfillCond = condFulfill.Condition_IBPTag;

	//for (var i in drw) { logDebug("drw[" + i + "] = " + drw[i]); }

    //Run Lottery and create tags
    //logDebug(ibpRec.ChoiceNum);
    wmu1Result = drw.RunLottery();

	
	// TODO : testing, add a coin toss until we figure out the lottery
	//wmu1Result.Selected = Math.floor( Math.random() * 2 ) == 1
	wmu1Result.Selected = true;
    	logDebug("Lottery result: " + wmu1Result.Selected);
	if (wmu1Result.Selected) {
        //No need to check rule for DMP since DMP is available only fo qualified customers only
		
		addFullfillmentCondition(ibpRec.dmpCapId, fullfillCond);
        var ruleParams = null;
        var parentCapId = getParent(ibpRec.dmpCapId);
		
		// Issue the new tag manually vs running through CreateTags, because there is no form/rules.
		//CreateTags(arryTags_DMP, ruleParams, ibpRec.ItemCode, wmu1Result, parentCapId);
		var seasonPeriod = GetDateRange(DEC_CONFIG, LICENSE_SEASON, ibpRec.Year);
		var diff = dateDiff(new Date(), seasonPeriod[0]);
		if (diff > 0) {
			var clacExpDt = dateAdd(convertDate(seasonPeriod[1]), 0);
			var startDate = seasonPeriod[0];
			}
		else {
			var clacExpDt = dateAdd(convertDate(seasonPeriod[1]), 0);
			var startDate = new Date();
			}

		newLicId = createNewTag(parentCapId,startDate,clacExpDt,"DMP Deer",null);
		editAppSpecific("Tag Type",TAG_TYPE_4_DMP_DEER_TAG,parentCapId);
		
		// TODO: how to set the years
		/*
		editFileDate(newLicId, ipStartDate);
		editAppSpecific("Year",ibpRec.Year,newLicId);
		var fvYearDesc = lookupDesc("LICENSE_FILING_YEAR_Desc",ipStartDate.getFullYear().toString());
		editAppSpecific("Year Description",fvYearDesc,newLicId);
		*/
			
        
        if (ibpRec.ChoiceNum == 1) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 1 IBP", " - " + ibpRec.WMU + ":  SELECTED", newLicId.getCustomID(), ibpRec.dmpCapId);
        } else if (ibpRec.ChoiceNum == 2) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 2 IBP", " - " + ibpRec.WMU + ":  SELECTED", newLicId.getCustomID(), ibpRec.dmpCapId);
        }
		
		//logDebug(wmu1Result.Result());
		//connect tag to DMP record
		// jhs - not sure where to connect, using this DMP record
		//var result = aa.cap.createAppHierarchy(ibpRec.dmpCapId, AInfo["CODE.NEW_DOC_CAP_ID"]);
		var result = aa.cap.createAppHierarchy(ibpRec.dmpCapId, newLicId);
		if (result.getSuccess()) {
			logDebug("Parent DMP successfully linked");
		}
		else {
			logDebug("Could not link DMP" + result.getErrorMessage());
		}
	}
	else {
        if (ibpRec.ChoiceNum == 1) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 1 IBP", " - " + ibpRec.WMU + ":  NOT SELECTED", "", ibpRec.dmpCapId);
        } else if (ibpRec.ChoiceNum == 2) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 2 IBP", " - " + ibpRec.WMU + ":  NOT SELECTED", "", ibpRec.dmpCapId);
        }
    }
    //UpdateDMP Fields
	// 11/6/2013 JHS:   TODO:   this needs to be re-written to write to the DRAW RESULT ASIT per Raj.   This ASI field doesn't exist. 
	// probably need to add a new row to the DRAW_RESULT table for IBP
	
	var tempObject = new Array();
    //Choice 1 Result
    var fieldInfo = new asiTableValObj("DRAW TYPE", wmu1Result.DrawType, "Y");
    tempObject["DRAW TYPE"] = fieldInfo;
    fieldInfo = new asiTableValObj("WMU", wmu1Result.WMU, "Y");
    tempObject["WMU"] = fieldInfo;
    fieldInfo = new asiTableValObj("Choice Number", "1", "Y");
    tempObject["Choice Number"] = fieldInfo;
    fieldInfo = new asiTableValObj("Result", wmu1Result.Result(), "Y");
    tempObject["Result"] = fieldInfo;
    fieldInfo = new asiTableValObj("Apply Land Owner", wmu1Result.Landowner ? "CHECKED" : "UNCHECKED", "Y");
    tempObject["Apply Land Owner"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points Given", wmu1Result.GivenPreferencePoints + "", "Y");
    tempObject["Preference Points Given"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points After", wmu1Result.RemainingPreferencePoints + "", "Y");
    tempObject["Preference Points After"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Bucket", wmu1Result.PreferenceBucket ? wmu1Result.PreferenceBucket + "" : "" + "", "Y");
    tempObject["Preference Bucket"] = fieldInfo;
    fieldInfo = new asiTableValObj("Land Owner?", "", "N");
    tempObject["Land Owner?"] = fieldInfo;
    fieldInfo = new asiTableValObj("Correct?", "", "N");
    tempObject["Correct?"] = fieldInfo;
	addToASITable("DRAW RESULT",tempObject,ibpRec.dmpCapId)

/*    
	var newAInfo = new Array();
    if (ibpRec.ChoiceNum == 1) {
        newAInfo.push(new NewLicDef("WMU Choice 1 Result IBP", wmu1Result.Result()));
    }
    if (ibpRec.ChoiceNum == 2) {
        newAInfo.push(new NewLicDef("WMU Choice 2 Result IBP", wmu1Result.Result()));
    }
    
	copyLicASI(ibpRec.dmpCapId, newAInfo);
*/
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