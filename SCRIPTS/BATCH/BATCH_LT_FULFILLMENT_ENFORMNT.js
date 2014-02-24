/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LT_FULFILLMENT_ENFORMNT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create tags for Lifetime fullfillment.
| Notes   : 02/24/2014     Lalit Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("lookBackDays", "10");

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
/*------------------------------------------------------------------------------------------------------/
| END: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
var servProvCode = aa.getServiceProviderCode();
var showDebug = isNull(aa.env.getValue("showDebug"), "N") == "Y";
var lookBackDays = isNull(aa.env.getValue("lookBackDays"), "1");   	// Number of days from today
var batchJobID = 0;
var batchJobName = "";
var batchJobDesc = "";
var batchJobResult = "";
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var currentUser = aa.person.getCurrentUser().getOutput();
var startDate = new Date();
var startTime = startDate.getTime(); 		// Start timer
var vToday = startDate;
var useAppSpecificGroupName = false;
vToday.setHours(0);
vToday.setMinutes(0);
vToday.setSeconds(0);
var isPartialSuccess = false;
var timeExpired = false;
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
var capId = null;
var debug;

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

function mainProcess() {
    var fvError = null;
    try {
        var fvSuccess = checkBatch();
        if (!fvSuccess) return false;

        logDebug("****** Start logic ******");

        var fvRefs = getAllRefsToProcess();
        var fvErrors = runProcessRecords(fvRefs);
        if (fvErrors) {
            showErrors(fvErrors);
            return false;
        }

        logDebug("****** End logic ******");

        return true;
    }
    catch (fvError) {
        logDebug("Runtime error occurred: " + fvError);
        return false;
    }
}

function checkBatch() {
    var fvBatchJobResult = aa.batchJob.getJobID();
    batchJobName = "" + aa.env.getValue("BatchJobName");

    if (fvBatchJobResult.getSuccess()) {
        batchJobID = fvBatchJobResult.getOutput();
        logDebug("Batch job ID found " + batchJobID);
        return true;
    }
    else {
        logDebug("Batch job ID not found " + fvBatchJobResult.getErrorMessage());
        return false;
    }
}

function getAllRefsToProcess() {
    var opRefContacts = getRefContactsByEnforcemetLifted();
    return opRefContacts;
}

/* FUNCTION TO GET ALL REF CONTACTS FOR A lifted enforcement for a day.*/
function getRefContactsByEnforcemetLifted(ipRefContacts) {
    var opRefContacts = aa.util.newHashMap();
    var sql = "SELECT L1_ENTITY_ID FROM L3COMMON_CONDIT ";
    sql += "WHERE L1_CON_STATUS_TYP = 'Not Applied' and REC_DATE >= (trunc(sysdate) - " + lookBackDays + ")";
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var fvRefContactNumber = rSet.getString("L1_ENTITY_ID");

        if (opRefContacts.containsKey(fvRefContactNumber)) {
            logDebug("Already in a list " + fvRefContactNumber + " based on enforcement lifted.");
        }
        else {
            opRefContacts.put(fvRefContactNumber, fvRefContactNumber);
            logDebug("Adding in a list " + fvRefContactNumber + " based on enforcement lifted.");
        }
    }

    return opRefContacts;
}

function runProcessRecords(ipRefs) {
    var opErrors = null;
    if (ipRefs) {
        fvRefContacts = ipRefs.keySet().toArray();
        if (fvRefContacts.length == 0) {
			showDebug = "Y";
            opErrors = new Array();
            opErrors.push("No Reference Contacts to be processed.");
        }
        else {
            for (var fvCounter in fvRefContacts) {
                if (elapsed() > maxSeconds) // only continue if time hasn't expired
                {
                    isPartialSuccess = true;
                    showDebug = true;
                    logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                    timeExpired = true;
                    break;
                }
                var fvRefContact = fvRefContacts[fvCounter];
                var fvErrors = rebuildRefTags(fvRefContact);
                if (fvErrors) {
                    if (!opErrors)
                        opErrors = new Array();
                    for (var fvErrCount in fvErrors)
                        opErrors.push(fvErrors[fvErrCount]);
                    continue;
                }
            }
        }
    }
    else {
		showDebug = "Y";
        opErrors = new Array();
        opErrors.push("No Reference Contacts to be processed.");
    }
    return opErrors;
}

function rebuildRefTags(ipRefContact) {
    var opErrors = rebuildAllTagsforaRefContact(ipRefContact, vToday);
    return opErrors;
}

function showErrors(ipErrors) {
    for (var fvCount in ipErrors) {
        var fvError = ipErrors[fvCount];
        logDebug("Error " + fvError);
    }
}
