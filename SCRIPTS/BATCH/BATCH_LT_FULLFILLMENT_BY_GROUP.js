/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LT_FULLFILLMENT_ALL.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Yearly)
| Agency  : DEC
| Purpose : Batch to create tags for Lifetime fullfillment.
| Notes   : 10/15/2013     Laxmikant Bondre (LBONDRE),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "lalit@accela.com");
//aa.env.setValue("LookAheadDays", 30);
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("FromGroupNumber", "1");
//aa.env.setValue("ToGroupNumber", "1");
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
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_BATCH"));
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
var vLookAheadDays = parseInt(getParam("LookAheadDays"), 10);     // LookAhead Days From Report Manager
var fromGroupNumber = isNull(aa.env.getValue("FromGroupNumber"), "0");
var toGroupNumber = isNull(aa.env.getValue("ToGroupNumber"), "0");
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
var useAppSpecificGroupName = false;
var vToday = startDate;
var seasonPeriod = GetDateRange(DEC_CONFIG, LICENSE_SEASON, startDate.getFullYear());
vToday = seasonPeriod[0];
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
var vEffDate;
var maxThreads = -1;
var threadArr = new Array();
var threadPrfix = "LT_RUN_GROUP_NUM_";
var isGropupLogic = false;
var useffrectype = true;
var annualFulfillment = true;

logDebug("Start of Job");

if (!timeExpired) var isSuccess = mainProcess();
logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
if (isSuccess) {
    aa.print("Passed");
    //aa.env.setValue("ScriptReturnCode", "0");
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
    //aa.env.setValue("ScriptReturnCode", "1");
    //aa.env.setValue("ScriptReturnMessage", "Batch Job failed: " + emailText);
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

        getEffDate();
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
    opRefContacts = getRefContactsBySqlusingGroupRange(opRefContacts, fromGroupNumber, toGroupNumber);
    return opRefContacts;
}

function getEffDate() {
    vEffDate = convertDate(dateAdd(vToday, vLookAheadDays));
}

//Obsolete Function 
function getAllRefsToProcessByGroup() {
    var opRefContacts = aa.util.newHashMap();

    var groupNumber = -1;
    if (arguments.length == 1) {
        groupNumber = arguments[0];
    }
    var subgroupname = null;
    if (groupNumber == -1) {
        //Following is the function which has limitation of 3000
        //opRefContacts = getRefContactsByRecTypeByStatus("Licenses","Lifetime",null,null,"Active",opRefContacts);
        opRefContacts = getRefContactsBySql(opRefContacts);
    } else {
        opRefContacts = getRefContactsBySqlusingGroup(opRefContacts, groupNumber);

    }
    return opRefContacts;
}

