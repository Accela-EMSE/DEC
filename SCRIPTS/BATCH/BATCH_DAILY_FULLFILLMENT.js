/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_DAILY_FULLFILLMENT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create set for daily fullfillment.
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("setPrefix", "DAILY");
//aa.env.setValue("emailAddress", "");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("ReportName", "1 - ApplicationType");
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
var setPrefix = getParam("setPrefix"); 						//   Prefix for set ID
var reportName = isNull(getParam("ReportName"), '');     // Report Name From Report Manager
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
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
//var AInfo = new Array();
var capId = null;
//var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var CONST_RECORDS_PER_SET = 50;

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

        vSuccess = SetDailyFullfillmentLogic();

        logDebug("****** End logic ******");

        return vSuccess;
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return false;
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

function SetDailyFullfillmentLogic() {
    var isValid = true;
    if (reportName == '') {
        showDebug = true;
        logDebug("Reporname parameter is not blank. ");
        isValid = false;
    }
    if (setPrefix == '') {
        showDebug = true;
        logDebug("setPrefix parameter is not blank. ");
        isValid = false;
    }
    if (!isValid) {
        return false;
    }

    var uniqueCapIdArray = aa.util.newHashMap();
    var counter = 0;
    var recId;

    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
    if (counter == 0 && setPrefix.length > 0) {
        setResult = createFullfillmentSet(setPrefix);
        updateSetStatus(setResult.setID, setResult.setID, "Processing", "Pending", "Pending");
        uniqueCapIdArray = aa.util.newHashMap();
        var settprocess = new capSet(setResult.setID);
        var vSetMembers = settprocess.members;
        for (thisCap in vSetMembers) {
            recId = vSetMembers[thisCap]
            if (!uniqueCapIdArray.containsKey(recId)) {
                uniqueCapIdArray.put(recId, recId);
            }
        }
    }
    var ffConitions = new COND_FULLFILLMENT();
    var ffCondArray = new Array()
    ffCondArray.push(ffConitions.Condition_DailyInternetSales)
    ffCondArray.push(ffConitions.Condition_DailyCallCenterSales)
    ffCondArray.push(ffConitions.Condition_NeedHuntingEd)
    ffCondArray.push(ffConitions.Condition_VerifyAgedIn)

    var recordTypeArray = new Array()
    recordTypeArray.push("Licenses/Annual/Application/NA");
    recordTypeArray.push("Licenses/Sales/Reprint/Documents");
    recordTypeArray.push("Licenses/Sales/Upgrade/Lifetime");

    for (var yy in recordTypeArray) {
        var ats = recordTypeArray[yy];
        //logDebug(ats);
        var ata = ats.split("/");

        var emptyCm = aa.cap.getCapModel().getOutput();
        var emptyCt = emptyCm.getCapType();
        emptyCt.setGroup(ata[0]);
        emptyCt.setType(ata[1]);
        emptyCt.setSubType(ata[2]);
        emptyCt.setCategory(ata[3]);

        emptyCm.setCapType(emptyCt);
        emptyCm.setCapStatus("Approved");

        for (var ff in ffCondArray) {
            var emCondm = ffConitions.getConditionByFullfillmentType(ffCondArray[ff]);
            emCondm.setConditionStatus("Applied");
            emCondm.setConditionStatusType("Applied");
            
            if (emCondm != null) {
                emptyCm.setCapConditionModel(emCondm);

                var res = aa.cap.getCapIDListByCapModel(emptyCm);
                if (res.getSuccess()) {
                    var vCapList = res.getOutput();
                    for (thisCap in vCapList) {
                        if (elapsed() > maxSeconds) // only continue if time hasn't expired
                        {
                            isPartialSuccess = true;
                            showDebug = true;
                            logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                            timeExpired = true;
                            break;
                        }

                        recId = vCapList[thisCap].getCapID();
                        if (!uniqueCapIdArray.containsKey(recId)) {
                            uniqueCapIdArray.put(recId, recId);
                            var recca = String(recId).split("-");
                            var itemCapId = aa.cap.getCapID(recca[0], recca[1], recca[2]).getOutput();
                            var itemCap = aa.cap.getCap(itemCapId).getOutput();
                            altId = itemCapId.getCustomID();
                            //appTypeResult = itemCap.getCapType();
                            //appTypeString = appTypeResult.toString();
                            var reportFileName = GenerateReport(itemCapId, altId);
                            //logDebug(reportFileName);
                            if (setPrefix.length > 0) {
                                addCapSetMember(itemCapId, setResult);
                            }
                            counter++;
                        }
                        editCapConditionStatus("Fulfillment", ffCondArray[ff], "Verified", "Not Applied", "", itemCapId);
                        removeFullfillmentCapCondition(itemCapId, ffCondArray[ff]);
                        if (counter >= CONST_RECORDS_PER_SET && setPrefix.length > 0) {
                            (!isPartialSuccess)
                            {
                                updateSetStatus(setResult.setID, setResult.setID, "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");

                                setResult = createFullfillmentSet(setPrefix);
                                updateSetStatus(setResult.setID, setResult.setID, "Processing", "Pending", "Pending");
                                uniqueCapIdArray = aa.util.newHashMap();
                            }
                            counter = 0;
                        }
                    }
                }
            }
        }
    }

    if (setPrefix.length > 0) {
        (!isPartialSuccess)
        {
            updateSetStatus(setResult.setID, setResult.setID, "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");
        }
    }

    return true;
}

function createFullfillmentSet(recordType) {
    var id = recordType;
    var name = null;
    var setType = "FULLFILLMENT"; //configured Set Type 
    var setStatus = "Initialized";
    var setComment = "Initialized";
    var setStatusComment = "Initialized";
    return createSetbylogic(id, name, setType, setComment, setStatus, setStatusComment)
}

// Generate Report.
function GenerateReport(itemCapId, altID) {
    var reportFileName = null;
    var repService = new ReportHelper(servProvCode, reportName);
    repService.ReportUser = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
    repService.CapID = itemCapId;
    repService.altID = altID;
    repService.isEDMS = true;
    if (repService.ExecuteReport()) {
        reportFileName = repService.ReportFileName;
    }
    return reportFileName;
}

