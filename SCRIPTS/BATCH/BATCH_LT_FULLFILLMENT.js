/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LT_FULLFILLMENT.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to create set for Lifetime fullfillment.
| Notes   : 10/15/2013     Laxmikant Bondre (LBONDRE),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("setPrefix", "LT");
//aa.env.setValue("emailAddress", "laxmikant@gcomsoft.com");
//aa.env.setValue("showDebug", "Y");
//aa.env.setValue("ReportName", "License Tags");
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
var CONST_RECORDS_PER_SET = 50;

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

    var uniqueCapIdArray = aa.util.newHashMap();
    var counter = 0;
    var recId;

    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
	var id;
    if (counter == 0 && setPrefix.length > 0) {
        setResult = createFullfillmentSet(setPrefix);
		id = setResult.setID;
        updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Processing", "Pending", "Pending");
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
    var ffCondArray = new Array();
    logDebug(ffConitions.Condition_AutoGenAppl);
    ffCondArray.push(ffConitions.Condition_AutoGenAppl);

    var recordTypeArray = new Array();
    recordTypeArray.push("Licenses/Annual/Application/NA");

    for (var yy in recordTypeArray) {
        var ats = recordTypeArray[yy];
        var ata = ats.split("/");

        var emptyCm = aa.cap.getCapModel().getOutput();
        var emptyCt = emptyCm.getCapType();
        emptyCt.setGroup(ata[0]);
        emptyCt.setType(ata[1]);
        emptyCt.setSubType(ata[2]);
        emptyCt.setCategory(ata[3]);

        emptyCm.setCapType(emptyCt);
        emptyCm.setCapStatus("Approved");

        for (var ff in ffCondArray) {
            var emCondm = ffConitions.getConditionByFullfillmentType(ffCondArray[ff]);
            emCondm.setConditionStatus("Applied");
            emCondm.setConditionStatusType("Applied");
            
            if (emCondm != null) {
                emptyCm.setCapConditionModel(emCondm);

                var res = aa.cap.getCapIDListByCapModel(emptyCm);
                if (res.getSuccess()) {
                    var vCapList = res.getOutput();
                    for (thisCap in vCapList) {
                        recId = vCapList[thisCap].getCapID();

                        if (!uniqueCapIdArray.containsKey(recId)) {
                            var recca = String(recId).split("-");
                            var itemCapId = aa.cap.getCapID(recca[0], recca[1], recca[2]).getOutput();
                            var itemCap = aa.cap.getCap(itemCapId).getOutput();
                            var fvMailStop = getMailStop(itemCapId);
                            if (fvMailStop)
                                continue;
                            uniqueCapIdArray.put(recId, recId);
                            altId = itemCapId.getCustomID();
                            generateReport(altId);
                            if (setPrefix.length > 0) {
                                addCapSetMemberX(itemCapId, setResult);
                            }
                            counter++;
                        }
                        editCapConditionStatus("Fulfillment", ffCondArray[ff], "Verified", "Not Applied", "", itemCapId);
                        removeFullfillmentCapCondition(itemCapId, ffCondArray[ff]);
                        if (counter >= CONST_RECORDS_PER_SET && setPrefix.length > 0) {
                            if (!isPartialSuccess) {
                                updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");
                                setResult = createFullfillmentSet(setPrefix);
                                updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Processing", "Pending", "Pending");
                                uniqueCapIdArray = aa.util.newHashMap();
                            }
                            counter = 0;
                        }
                    }
                }
            }
        }
    }

    if (!isPartialSuccess) {
        updateSetStatusX(setResult.setID, setResult.setID, "FULLFILLMENT", "Successfully processed", "Ready For Fullfillment", "Ready For Fullfillment");
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

function generateReport(itemCap) {
	var parameters = aa.util.newHashMap();
	parameters.put("PARENT", itemCap);
	
	report = aa.reportManager.getReportInfoModelByName(reportName);
	report = report.getOutput();
	report.setCapId(itemCap);
	report.setModule("Licenses");
	report.setReportParameters(parameters); 

	var checkPermission = aa.reportManager.hasPermission(reportName,"admin");
	logDebug("Permission for report: " + checkPermission.getOutput().booleanValue());

	if (checkPermission.getOutput().booleanValue()) {
        logDebug("User has permission"); 
		var reportResult = aa.reportManager.getReportResult(report);
		if (reportResult) {
			reportResult = reportResult.getOutput();
			logDebug("Report result: " + reportResult);
			reportFile = aa.reportManager.storeReportToDisk(reportResult);
			reportFile = reportFile.getOutput();
			logDebug("Report File: " + reportFile);
		}
	}
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
