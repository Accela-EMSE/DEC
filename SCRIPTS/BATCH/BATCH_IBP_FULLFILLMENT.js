/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_IBP_FULLFILLMENT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Manual)
| Agency  : DEC
| Purpose : Batch to create set for IBP tag.
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("setPrefix", "IBP");
//aa.env.setValue("emailAddress", "");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("ReportName", "DMP IBP Tags EDMS");
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
var CONST_RECORDS_PER_SET = 1000;

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

        vSuccess = SetIBPFullfillmentLogic();

        logDebug("****** End logic ******");

        return vSuccess;
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return flase;
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

function SetIBPFullfillmentLogic() {
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

    //var recordTypeArray = new Array()
    //recordTypeArray.push("Licenses/Annual/Hunting/Deer Management Permit");

    var sql = " SELECT B1.b1_per_id1, B1.b1_per_id2, B1.b1_per_id3 ";
    sql += " FROM b1permit B1 ";
    sql += " INNER JOIN B6CONDIT B6 ";
    sql += " ON B1.serv_prov_code = B6.serv_prov_code ";
    sql += " AND B1.b1_per_id1 = B6.b1_per_id1 ";
    sql += " AND B1.b1_per_id2 = B6.b1_per_id2 ";
    sql += " AND B1.b1_per_id3 = B6.b1_per_id3 ";
    sql += " WHERE B1.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND B1_PER_GROUP = 'Licenses' ";
    sql += " AND B1_PER_TYPE = 'Annual' ";
    sql += " AND B1_PER_SUB_TYPE = 'Hunting' ";
    sql += " AND B1_PER_CATEGORY = 'Deer Management Permit' ";
    sql += " AND b1_CON_GROUP = '" + ffConitions.ConditionGroup + "' ";
    sql += " AND b1_CON_TYP = '" + ffConitions.ConditionType + "' ";
    sql += " AND b1_CON_DES = '" + ffConitions.Condition_IBPTag + "' ";
    sql += " AND B1_CON_STATUS = 'Applied' ";
    sql += " AND B1_APPL_STATUS = 'Active' ";

    var vError = '';
	var conn= null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();

        while (rSet.next()) {
            var itemCapId = aa.cap.getCapID(rSet.getString("B1_PER_ID1"), rSet.getString("B1_PER_ID2"), rSet.getString("B1_PER_ID3")).getOutput();
            recId = itemCapId;

            if (!uniqueCapIdArray.containsKey(recId)) {
                uniqueCapIdArray.put(recId, recId);
                var recca = String(recId).split("-");
                var itemCapId = aa.cap.getCapID(recca[0], recca[1], recca[2]).getOutput();
                var itemCap = aa.cap.getCap(itemCapId).getOutput();
                altId = itemCapId.getCustomID();
                //appTypeResult = itemCap.getCapType();
                //appTypeString = appTypeResult.toString();
                var reportFileName = generateReport(itemCapId, altId);
                //logDebug(reportFileName);
                if (setPrefix.length > 0) {
                    addCapSetMember(itemCapId, setResult);
                }
                counter++;
            }
            editCapConditionStatus("Fulfillment", ffConitions.Condition_IBPTag, "Verified", "Not Applied", "", itemCapId);
            removeFullfillmentCapCondition(itemCapId, ffConitions.Condition_IBPTag);
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
    } catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        if (conn) {
            conn.close();
        }
    }
    if (conn) {
        conn.close();
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
function generateReport(itemCapId) {
    var isSuccess = false;
    try {
        var parameters = aa.util.newHashMap();
        parameters.put("RECORD_ID", itemCapId.getCustomID());
        parameters.put("EDMS_YN", "Y");

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
            logDebug("Suceess :" + isSuccess);
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
