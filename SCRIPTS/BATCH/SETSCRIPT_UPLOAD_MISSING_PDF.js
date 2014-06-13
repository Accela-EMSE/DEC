/*------------------------------------------------------------------------------------------------------/
| Program:  SETSCRIPT_UPLOAD_MISSING_PDF.js  Trigger: Batch
| Event   : Execute script on fulfilment set
| Usage   : As per required through AA
| Agency  : DEC
| Purpose : A script to upload missing documents in SET.
| Notes   : 06/13/2014,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("showDebug", "Y");
/*------------------------------------------------------------------------------------------------------/
| END: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var maxSeconds = 4.5 * 60; 	    // number of seconds allowed for batch processing, usually < 5*60
var debug = "";
var br = "<BR>";
var message = "";
var currentUserID = aa.env.getValue("CurrentUserID");
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var msg = "";
var showDebug = false;
var capId = null;

/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
/*------------------------------------------------------------------------------------------------------/
| START: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
var servProvCode = aa.getServiceProviderCode();
var showDebug = isNull(aa.env.getValue("showDebug"), "N") == "Y";
var sysDate = aa.date.getCurrentDate();
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var set = new capSet(SetID);
var startDate = new Date();
var startTime = startDate.getTime(); 		// Start timer
var SetID = aa.env.getValue("SetID");
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

logDebug("Start process");

logDebug("SetID: " + SetID);
var isIbpSet = SetID.toUpperCase().indexOf("IBP")
var reportName = isIbpSet ? "License Tags" : "DMP IBP Tags EDMS";
logDebug("Report Name: " + reportName);

var isSuccess = true;
if (!timeExpired) {
    isSuccess = mainProcess();
}

logDebug("End of process: Elapsed Time : " + elapsed() + " Seconds");

if (isSuccess) {
    aa.env.setValue("ScriptReturnCode", "0");
    if (isPartialSuccess) {
        aa.env.setValue("ScriptReturnMessage", "A script timeout has caused partial completion of this process.  Please re-run. : " + br + (showDebug ? debug : ""));
    } else {
        aa.env.setValue("ScriptReturnMessage", "Upload missing document(s) successful - Document uploaded: " + (showDebug ? debug : ""));
    }
}
else {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Upload missing document(s) failed: " + (showDebug ? debug : ""));
}

/*------------------------------------------------------------------------------------------------------/
| END: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
    var vError = null;
    try {

        logDebug("****** Start logic ******");

        vSuccess = GenerateMissingReportForSets(SetID);

        logDebug(vSuccess);
        logDebug("****** End logic ******");


        return vSuccess;
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return false;
    }
}

function generateReport(itemCapId) {
    var isSuccess = false;
    try {
        var parameters = aa.util.newHashMap();
        if (reportName == "License Tags") {
            parameters.put("PARENT", itemCapId.getCustomID());
        }
        if (reportName == "DMP IBP Tags EDMS") {
            parameters.put("RECORD_ID", itemCapId.getCustomID());
            parameters.put("EDMS_YN", "Y");
        }

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
    var isValid = false;

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
    var sStmt = null;
    var rSet = null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        sStmt = conn.prepareStatement(sql);
        rSet = sStmt.executeQuery();
        while (rSet.next()) {
            var itemCapId = aa.cap.getCapID(rSet.getString("B1_PER_ID1"), rSet.getString("B1_PER_ID2"), rSet.getString("B1_PER_ID3")).getOutput();
            logDebug(itemCapId);
            //var itemCap = aa.cap.getCap(itemCapId).getOutput();
            var isSuccess = generateReport(itemCapId);
        }
        isValid = true;
    } catch (vError) {
        isValid = false;
        logDebug("Runtime error occurred: " + vError);
    }
    closeDBQueryObject(rSet, sStmt, conn);

    return isValid;
}
