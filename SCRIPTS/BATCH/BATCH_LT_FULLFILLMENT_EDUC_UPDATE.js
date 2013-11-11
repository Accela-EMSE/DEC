/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LT_FULLFILLMENT_EDUC_UPDATTE.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create tags for Lifetime fullfillment.
| Notes   : 10/17/2013     Laxmikant Bondre (LBONDRE),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "saxthelm@accela.com");
//aa.env.setValue("showDebug", "Y");
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
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
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
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Batch Job failed: " + emailText);
}

aa.print(debug);
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
    var opRefContacts = aa.util.newHashMap();
    var fvConitions = new COND_FULLFILLMENT();
    
    opRefContacts = getRefContactsByRecTypeByCondition("Licenses","Annual","Application","NA",fvConitions.Condition_EducRefContUpd,opRefContacts);
    return opRefContacts;
}

/* FUNCTION TO GET ALL REF CONTACTS FOR A RECORD TYPE, FOR A STATUS WITH A BIRTHDATE.*/
function getRefContactsByRecTypeByCondition(ipGroup,ipType,ipSubType,ipCategory,ipCondition,ipRefContacts) {
    var fvFind = false;
    var fvEmptyCm = aa.cap.getCapModel().getOutput();
    if ((ipGroup != null && ipGroup != "") ||
        (ipType != null && ipType != "") ||
        (ipSubType != null && ipSubType != "") ||
        (ipCategory != null && ipCategory != "")) {
        var fvEmptyCt = fvEmptyCm.getCapType();
        if (ipGroup != null && ipGroup != "")
            fvEmptyCt.setGroup(ipGroup);
        if (ipType != null && ipType != "")
            fvEmptyCt.setType(ipType);
        if (ipSubType != null && ipSubType != "")
            fvEmptyCt.setSubType(ipSubType);
        if (ipCategory != null && ipCategory != "")
            fvEmptyCt.setCategory(ipCategory);
        fvEmptyCm.setCapType(fvEmptyCt);
        fvFind = true;
    }

    if (ipCondition != null && ipCondition != "") {
        var fvConitions = new COND_FULLFILLMENT();
        var fvEmptyCondm = fvConitions.getConditionByFullfillmentType(ipCondition);
        fvEmptyCondm.setConditionStatus("Applied");
        fvEmptyCondm.setConditionStatusType("Applied");
            
        if (fvEmptyCondm != null)
            fvEmptyCm.setCapConditionModel(fvEmptyCondm);
        fvFind = true;
    }

    if (!fvFind)
        return false;
    var fvResult = aa.cap.getCapIDListByCapModel(fvEmptyCm);
    if (fvResult) {
        var fvCaps = fvResult.getOutput();
        if (fvCaps) {
            opRefContacts = ipRefContacts;
            for (var fvCount1 in fvCaps) {
                if (elapsed() > maxSeconds) // only continue if time hasn't expired
                {
                    isPartialSuccess = true;
                    showDebug = true;
                    logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                    timeExpired = true;
                    break;
                }
                var fvCap = fvCaps[fvCount1];
                var fvCapQry = aa.cap.getCapID(fvCap.ID1,fvCap.ID2,fvCap.ID3);
                if (fvCapQry.getSuccess()) {
                    var fvCapID = fvCapQry.getOutput();
                    var fvContactQry = aa.people.getCapContactByCapID(fvCapID);
                    if (fvContactQry.getSuccess()) {
                        var fvContacts = fvContactQry.getOutput();
                        for (var fvCount2 in fvContacts) {
                            if (elapsed() > maxSeconds) // only continue if time hasn't expired
                            {
                                isPartialSuccess = true;
                                showDebug = true;
                                logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                                timeExpired = true;
                                break;
                            }
                            var fvContactType = fvContacts[fvCount2].getPeople().contactType;
                            if (fvContactType != "Individual")
                                continue;
                            var fvContact = fvContacts[fvCount2].getCapContactModel();
                            var fvCapList = "";
                            if (opRefContacts.containsKey(fvContact.refContactNumber)) {
                                fvCapList = opRefContacts.get(fvContact.refContactNumber).toString();
                                fvCapList = fvCapList + "," + fvCapID.getCustomID();
                                opRefContacts.remove(fvContact.refContactNumber);
                            }
                            else
                                fvCapList = fvCapID.getCustomID();
                            opRefContacts.put(fvContact.refContactNumber,fvCapList);
                        }
                    }
                }
            }
            return opRefContacts;
        }
    }
    return false;
}

function runProcessRecords(ipRefs) {
    var opErrors = null;
    if (ipRefs) {
        fvRefContacts = ipRefs.keySet().toArray();
        if (fvRefContacts.length == 0) {
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
                var fvError = rebuildRefTags(fvRefContact);
                if (fvError) {
                    if (!opErrors)
                        opErrors = new Array();
                    opErrors.push(fvError);
                }
                removeConditionFromCaps(fvRefContact,ipRefs);
            }
        }
    }
    else {
        opErrors = new Array();
        opErrors.push("No Reference Contacts to be processed.");
    }
    return opErrors;
}

function rebuildRefTags(ipRefContact) {
    var opErrors = rebuildAllTagsforaRefContact(ipRefContact,vToday);
    return opErrors;
}

function showErrors(ipErrors) {
    for (var fvCount in ipErrors) {
        var fvError = ipErrors[fvCount];
        logDebug(fvError);
    }
}

function removeConditionFromCaps(ipRefContact,ipRefs) {
    var fvCapList = ipRefs.get(ipRefContact).toString();
    var fvCapArray = fvCapList.split(",");
    var fvConitions = new COND_FULLFILLMENT();
    for (var fvCounter in fvCapArray) {
        var fvCap = fvCapArray[fvCounter];
        var fvCapIDQry = aa.cap.getCapID(fvCap);
        if (fvCapIDQry.getSuccess()) {
            capId = fvCapIDQry.getOutput();
            if (appHasCondition("Fulfillment","Applied",fvConitions.Condition_EducRefContUpd,null)) {
                editCapConditionStatus("Fulfillment", fvConitions.Condition_EducRefContUpd, "Verified", "Not Applied", "", capId);
                removeFullfillmentCapCondition(capId, fvConitions.Condition_EducRefContUpd);
            }
        }
    }
}
