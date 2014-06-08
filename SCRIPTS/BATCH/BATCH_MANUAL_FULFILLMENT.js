/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_MANUAL_APP_FULLFILLMENT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create for application report.
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("reportName", "License Tags");
//aa.env.setValue("setName","DAILY_04/09/2014_1");
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
var setName = getParam("setName"); 						//   Prefix for set ID
var reportName = getParam("reportName");     // Report Name From Report Manager
var applicationNum = getParam("applicationNum");     // Application Number 
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
var capId = null;
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

        vSuccess = GenerateMissingReportForSets(setName);

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
            // not needed as the report is set up for EDMS
            if (reportResult) {
                isSuccess = true;
            }
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

