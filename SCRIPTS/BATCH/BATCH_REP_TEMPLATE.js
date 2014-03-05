/*------------------------------------------------------------------------------------------------------/
| Program : BATCH_REP_TEMPLATE.js
| Event   : N/A
| Usage   : Batch Script  
| Agency  : SED
| Notes   : 03/05/2014,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("ReportName", "AgentListing");
//aa.env.setValue("Agent_ID", "1004");
//aa.env.setValue("EmailFrom", "noreply@accela.com");
//aa.env.setValue("EmailTo", "lalit@gcomsoft.com");
//aa.env.setValue("EmailSubject", "One month notification: For Report <Report Name>");
//aa.env.setValue("EmailContent", "Please see attached one month notification: For Report <Report Name>");
//aa.env.setValue("showDebug", "Y");
/*------------------------------------------------------------------------------------------------------/
| END: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var maxSeconds = 4.5 * 60; 	// number of seconds allowed for batch processing, usually < 5*60
var br = "<br>";
var emailText = '';
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
var reportName = getParam("ReportName");     // Report Name From Report Manager
var emailFrom = getParam("EmailFrom");       // From Email Address
var emailTo = getParam("EmailTo");           // To Email Address
var emailSubject = getParam("EmailSubject"); // Email Subject
var emailContent = getParam("EmailContent"); // Email Content
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
var sysDate = aa.date.getCurrentDate();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var currentUser = aa.person.getCurrentUser().getOutput();
/*------------------------------------------------------------------------------------------------------/
| END: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/
var isSuccess = mainLogic();
if (isSuccess) {
    aa.print("Passed");
    aa.env.setValue("ScriptReturnCode", "0");
    aa.env.setValue("ScriptReturnMessage", "Email Report successful");
    aa.eventLog.createEventLog("Email Report successfully", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
}
else {
    aa.print("Failed");
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Email Report failed: " + emailText);
}

/*------------------------------------------------------------------------------------------------------/
| END: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|  MAIN LOGIC
/------------------------------------------------------------------------------------------------------*/
function mainLogic() {
    var vError = null;
    try {
        var vSuccess = checkBatch();
        if (!vSuccess) return false;
		
        var reportFileName = GenerateReport();
        if (reportFileName == null) return false;

        vSuccess = EmailReport(reportFileName);
        if (!vSuccess) return false;

		//aa.sendMail("noreply@accela.com", "lalit@gcomsoft.com", "", batchJobName + " Results", "Text");
        return true;
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
        return true;
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

// Generate Report.
function GenerateReport() {
    var reportFileName = null;
	logDebug(servProvCode);
	logDebug(reportName);
    var repService = new ReportHelper(servProvCode, reportName);
    repService.ReportUser = currentUser == null ? "ADMIN" : currentUser.getUserID().toString();
	repService.AddReportParam("AGENT_ID", "1004");
    if (repService.ExecuteReport()) {
        reportFileName = repService.ReportFileName;
    }
    return reportFileName;
}

// Generate Report.
function EmailReport(reportFileName) {
    var emailpService = new EmailHelper(servProvCode);
    emailpService.Subject = emailSubject;
    emailpService.EmailFrom = emailFrom;
    emailpService.EmailTo = emailTo
    emailpService.EmailCC = "";
    emailpService.EmailContent = emailContent;
    emailpService.FileToAttach = reportFileName;

    return emailpService.EmailFile();
}
