/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LIFETIME_FULLFILLMENT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Yearly)
| Agency  : DEC
| Purpose : Batch to create set for Lifetime fullfillment.
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("setPrefix", "TT");
//aa.env.setValue("emailAddress", "");
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
var reportName = getParam("reportName");
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
//var capId = null;
//var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values


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

        SetDailyFullfillmentLogic();

        logDebug("****** End logic ******");

        return vSuccess;
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

function SetDailyFullfillmentLogic() 
{
	//aa.print("Inside SetDailyFullfillmentLogic");
   //STEP1: Init Sets to process
    logDebug("***** START: STEP1 - Set Init ***** ");
    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
    if (setPrefix.length > 0) {
        setResult = createFullfillmentSet(setPrefix);
        //logDebug(setResult.setID);
		logDebug("Set ID: " + setResult.setID);
        updateSetStatus(setResult.setID, setResult.setID, "Processing", "Pending", "Pending");
    }
    logDebug("***** END: STEP1 - Set Init ***** ");

    var emptyCm = aa.cap.getCapModel().getOutput();
    var emptyCt = emptyCm.getCapType();
    emptyCt.setGroup("Licenses");
    emptyCt.setType("Annual");
    emptyCt.setSubType("Fishing");
    emptyCt.setCategory("One Day");
    emptyCm.setCapType(emptyCt);
    emptyCm.setCapStatus("Expired");

    var res = aa.cap.getCapIDListByCapModel(emptyCm);
    //var res = aa.cap.getCapListByCollection(emptyCm, null, null, null, null, null, new Array());
	
    if (res.getSuccess()) {
        var vCapList = res.getOutput();
		aa.print("Cap List: " + vCapList);
        for (thisCap in vCapList) 
		{
            if (elapsed() > maxSeconds) // only continue if time hasn't expired
            {
                isPartialSuccess = true;
                showDebug = true;
                logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                timeExpired = true;
                break;
            }

            var recId = vCapList[thisCap].getCapID();
            var recca = String(recId).split("-");
            var itemCapId = aa.cap.getCapID(recca[0], recca[1], recca[2]).getOutput();
			logDebug("Cap ID: " + itemCapId);
            var itemCap = aa.cap.getCap(itemCapId).getOutput();
            altId = itemCapId.getCustomID();
			logDebug("Custom ID: " + altId);
            appTypeResult = itemCap.getCapType();
            appTypeString = appTypeResult.toString();

            //var reportFileName = GenerateReport(itemCapId, altId);
			generateReport(altId);
            //aa.print(reportFileName);
            //if (reportFileName == null) return false;

            if (setPrefix.length > 0) 
			{
                //aa.set.add(setResult.getSetID(), altId)
                addCapSetMember(itemCapId, setResult);
            }
            break;
        }
    }

    //STEP5: Update Set Status
    if (setPrefix.length > 0) {
        (!isPartialSuccess)
        {
            logDebug("***** START: STEP4 - Update Set Status ***** ");
            updateSetStatus(setResult.setID, setResult.setID, "Successfully processed", "Completed", "Completed");
            logDebug("***** END: STEP4 - Update Set Status ***** ");
        }
    }

    //var reportFileName = GenerateReport();
    //if (reportFileName == null) return false;


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

//Generate report
function generateReport(itemCap)
{
	var parameters=aa.util.newHashMap();
	parameters.put("PARENT", itemCap);
	
	report=aa.reportManager.getReportInfoModelByName(reportName);
	report=report.getOutput();
	aa.print(report);
	report.setCapId(itemCap);
	report.setModule("Licenses");
	report.setReportParameters(parameters); 

	var checkPermission=aa.reportManager.hasPermission(reportName,"admin");
	logDebug("Permission for report: " + checkPermission.getOutput().booleanValue());

	if(checkPermission.getOutput().booleanValue())
	{
		logDebug("User has permission"); 
		var reportResult=aa.reportManager.getReportResult(report);
		if(reportResult)
		{
			reportResult=reportResult.getOutput();
			logDebug("Report result: " + reportResult);
			reportFile=aa.reportManager.storeReportToDisk(reportResult);
			reportFile=reportFile.getOutput();
			logDebug("Report File: " +reportFile);
		}
	} 
}

// Generate Report.
/*function GenerateReport(itemCapId, altID) {
    var reportFileName = null;
    var repService = new ReportHelper(servProvCode, reportName);
    repService.ReportUser = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
    repService.CapID = itemCapId;
    repService.altID = altID;
    repService.isEDMS = true;
    repService.StringToInsertForName = altID;
    if (repService.ExecuteReport()) {
        reportFileName = repService.ReportFileName;
    }
    return reportFileName;
}*/