//Obsolete Function 
/* FUNCTION TO GET ALL REF CONTACTS FOR A RECORD TYPE, FOR A STATUS WITH A BIRTHDATE.*/
function getRefContactsByRecTypeByStatus(ipGroup, ipType, ipSubType, ipCategory, ipStatus, ipRefContacts) {
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

    if (ipStatus != null && ipStatus != "") {
        fvEmptyCm.setCapStatus(ipStatus);
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
                var fvCap = fvCaps[fvCount1];
                var fvCapQry = aa.cap.getCapID(fvCap.ID1, fvCap.ID2, fvCap.ID3);
                if (fvCapQry.getSuccess()) {
                    var fvCapID = fvCapQry.getOutput();
                    var fvContactQry = aa.people.getCapContactByCapID(fvCapID);
                    if (fvContactQry.getSuccess()) {
                        var fvContacts = fvContactQry.getOutput();
                        for (var fvCount2 in fvContacts) {
                            var fvCapContact = fvContacts[fvCount2];
                            var fvContact = fvCapContact.getCapContactModel();
                            var fvRefContactNumber = fvContact.refContactNumber;
                            if (!fvRefContactNumber || fvRefContactNumber == "")
                                continue;
                            var fvRefContactQry = aa.people.getPeople(fvRefContactNumber);
                            if (!fvRefContactQry || !fvRefContactQry.getSuccess())
                                continue;
                            var fvRefContact = fvRefContactQry.getOutput();
                            if (!fvRefContact)
                                continue;
                            if (fvRefContact.contactType != "Individual")
                                continue;
                            if (fvRefContact.getDeceasedDate())
                                continue;
                            if (!opRefContacts.containsKey(fvRefContactNumber)) {
                                if (fvRefContactNumber)
                                    opRefContacts.put(fvRefContactNumber, fvRefContactNumber);
                            }
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
                var fvRefContact = fvRefContacts[fvCounter];
                var fvError = rebuildRefTags(fvRefContact);
                if (fvError) {
                    if (!opErrors)
                        opErrors = new Array();
                    opErrors.push(fvError);
                } else {
                    if (isGropupLogic) {
                        updateRefContactsUdf2(fvRefContact, 2);
                    }
                }
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
    var opErrors = rebuildAllTagsforaRefContact(ipRefContact, vEffDate);
    return opErrors;
}

function showErrors(ipErrors) {
    for (var fvCount in ipErrors) {
        var fvError = ipErrors[fvCount];
        logDebug(fvError);
    }
}

//Obsolete Function 
function getRefContactsBySql(ipRefContacts) {
    var sql = " SELECT ( ( ROWNUM - MOD(ROWNUM, 1000) ) / 1000 ) + 1 AS ThreadNum, ";
    sql += " g1_contact_nbr ";
    sql += " FROM (SELECT DISTINCT D.g1_contact_nbr ";
    sql += " FROM b1permit A ";
    sql += " inner join b3contact D ";
    sql += " ON A.serv_prov_code = D.serv_prov_code ";
    sql += " AND A.b1_per_id1 = D.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = D.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = D.b1_per_id3 ";
    sql += " WHERE  A.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND A.rec_status = 'A' ";
    sql += " AND D.rec_status = 'A' ";
    sql += " AND A.b1_module_name = 'Licenses' ";
    sql += " AND A.b1_per_group = 'Licenses' ";
    sql += " AND A.b1_per_type = 'Lifetime' ";
    sql += " AND A.B1_PER_SUB_TYPE = 'Hunting' ";
    sql += " AND A.b1_appl_status = 'Active' ";
    //sql += " AND rownum < 100 ";
    sql += " AND b1_contact_type = 'Individual') v ";

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var fvRefContactNumber = rSet.getString("g1_contact_nbr");
        if (!fvRefContactNumber || fvRefContactNumber == "")
            continue;
        var fvRefContactQry = aa.people.getPeople(fvRefContactNumber);
        if (!fvRefContactQry || !fvRefContactQry.getSuccess())
            continue;
        var fvRefContact = fvRefContactQry.getOutput();
        if (!fvRefContact)
            continue;
        if (fvRefContact.contactType != "Individual")
            continue;
        if (fvRefContact.getDeceasedDate())
            continue;
        if (!ipRefContacts.containsKey(fvRefContactNumber)) {
            if (fvRefContactNumber)
                ipRefContacts.put(fvRefContactNumber, fvRefContactNumber);
        }
    }
    return ipRefContacts;
}

//Obsolete Function 
function mainProcessUsingThread() {
    var fvError = null;
    isGropupLogic = true;
    try {
        var fvSuccess = checkBatch();
        if (!fvSuccess) return false;

        logDebug("****** Start logic ******");

        //STEP 1: 
        updateRefContactsUdf(1);

        //STEP 2: 
        //Find Out max Thread Count
        var nThreadCount = getMaxThreadCount();
        maxThreads = parseInt(nThreadCount);

        threadProcess(1, threadPrfix + "1", new Array());
        return false;

        //STEP 3: 
        //Start Threads number 
        //QUESTION: Is there any limit? Any technical constrints?
        if (maxThreads > -1) {
            for (i = 1; i <= maxThreads; i++) {
                var arr = new Array();
                threadArr[i] = new threadObj(i, threadPrfix + i, arr);
            }
            //Start all the threads
            for (t in threadArr) {
                threadArr[t].start();
                aa.print("Thread " + threadPrfix + t + " started.")
                aa.log("Thread " + threadPrfix + t + " started.")
            }
        }

        //STEP 4: Thread Tracking 
        //monitor threads
        var running = true;
        while (running) {
            var isAlive = false
            for (t in threadArr) {
                if (threadArr[t].alive()) {
                    aa.print("Thread " + threadPrfix + t + " Running.")
                    aa.log("Thread " + threadPrfix + t + " Running.")
                    isAlive = true;
                    trackThreadLog(threadArr[t].Identity, "Running.");
                }
                else {
                    aa.print("Thread " + threadPrfix + t + " is finished.")
                    aa.log("Thread " + threadPrfix + t + " is finished.")
                    trackThreadLog(threadArr[t].Identity, "Finished.");
                }
            }
            //give a wait before checking threads
            thread = new java.lang.Thread();
            thread.sleep(100);
            if (!isAlive) {
                running = false;
                aa.print("DONE")
                aa.log("DONE")
            }
        }

        logDebug("****** End logic ******");

        return true;
    }
    catch (fvError) {
        logDebug("Runtime error occurred: " + fvError);
        return false;
    }
}

//Obsolete Function 
function getMaxThreadCount() {
    var sql = " Select max(G1_UDF1) as maxThreadCount from G3CONTACT ";
    sql += " WHERE serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND nvl(G1_UDF2, 1) = 1 ";
    sql += " AND G1_UDF1 is Not Null ";
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    var nThreadCount = -1;
    while (rSet.next()) {
        nThreadCount = rSet.getString("maxThreadCount");
    }
    conn.close();

    return nThreadCount;
}

//Obsolete Function 
function getRefContactsBySqlusingGroup(ipRefContacts, ipGroupNumber) {
    var sql = " Select G1_CONTACT_NBR from G3CONTACT ";
    sql += " WHERE serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND G1_UDF1 =  " + ipGroupNumber;
    sql += " AND nvl(G1_UDF2, 1) = 1 ";

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var fvRefContactNumber = rSet.getString("G1_CONTACT_NBR");
        if (!fvRefContactNumber || fvRefContactNumber == "")
            continue;
        var fvRefContactQry = aa.people.getPeople(fvRefContactNumber);
        if (!fvRefContactQry || !fvRefContactQry.getSuccess())
            continue;
        var fvRefContact = fvRefContactQry.getOutput();
        if (!fvRefContact)
            continue;
        if (fvRefContact.contactType != "Individual")
            continue;
        if (fvRefContact.getDeceasedDate())
            continue;
        if (!ipRefContacts.containsKey(fvRefContactNumber)) {
            if (fvRefContactNumber)
                ipRefContacts.put(fvRefContactNumber, fvRefContactNumber);
        }
    }
    return ipRefContacts;
}

function getRefContactsBySqlusingGroupRange(ipRefContacts, ipFromGroupNumber, ipToGroupNumber) {
    isGropupLogic = true;

    var sql = " Select G1_CONTACT_NBR from G3CONTACT ";
    sql += " WHERE serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND TO_NUMBER(G1_UDF1) Between  " + ipFromGroupNumber;
    sql += " AND " + ipToGroupNumber;
    sql += " AND nvl(G1_UDF2, 1) = 1 ";
    //sql += " AND rownum < 10 ";

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var fvRefContactNumber = rSet.getString("G1_CONTACT_NBR");
        if (!fvRefContactNumber || fvRefContactNumber == "")
            continue;
        var fvRefContactQry = aa.people.getPeople(fvRefContactNumber);
        if (!fvRefContactQry || !fvRefContactQry.getSuccess())
            continue;
        var fvRefContact = fvRefContactQry.getOutput();
        if (!fvRefContact)
            continue;
        if (fvRefContact.contactType != "Individual")
            continue;
        if (fvRefContact.getDeceasedDate())
            continue;
        if (!ipRefContacts.containsKey(fvRefContactNumber)) {
            if (fvRefContactNumber)
                ipRefContacts.put(fvRefContactNumber, fvRefContactNumber);
        }
    }
    return ipRefContacts;
}
//Obsolete Function 
function threadObj(threadNumber, identity, parArray) {
    this.Identity = identity;
    this.ThreadNumber = threadNumber;

    //the Runable object
    runObject = {
        //some parameters  use JSON formatting
        sr: "",
        parr: {},
        run: function () {
            //make this object call whatever it is that should be threaded
            result = threadProcess(this.threadNumber, this.identity, this.parr);
        }
    };

    //Create the runnable object and set parameters
    var ro = new java.lang.Runnable(runObject);
    ro.sr = identity;
    ro.parr = parArray;
    ro.identity = identity;
    ro.threadNumber = threadNumber;

    //create the thread object
    var thread = new java.lang.Thread(ro);

    //functions to start and check if the thread is alive 
    this.start = function () { thread.start(); }
    this.alive = function () { return thread.isAlive() };
}

//Obsolete Function 
function threadProcess(threadNumber, identity, parArray) {
    var vError;
    try {
        trackThreadLog(identity, "Processing.");

        getEffDate();
        var fvRefs = getAllRefsToProcess(threadNumber);
        var fvErrors = runProcessRecords(fvRefs);
        if (fvErrors) {
            showErrors(fvErrors);
            return false;
        }
        trackThreadLog(identity, "Processed.");
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return false;
    }

}

//Obsolete Function 
function trackThreadLog(threadName, status) {
    var vError;
    try {
        editLookup("TRACK_THREAD", threadName + "", status + "");
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return false;
    }
}

//Obsolete Function 
function updateRefContactsUdf(nRecStatus) {
    var CONST_GROUP_COUNT = 5;
    var sql = " SELECT ( ( ROWNUM - MOD(ROWNUM, " + CONST_GROUP_COUNT + ") ) / " + CONST_GROUP_COUNT + " ) + 1 AS ThreadNum, ";
    sql += " g1_contact_nbr ";
    sql += " FROM (SELECT DISTINCT D.g1_contact_nbr ";
    sql += " FROM b1permit A ";
    sql += " inner join b3contact D ";
    sql += " ON A.serv_prov_code = D.serv_prov_code ";
    sql += " AND A.b1_per_id1 = D.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = D.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = D.b1_per_id3 ";
    sql += " WHERE  A.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND A.rec_status = 'A' ";
    sql += " AND D.rec_status = 'A' ";
    sql += " AND A.b1_module_name = 'Licenses' ";
    sql += " AND A.b1_per_group = 'Licenses' ";
    sql += " AND A.b1_per_type = 'Lifetime' ";
    sql += " AND A.b1_appl_status = 'Active' ";
    sql += " AND b1_contact_type = 'Individual' ";
    sql += " AND EXISTS (SELECT 1 ";
    sql += " FROM g3contact I ";
    sql += " WHERE I.serv_prov_code = A.serv_prov_code ";
    sql += " AND I.rec_status = 'A' ";
    sql += " AND I.g1_contact_nbr = D.g1_contact_nbr ";
    sql += " AND NVL(G1_UDF2, 1) = 1) ";
    sql += " ) v ";
    //logDebug(sql);

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var fvRefContactNumber = rSet.getString("g1_contact_nbr");
        var fvGroupNum = rSet.getString("ThreadNum");
        var usql = " Update G3CONTACT Set G1_UDF1 = " + fvGroupNum + ", G1_UDF2 = " + nRecStatus + " Where g1_contact_nbr = " + fvRefContactNumber;

        var sStmt1 = conn.prepareStatement(usql);
        var rret = sStmt1.executeQuery();
    }
    conn.close();

    logDebug('Done');

}

function updateRefContactsUdf2(refNum, nRecStatus) {
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var usql = " Update G3CONTACT Set G1_UDF2 = " + nRecStatus + " Where g1_contact_nbr = " + refNum;
    var sStmt1 = conn.prepareStatement(usql);
    var rret = sStmt1.executeQuery();
    conn.close();
	logDebug('Updated ' + refNum + ' With ' + nRecStatus);
}
