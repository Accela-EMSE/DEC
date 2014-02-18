/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LIC_TAGS_INIT_EXP_STATUS.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to initailize expriation status for licenses, permits and tags to Active if not exits..
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("fromDate", "01/01/2000");
//aa.env.setValue("toDate", "12/31/2014");
//aa.env.setValue("setPrefix", "");
//aa.env.setValue("emailAddress", "");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("appGroup", "Licenses");
//aa.env.setValue("appType", "Tag");
//aa.env.setValue("appSubtype", "Hunting");
//aa.env.setValue("appCategory", "");
//aa.env.setValue("appStatus", "");
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
var fromDate = getParam("fromDate"); 						// Hardcoded dates.   Use for testing only
var toDate = getParam("toDate"); 							// ""
var setPrefix = getParam("setPrefix"); 						//   Prefix for set ID
var lookAheadDays = isNull(aa.env.getValue("lookAheadDays"), "1");   	// Number of days from today
var daySpan = isNull(aa.env.getValue("daySpan"), "0"); 					// Days to search (6 if run weekly, 0 if daily, etc.)
var appGroup = getParam("appGroup"); 						//   app Group to process {Licenses}
var appType = getParam("appType"); 					//   app type to process {Rental License}
var appSubtype = getParam("appSubtype"); 					//   app subtype to process {NA}
var appCategory = getParam("appCategory"); 					//   app category to process {NA}
var capStatus = getParam("appStatus")					//   test for this expiration status
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
// no "from" date, assume for one day since yesterday
if (isNull(fromDate, '') == '') {
    lookAheadDays = -1;
    fromDate = dateAdd(isNull(fromDate, new Date()), parseInt(lookAheadDays));
    toDate = dateAdd(isNull(toDate, new Date()), +parseInt(daySpan));
} else {
    // no "from" date, assume today + number of days to look ahead
    fromDate = dateAdd(isNull(fromDate, new Date()), parseInt(lookAheadDays));
    // no "to" date, assume today + number of look ahead days + span
    toDate = dateAdd(isNull(toDate, new Date()), parseInt(lookAheadDays) + parseInt(daySpan));
}
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
var AInfo = new Array();
var capId = null;
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values

var skipRecordTypeArray = new Array();     //   record types
skipRecordTypeArray.push("Licenses/Annual/Application/NA");

logDebug("Start of Job");
logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

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

        SetExpirationDateLogic();

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

function SetExpirationDateLogic() {
    //STEP1: Init Sets to process
    logDebug("***** START: STEP1 - Set Init ***** ");
    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
    if (setPrefix.length > 0) {
        setResult = createExpDateSet(setPrefix);
        logDebug(setResult.setID);
        updateSetStatus(setResult.setID, setResult.setID, "Processing", "Pending", "Pending");
    }
    logDebug("***** END: STEP1 - Set Init ***** ");

    var emptyCm = aa.cap.getCapModel().getOutput();
    var emptyCt = emptyCm.getCapType();
    if (appGroup.length > 0) {
        emptyCt.setGroup(appGroup);
    }
    if (appType.length > 0) {
        emptyCt.setType(appType);
    }
    if (appSubtype.length > 0) {
        emptyCt.setSubType(appSubtype);
    }
    if (appCategory.length > 0) {
        emptyCt.setCategory(appCategory);
    }
    emptyCm.setCapType(emptyCt);
    if (capStatus.length > 0) {
        emptyCm.setCapStatus(capStatus);
    }

    var dtfromDate = aa.date.parseDate(fromDate);
    var dttoDate = aa.date.parseDate(toDate);

    //var res = aa.cap.getCapIDListByCapModel(capModel);
    var res = aa.cap.getCapListByCollection(emptyCm, null, null, dtfromDate, dttoDate, null, new Array());
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

            var recId = vCapList[thisCap].getCapID();
            var recca = String(recId).split("-");
            var itemCapId = aa.cap.getCapID(recca[0], recca[1], recca[2]).getOutput();
            var itemCap = aa.cap.getCap(itemCapId).getOutput();
            altId = itemCapId.getCustomID();
            appTypeResult = itemCap.getCapType();
            appTypeString = appTypeResult.toString();

            if (exists(appTypeString, skipRecordTypeArray)) {
                logDebug(altId + ": skipping due to application type");
                continue;
            }

            var expResult = aa.expiration.getLicensesByCapID(itemCapId);
            var isStatusExits = false;
            if (expResult.getSuccess()) {
                try {
                    var myExp = expResult.getOutput();
                    if (isNull(myExp.getExpStatus(), '') != '') {
                        isStatusExits = true;
                        logDebug(altId + ": skipping due to expiration record exists");
                    }
                }
                catch (err) {
                    logDebug("**Warning no Expiratin code: " + err.message);
                    logDebug(altId + ": skipping due to no Expiratin code");
                    continue
                }
            }
            if (!isStatusExits) {
                setLicExpirationStatus(itemCapId, 'Active');
                if (setPrefix.length > 0) {
                    //aa.set.add(setResult.getSetID(), altId)
                    addCapSetMember(itemCapId, setResult);
                }
            }
        }
    }

    //STEP5: Update Set Status
    if (setPrefix.length > 0) {
        (!isPartialSuccess)
        {
            logDebug("***** START: STEP4 - Update Set Status ***** ");
            updateSetStatus(setResult.setID, setResult.setID, "Successfully processed", "Completed", "Completed");
            logDebug("***** END: STEP4 - Update Set Status ***** ");
        }
    }
}

function createExpDateSet(recordType) {
    var id = recordType;
    var name = null;
    var setType = "LICENSE TAGS INIT EXPIRATION STATUS"; //configured Set Type 
    var setStatus = "Initialized";
    var setComment = "Initialized";
    var setStatusComment = "Initialized";
    return createSetbylogic(id, name, setType, setComment, setStatus, setStatusComment)
}