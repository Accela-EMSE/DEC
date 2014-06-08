/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LT_DOC_GEN_BY_GROUP.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create set for Lifetime fullfillment.
| Notes   : 10/15/2013     Laxmikant Bondre (LBONDRE),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("setPrefix", "AF");
//aa.env.setValue("emailAddress", "lalit@gcomsoft.com");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("ReportName", "License Tags");
//aa.env.setValue("FromGroupNumber", "0");
//aa.env.setValue("ToGroupNumber", "0");
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
var appTypeArray = new Array();

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
var capId = null;
var CONST_RECORDS_PER_SET = 1000;

logDebug("Start of Job");

if (!timeExpired) var isSuccess = mainProcess();
logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
if (isSuccess) {
    aa.env.setValue("ScriptReturnCode", "0");
    if (isPartialSuccess) {
        aa.env.setValue("ScriptReturnMessage", "A script timeout has caused partial completion of this process.  Please re-run.");
        aa.eventLog.createEventLog("Batch Job run partial successful.", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
    }
    else {
        aa.env.setValue("ScriptReturnMessage", "Batch Job run successfully.");
        aa.eventLog.createEventLog("Batch Job run successfully.", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
    }
}
else {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Batch Job failed: " + emailText);
}

if (emailAddress.length > 0)
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

        vSuccess = SetLTFullfillmentLogic();

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

function SetLTFullfillmentLogic() {
    var isValid = true;
    if (reportName == '') {
        showDebug = true;
        logDebug("ReportName parameter is not blank. ");
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

    //var uniqueCapIdArray = aa.util.newHashMap();
    var counter = 0;
    var recId;
    var setNameArray = new Array();

    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
    var id;
    if (counter == 0 && setPrefix.length > 0) {
        setResult = createFullfillmentSet(setPrefix);
        id = setResult.setID;

        setNameArray.push(setResult.setID);
        updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Processing", "Pending", "Pending");
        /*
        uniqueCapIdArray = aa.util.newHashMap();
        var settprocess = new capSet(setResult.setID);
        var vSetMembers = settprocess.members;
        for (thisCap in vSetMembers) {
        recId = vSetMembers[thisCap]
        if (!uniqueCapIdArray.containsKey(recId)) {
        uniqueCapIdArray.put(recId, recId);
        }
        }
        */
    }

    var ffConitions = new COND_FULLFILLMENT();

    var sql = " SELECT B1.b1_per_id1, B1.b1_per_id2, B1.b1_per_id3 ";
    sql += " FROM b1permit B1 ";
    sql += " INNER JOIN B6CONDIT B6 ";
    sql += " ON B1.serv_prov_code = B6.serv_prov_code ";
    sql += " AND B1.b1_per_id1 = B6.b1_per_id1 ";
    sql += " AND B1.b1_per_id2 = B6.b1_per_id2 ";
    sql += " AND B1.b1_per_id3 = B6.b1_per_id3 ";
    sql += " INNER JOIN b3contact D ";
    sql += " ON B1.serv_prov_code = D.serv_prov_code ";
    sql += " AND B1.b1_per_id1 = D.b1_per_id1 ";
    sql += " AND B1.b1_per_id2 = D.b1_per_id2 ";
    sql += " AND B1.b1_per_id3 = D.b1_per_id3 ";
    sql += " WHERE B1.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND B1_PER_GROUP = 'Licenses' ";
    sql += " AND B1_PER_TYPE = 'Sales' ";
    sql += " AND B1_PER_SUB_TYPE = 'fulfill' ";
    sql += " AND B1_PER_CATEGORY = 'Documents' ";
    sql += " AND b1_CON_GROUP = '" + ffConitions.ConditionGroup + "' ";
    sql += " AND b1_CON_TYP = '" + ffConitions.ConditionType + "' ";
    sql += " AND b1_CON_DES = '" + ffConitions.Condition_YearlyLifetime + "' ";
    sql += " AND B1_CON_STATUS = 'Applied' ";
    sql += " AND B1_APPL_STATUS = 'Approved' ";
    sql += " AND Exists ( ";
    sql += " Select 1 from G3CONTACT C";
    sql += " WHERE serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND TO_NUMBER(G1_UDF3) Between  " + fromGroupNumber;
    sql += " AND " + toGroupNumber;
    sql += " AND C.g1_contact_nbr = D.g1_contact_nbr ";
    sql += " AND nvl(G1_UDF4, 1) = 1 )";

    var vError = '';
    var conn = null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();

        while (rSet.next()) {
            var itemCapId = aa.cap.getCapID(rSet.getString("B1_PER_ID1"), rSet.getString("B1_PER_ID2"), rSet.getString("B1_PER_ID3")).getOutput();
            recId = itemCapId;
            //if (!uniqueCapIdArray.containsKey(recId)) {
            var itemCap = aa.cap.getCap(itemCapId).getOutput();
            var fvMailStop = getMailStop(itemCapId);
            if (fvMailStop)
                continue;
            //uniqueCapIdArray.put(recId, recId);
            altId = itemCapId.getCustomID();
            logDebug(altId);
            var isSuccess = generateReport(itemCapId);
            updateRefContactsUdf4(altId, 2)
            if (setPrefix.length > 0) {
                addCapSetMemberX(itemCapId, setResult);
            }
            counter++;
            //}
            editCapConditionStatus("Fulfillment", ffConitions.Condition_YearlyLifetime, "Verified", "Not Applied", "", itemCapId);
            removeFullfillmentCapCondition(itemCapId, ffConitions.Condition_YearlyLifetime);
            if (counter >= CONST_RECORDS_PER_SET && setPrefix.length > 0) {
                if (!isPartialSuccess) {
                    updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");
                    setResult = createFullfillmentSet(setPrefix);
                    setNameArray.push(setResult.setID);
                    updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Processing", "Pending", "Pending");
                    //uniqueCapIdArray = aa.util.newHashMap();
                }
                counter = 0;
            }
        }
    } catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        if (conn) {
            conn.close();
        }
    }


    if (conn) {
        conn.close();
    }
    if (!isPartialSuccess) {
        updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");
    }

    logDebug("ENTER: Pass 2 to create missing documenets in EDMS.");
    var counter = 2;
    while (counter > 0) {
        for (y in setNameArray) {
            logDebug("GenerateMissingReportForSets for - " + setNameArray[y]);
            GenerateMissingReportForSets(setNameArray[y] + "");
        }
        counter--;
    }
    logDebug("EXIT: Pass 2 to create missing documenets in EDMS.");

    return true;
}

function createFullfillmentSet(recordType) {
    var id = recordType;
    var name = null;
    var setType = "FULLFILLMENT"; //configured Set Type 
    var setStatus = "Initialized";
    var setComment = "Initialized";
    var setStatusComment = "Initialized";
    return createSetbylogic(id, name, setType, setComment, setStatus, setStatusComment);
}

function addCapSetMemberX(itemCapId, setResult) {
    try {
        logDebug("inside addCapSetMemberX");
        var memberCapID = itemCapId;
        logDebug("ID: " + memberCapID);
        var addResult = aa.set.addCapSetMember(setResult.getSetID(), memberCapID);
        logDebug("Add set result: " + addResult.getSuccess());
    }
    catch (err) {
        logDebug("Exception in addCapSetMember:" + err.message);
    }
}

function updateSetStatusX(setName, setDescription, setType, comment, setStatus, setStatusComment) {
    try {
        var setTest = new capSet(setName, setDescription);
        setTest.status = setStatus;  // update the set header status
        setTest.comment = comment;   // changed the set comment
        setTest.statusComment = setStatusComment; // change the set status comment
        setTest.type = setType;
        setTest.update();  // commit changes to the set
    }
    catch (err) {
        logDebug("Exception in updateSetStatus:" + err.message);
    }
}

function generateReport(itemCapId) {
    var isSuccess = false;
    try {
        var parameters = aa.util.newHashMap();
        parameters.put("PARENT", itemCapId.getCustomID());

        var report = aa.reportManager.getReportInfoModelByName(reportName);
        report = report.getOutput();
        //aa.print(report);
        report.setCapId(itemCapId.toString());
        report.setModule("Licenses");
        report.setReportParameters(parameters);
        // set the alt-id as that's what the EDMS is using.
        report.getEDMSEntityIdModel().setAltId(itemCapId.getCustomID());
        var checkPermission = aa.reportManager.hasPermission(reportName, "admin");
        logDebug("Permission for report: " + checkPermission.getOutput().booleanValue());

        if (checkPermission.getOutput().booleanValue()) {
            logDebug("User has permission");
            var reportResult = aa.reportManager.getReportResult(report);
            if (reportResult) {
                isSuccess = true;
            }
            // not needed as the report is set up for EDMS
            if (false) {
                reportResult = reportResult.getOutput();
                logDebug("Report result: " + reportResult);
                reportFile = aa.reportManager.storeReportToDisk(reportResult);
                reportFile = reportFile.getOutput();
                logDebug("Report File: " + reportFile);
            }
        }
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
    }
    return isSuccess;
}

function getMailStop(ipCapID) {
    var opMailStop = false;
    var fvCapContactQry = aa.people.getCapContactByCapID(ipCapID);
    if (fvCapContactQry.getSuccess()) {
        var fvCapContacts = fvCapContactQry.getOutput();

        for (var fvCounter1 in fvCapContacts) {
            var fvCapContact = fvCapContacts[fvCounter1];
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
            var fvThisStopMail = (fvRefContact.template.templateForms.toArray()[0].subgroups.toArray()[0].fields.get(6).checklistComment == "Y");
            if (fvThisStopMail) {
                opMailStop = true;
                break;
            }
        }
    }
    return opMailStop;
}

function GenerateMissingReportForSets(pSetName) {
    var isValid = true;
    var isReportGenerated = false;

    var sql = "SELECT sd.set_id, sd.b1_per_id1, sd.b1_per_id2, sd.b1_per_id3 ";
    sql += " FROM setdetails sd ";
    sql += " WHERE sd.serv_prov_code = '" + servProvCode + "' ";
    sql += " AND sd.set_id = '" + pSetName + "' ";
    sql += " AND sd.rec_status = 'A' ";
    sql += " AND NOT EXISTS (SELECT 1 FROM bdocument bd ";
    sql += " WHERE bd.serv_prov_code = sd.serv_prov_code ";
    sql += " AND bd.b1_per_id1 = sd.b1_per_id1 ";
    sql += " AND bd.b1_per_id2 = sd.b1_per_id2 ";
    sql += " AND bd.b1_per_id3 = sd.b1_per_id3 ";
    sql += " AND doc_status = 'Uploaded' ";
    //sql += " AND trunc(bd.File_upload_date) = trunc(sysdate) ";
    sql += " AND bd.source_name = 'DOCUMENTUM' ";
    sql += " AND bd.ent_type = 'CAP' ";
    sql += " AND bd.rec_status = 'A') ";

    logDebug(sql);
    var vError = '';
    var conn = null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();
        while (rSet.next()) {
            var itemCapId = aa.cap.getCapID(rSet.getString("B1_PER_ID1"), rSet.getString("B1_PER_ID2"), rSet.getString("B1_PER_ID3")).getOutput();
            logDebug(itemCapId);
            //var itemCap = aa.cap.getCap(itemCapId).getOutput();
            var isSuccess = generateReport(itemCapId);
        }

    } catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        if (conn) {
            conn.close();
        }
    }


    if (conn) {
        conn.close();
    }
    return isReportGenerated;
}
function updateRefContactsUdf4(altid, nRecStatus) {
    var vError = '';
    var conn = null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        var usql = " Update G3CONTACT Set G1_UDF4 = " + nRecStatus + " Where EXISTS (";
        usql += " SELECT 1 ";
        usql += " FROM b1permit B1 ";
        usql += " INNER JOIN b3contact D ";
        usql += " ON B1.serv_prov_code = D.serv_prov_code ";
        usql += " AND B1.b1_per_id1 = D.b1_per_id1 ";
        usql += " AND B1.b1_per_id2 = D.b1_per_id2 ";
        usql += " AND B1.b1_per_id3 = D.b1_per_id3 ";
        usql += " WHERE B1.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
        usql += " AND B1.B1_ALT_ID = '" + altid + "' ";
        usql += " AND G3CONTACT.g1_contact_nbr = D.g1_contact_nbr )";

        var sStmt1 = conn.prepareStatement(usql);
        var rret = sStmt1.executeQuery();
    } catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        if (conn) {
            conn.close();
        }
    }


    if (conn) {
        conn.close();
    }

    logDebug('Updated ref for alt id ' + altid + ' With ' + nRecStatus);
}
