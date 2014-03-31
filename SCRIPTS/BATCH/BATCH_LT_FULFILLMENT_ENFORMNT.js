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
//aa.env.setValue("lookBackDays", "20");

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
var startDate = new Date();
var startTime = startDate.getTime(); 		// Start timer
var vToday = startDate;
var useAppSpecificGroupName = false;
vToday.setHours(0);
vToday.setMinutes(0);
vToday.setSeconds(0);
var isPartialSuccess = false;
var timeExpired = false;
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
    var returnArray = getRefContactsByEnforcemetLifted();
    return returnArray;
}

/* FUNCTION TO GET ALL REF CONTACTS FOR A lifted enforcement for a day.*/
function getRefContactsByEnforcemetLifted(ipRefContacts) {
    var returnArray = new Array();
    var opRefContacts = aa.util.newHashMap();
    var opRefContactsRecNeedToAttach = aa.util.newHashMap();
    var sql = "SELECT DISTINCT L1_ENTITY_ID FROM L3COMMON_CONDIT ";
    sql += "WHERE L1_CON_STATUS_TYP = 'Not Applied' and REC_DATE >= (trunc(sysdate) - " + lookBackDays + ")";

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var isReafyForFullfillement = false;
        var fvRefContactNumber = rSet.getString("L1_ENTITY_ID");
        logDebug("fvRefContactNumber : " + fvRefContactNumber);
        var contactCondArray = getContactCondutions(fvRefContactNumber);
        var isRevoked_Hunting = isRevocationHunting(contactCondArray);
        var isRevoked_Trapping = isRevocationTrapping(contactCondArray);
        var isRevoked_Fishing = isRevocationFishing(contactCondArray);
        var isAnySuspension = isSuspension(contactCondArray);
        var newRecArray = new Array();

        if (!isAnySuspension) {
            logDebug("In Suspension:");
            var sql = "SELECT A.SERV_PROV_CODE,A.B1_PER_ID1,A.B1_PER_ID2,A.B1_PER_ID3,A.B1_PER_GROUP, A.B1_PER_TYPE, A.B1_PER_SUB_TYPE, A.B1_PER_CATEGORY  FROM B1PERMIT A ";
            sql += "INNER JOIN B3CONTACT D ON A.SERV_PROV_CODE = D.SERV_PROV_CODE AND A.B1_PER_ID1 = D.B1_PER_ID1 AND A.B1_PER_ID2 = D.B1_PER_ID2 AND A.B1_PER_ID3 = D.B1_PER_ID3 ";
            sql += "WHERE A.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' ";
            sql += "AND D.g1_contact_nbr = " + fvRefContactNumber + " ";
            sql += "AND A.rec_status = 'A' AND D.rec_status = 'A' AND A.b1_module_name = 'Licenses' ";
            sql += "AND A.b1_appl_status = 'Suspended' ";

            var sStmt = conn.prepareStatement(sql);
            var recSet = sStmt.executeQuery();

            while (recSet.next()) {
                var capIdModel = aa.cap.getCapID(recSet.getString("B1_PER_ID1"), recSet.getString("B1_PER_ID2"), recSet.getString("B1_PER_ID3")).getOutput();
                var itemCap = aa.cap.getCapBasicInfo(capIdModel).getOutput();
                var itemCapId = itemCap.getCapID();
                appTypeResult = itemCap.getCapType();

                appTypeString = appTypeResult.toString();
                var ata = appTypeString.split("/");
                if (ata[1] == "Lifetime") {
                    changeRecordStatus(itemCapId);
                } else {
                    var newRecId = voidRecAndCreateNew(itemCapId, ata);
                    newRecArray.push(newRecId);
                }
                isReafyForFullfillement = isReafyForFullfillement || true;
            }
        }

        if (!(isRevoked_Hunting && isRevoked_Trapping && isRevoked_Fishing)) {
            logDebug("In Revokation:");
            var sql = "SELECT A.SERV_PROV_CODE,A.B1_PER_ID1,A.B1_PER_ID2,A.B1_PER_ID3,A.B1_PER_GROUP, A.B1_PER_TYPE, A.B1_PER_SUB_TYPE, A.B1_PER_CATEGORY  FROM B1PERMIT A ";
            sql += "INNER JOIN B3CONTACT D ON A.SERV_PROV_CODE = D.SERV_PROV_CODE AND A.B1_PER_ID1 = D.B1_PER_ID1 AND A.B1_PER_ID2 = D.B1_PER_ID2 AND A.B1_PER_ID3 = D.B1_PER_ID3 ";
            sql += "WHERE A.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' ";
            sql += "AND D.g1_contact_nbr = " + fvRefContactNumber + " ";
            sql += "AND A.rec_status = 'A' AND D.rec_status = 'A' AND A.b1_module_name = 'Licenses' ";
            sql += "AND A.b1_appl_status = 'Revoked' ";

            var sStmt = conn.prepareStatement(sql);
            var recSet = sStmt.executeQuery();

            while (recSet.next()) {
                var capIdModel = aa.cap.getCapID(recSet.getString("B1_PER_ID1"), recSet.getString("B1_PER_ID2"), recSet.getString("B1_PER_ID3")).getOutput();
                var itemCap = aa.cap.getCapBasicInfo(capIdModel).getOutput();
                var itemCapId = itemCap.getCapID();
                appTypeResult = itemCap.getCapType();
                appTypeString = appTypeResult.toString();
                var ata = appTypeString.split("/");

                if (exists(appTypeString, getRevokHuntRecTypeArray()) && !isRevoked_Hunting) {
                    if (ata[1] != "Lifetime") {
                        changeRecordStatus(itemCapId);
                    } else {
                        var newRecId = voidRecAndCreateNew(itemCapId, ata);
                        newRecArray.push(newRecId);
                    }
                    isReafyForFullfillement = isReafyForFullfillement || true;
                }

                if (exists(appTypeString, getRevokFishRecTypeArray()) && !isRevoked_Fishing) {
                    if (ata[1] == "Lifetime") {
                        changeRecordStatus(itemCapId);
                    } else {
                        var newRecId = voidRecAndCreateNew(itemCapId, ata);
                        newRecArray.push(newRecId);
                    }
                    isReafyForFullfillement = isReafyForFullfillement || true;

                }

                if (exists(appTypeString, getRevokTrapRecTypeArray()) && !isRevoked_Trapping) {
                    if (ata[1] == "Lifetime") {
                        changeRecordStatus(itemCapId);
                    } else {
                        var newRecId = voidRecAndCreateNew(itemCapId, ata);
                        newRecArray.push(newRecId);
                    }
                    isReafyForFullfillement = isReafyForFullfillement || true;
                }
            }
        }
        logDebug("isReafyForFullfillement : " + isReafyForFullfillement);
        if (isReafyForFullfillement) {
            logDebug("Adding in a list " + fvRefContactNumber + " based on enforcement lifted.");
            opRefContacts.put(fvRefContactNumber, fvRefContactNumber);
            opRefContactsRecNeedToAttach.put(fvRefContactNumber, newRecArray);
        }
    }

    conn.close();

    returnArray.push(opRefContacts);
    returnArray.push(opRefContactsRecNeedToAttach);
    return returnArray;
}
function changeRecordStatus(itemCapId) {
    updateAppStatus("Active", "Active", itemCapId);
    activateTaskForRec("Report Game Harvest", "", itemCapId);
    activateTaskForRec("Void Document", "", itemCapId);
    activateTaskForRec("Revocation", "", itemCapId);
    activateTaskForRec("Suspension", "", itemCapId);
}
function runProcessRecords(ipRunArray) {
    var opErrors = null;
    var ipRefs = ipRunArray[0]; //Ref Contacts
    var ipRefsNewRec = ipRunArray[1]; //Ref Contacts
    if (ipRefs) {
        fvRefContacts = ipRefs.keySet().toArray();
        if (fvRefContacts.length == 0) {
            showDebug = true;
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
				var fvNewRec = null;
				if (ipRefsNewRec) {
					//new Licenses created due enforcement lifted
					fvNewRec = ipRefsNewRec.get(fvRefContact);
				}			
                var fvErrors = rebuildRefTags(fvRefContact, fvNewRec);
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
        showDebug = true;
        opErrors = new Array();
        opErrors.push("No Reference Contacts to be processed.");
    }
    return opErrors;
}

function rebuildRefTags(ipRefContact, ipNewRec) {
    var opErrors = rebuildAllTagsforaRefContact(ipRefContact, vToday, ipNewRec);
    return opErrors;
}

function showErrors(ipErrors) {
    for (var fvCount in ipErrors) {
        var fvError = ipErrors[fvCount];
        logDebug("Error " + fvError);
    }
}
function voidRecAndCreateNew(itemCapId, ata) {
    logDebug("ENTER: voidRecAndCreateNew " + itemCapId.getCustomID());
    updateAppStatus("Void", "Void", itemCapId);
    // now create a new one, 
    var newCapId = createChildForDec(ata[0], ata[1], ata[2], ata[3], "");
    copyASIFields(itemCapId, newCapId);
    updateAppStatus("Active", "Active", newCapId);
    activateTaskForRec("Report Game Harvest", "", newCapId);
    activateTaskForRec("Void Document", "", newCapId);
    activateTaskForRec("Revocation", "", newCapId);
    activateTaskForRec("Suspension", "", newCapId);
    copyConditions(itemCapId, newCapId);

    //copy the expiration information
    oldLicObj = new licenseObject(null, itemCapId);
    if (oldLicObj && oldLicObj != null) {
        setLicExpirationStatus(newCapId, "Active");
        oldExpDate = oldLicObj.b1ExpDate;
        setLicExpirationDate(newCapId, null, oldExpDate);
    }
    var newDecDocId = GenerateDocumentNumber(newCapId.getCustomID(), "9989");
    updateDocumentNumber(newDecDocId, newCapId);

    logDebug("EXIT: voidRecAndCreateNew");

    return newDecDocId;
}



	