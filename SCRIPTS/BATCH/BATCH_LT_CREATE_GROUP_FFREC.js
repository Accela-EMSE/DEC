/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LT_CREATE_GROUP_FFREC.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Yearly) to mark groups for lifetime jobs pdf creation
| Agency  : DEC
| Purpose : Batch to create tags for Lifetime fullfillment.
| Notes   : 05/19/2014     LALIT GAWAD (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "lalit@gcomsoft.com");
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
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_BATCH"));

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
var useAppSpecificGroupName = false;
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

if (emailAddress.length)
    aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);

function mainProcess() {
    var fvError = null;
    try {
        var fvSuccess = checkBatch();
        if (!fvSuccess) return false;

        logDebug("****** Start logic ******");

        updateRefContactsUdf34();
        var maxGroupNum = getMaxGroupNumber();

        editLookup("DEC_CONFIG", "LIFETIME_LAST_BATCH_NUM_FFREC", maxGroupNum);

        var bodyText = "Last Group Number is " + maxGroupNum
        aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + ": Last group number notification.", bodyText);

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

function updateRefContactsUdf34() {
    var CONST_GROUP_COUNT = 1000;

    var sql = " UPDATE g3Contact ";
    sql += " SET G1_UDF3 = ( ( (rownum-1) - MOD((rownum-1) , " + CONST_GROUP_COUNT + ") ) / " + CONST_GROUP_COUNT + " ) + 1, ";
    sql += " G1_UDF4 = 1 ";
    sql += " WHERE EXISTS ";
    sql += " (SELECT 1 ";
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
    sql += " AND b1_Alt_id LIKE 'DEC-FM%' ";
    sql += " AND B1_PER_GROUP = 'Licenses' ";
    sql += " AND B1_PER_TYPE = 'Sales' ";
    sql += " AND B1_PER_SUB_TYPE = 'fulfill' ";
    sql += " AND B1_PER_CATEGORY = 'Documents' ";
    sql += " AND b1_CON_GROUP = 'Fulfillment' ";
    sql += " AND b1_CON_TYP = 'Fulfillment' ";
    sql += " AND b1_CON_DES = 'Yearly Lifetime' ";
    sql += " AND B1_CON_STATUS = 'Applied' ";
    sql += " AND B1_APPL_STATUS = 'Approved' ";
    sql += " AND g3Contact.g1_contact_nbr = D.g1_contact_nbr) ";
    logDebug(sql);

    var vError = '';
    var conn = null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();

    } catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        if (conn) {
            conn.close();
        }
    }


    if (conn) {
        conn.close();
    }
}

function getMaxGroupNumber() {
    var maggroupNum = 0;

    var sql = " SELECT MAX(To_number(G1_UDF3)) AS maxGroupNum FROM G3CONTACT ";
    sql += " WHERE serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND NVL(G1_UDF4, 1) = 1 ";
    sql += " AND G1_UDF3 IS NOT NULL ";

    var vError = '';
    var conn = null;
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        conn = ds.getConnection();

        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();

        while (rSet.next()) {
            maggroupNum = rSet.getString("maxGroupNum");
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
    return maggroupNum;
}