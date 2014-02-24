/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_APPLICATION_REPORT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create for application report.
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
aa.env.setValue("setPrefix", "APPLICATIONREPORT");
aa.env.setValue("emailAddress", "koteswar.potla@gcomsoft.com");
aa.env.setValue("showDebug", "Y");
aa.env.setValue("reportName", "License Tags");
aa.env.setValue("applicationNum","DEC-LS-14000870");
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
var reportName = getParam("reportName");     // Report Name From Report Manager
var applicationNum=getParam("applicationNum");     // Application Number 
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

        vSuccess = GenerateReportForApplication();

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

function GenerateReportForApplication(){

	var isValid = true;
	var isReportGenerated=false;
	if (applicationNum == '') {
		showDebug = true;
		logDebug("application Number parameter is not blank. ");
		isValid = false;
	}
	if (!isValid) {
		return false;
	}
	
	var recId;
	//Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
    var id;	
	
	setResult = createFullfillmentSet(setPrefix);
	id = setResult.setID;
	updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Processing", "Pending", "Pending");
	recId=getCapId(applicationNum);
	
	if(recId!=''){
		var recca = String(recId).split("-");
		var itemCapId = aa.cap.getCapID(recca[0], recca[1], recca[2]).getOutput();
		var itemCap = aa.cap.getCap(itemCapId).getOutput();
		//aa.print("itemCapId  "+itemCapId);
		generateReport(itemCapId);
		isReportGenerated=true;
	}
	else {
		logDebug("ERROR: Cap ID is null-BATCH_MANUAL_APPLICATION_FULLFILLMENT" );
		isReportGenerated=false;	
	}
	updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");
	return isReportGenerated;
}

function createFullfillmentSet(recordType) {
    var id = recordType;
    var name = null;
    var setType = "FULLFILLMENT"; //configured Set Type 
    var setStatus = "Initialized";
    var setComment = "Initialized";
    var setStatusComment = "Initialized";
    return createSet(id, name, setType, setStatus, setComment, setStatusComment);
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
// Generate Report.
function generateReport(itemCapId) {
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
        if (false) {
            reportResult = reportResult.getOutput();
            logDebug("Report result: " + reportResult);
            reportFile = aa.reportManager.storeReportToDisk(reportResult);
            reportFile = reportFile.getOutput();
            logDebug("Report File: " + reportFile);
        }
    }
}
