/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_LICENSE_EXPIRATIONS.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch job (Daily)
| Agency  : DEC
| Purpose : Batch to change expriation status for and application status to expired.
| Notes   : 08/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("fromDate", "01/01/2000");
//aa.env.setValue("toDate", "");
//aa.env.setValue("appGroup", "Licenses");
//aa.env.setValue("appTypeType", "*");
//aa.env.setValue("appSubtype", "*");
//aa.env.setValue("appCategory", "*");
//aa.env.setValue("expirationStatus", "Active");
//aa.env.setValue("newExpirationStatus", "Expired");
//aa.env.setValue("newApplicationStatus", "Expired");
//aa.env.setValue("includeOrExcludeDeactivateFlagOnLP", "I");
//aa.env.setValue("gracePeriodDays", "0");
//aa.env.setValue("setPrefix", "LIC_EXP_ACTIVE");
//aa.env.setValue("inspSched", "");
//aa.env.setValue("skipAppStatus1", "Returnable,Not Printed,Charged,Returned");
//aa.env.setValue("skipAppStatus2", "Void,Reported,Revoked,Suspended,Closed");
//aa.env.setValue("emailAddress", "");
//aa.env.setValue("sendEmailToContactTypes", "");
//aa.env.setValue("emailTemplate", "");
//aa.env.setValue("deactivateLicense", "");
//aa.env.setValue("lockParentLicense", "");
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
var fromDate = getParam("fromDate"); 						// Hardcoded dates.   Use for testing only
var toDate = getParam("toDate"); 							// ""
var lookAheadDays = isNull(aa.env.getValue("lookAheadDays"), "0");   	// Number of days from today
var daySpan = isNull(aa.env.getValue("daySpan"), "0"); 					// Days to search (6 if run weekly, 0 if daily, etc.)
var appGroup = getParam("appGroup"); 						//   app Group to process {Licenses}
var appTypeType = getParam("appTypeType"); 					//   app type to process {Rental License}
var appSubtype = getParam("appSubtype"); 					//   app subtype to process {NA}
var appCategory = getParam("appCategory"); 					//   app category to process {NA}
var expStatus = getParam("expirationStatus")					//   test for this expiration status
var newExpStatus = getParam("newExpirationStatus")				//   update to this expiration status
var newAppStatus = isNull(getParam("newApplicationStatus"), "")				//   update the CAP to this status
var includeOrExcludeDeactivateFlagOnLP = isNull(getParam("includeOrExcludeDeactivateFlagOnLP"), "I"); 	//  Look to this radio button on record LP to qualify for actions
var gracePeriodDays = isNull(getParam("gracePeriodDays"), "0"); 				//	bump up expiration date by this many days
var setPrefix = isNull(getParam("setPrefix"), ""); 						//   Prefix for set ID
var inspSched = isNull(getParam("inspSched"), ""); 						//   Schedule Inspection
var skipAppStatus1 = isNull(getParam("skipAppStatus1"), ""); //   Skip records with one of these application statuses 1
var skipAppStatus2 = isNull(getParam("skipAppStatus2"), ""); //   Skip records with one of these application statuses 2
var emailAddress = isNull(getParam("emailAddress"), ""); 				// email to send report
var sendEmailToContactTypes = isNull(getParam("sendEmailToContactTypes"), ""); // send out emails?
var emailTemplate = isNull(getParam("emailTemplate"), ""); 				// email Template
var deactivateLicense = isNull(getParam("deactivateLicense"), ""); 		// deactivate the LP
var lockParentLicense = isNull(getParam("lockParentLicense"), "");     		// add this lock on the parent license
var createRenewalRecord = getParam("createTempRenewalRecord"); // create a temporary record
var feeSched = getParam("feeSched"); 							//
var feeList = getParam("feeList"); 							// comma delimted list of fees to add
var feePeriod = getParam("feePeriod"); 						// fee period to use {LICENSE}
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
var skipAppStatusArray = (skipAppStatus1 + ',' + skipAppStatus2).split(",");
/*------------------------------------------------------------------------------------------------------/
| END: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/
var isPartialSuccess = false;
var timeExpired = false;

// no "from" date, assume today + number of days to look ahead
fromDate = dateAdd(isNull(fromDate, new Date()), parseInt(lookAheadDays));
// no "to" date, assume today + number of look ahead days + span
toDate = dateAdd(isNull(toDate, new Date()), parseInt(lookAheadDays) + parseInt(daySpan));

//No renewals for DEC
//var mailFrom = lookup("ACA_EMAIL_TO_AND_FROM_SETTING", "RENEW_LICENSE_AUTO_ISSUANCE_MAILFROM");
//var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
//acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

var capId = null;
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()

logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime(); 		// Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

if (appGroup == "")
    appGroup = "*";
if (appTypeType == "")
    appTypeType = "*";
if (appSubtype == "")
    appSubtype = "*";
if (appCategory == "")
    appCategory = "*";
var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;


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

        SetExpirationDateLogic();

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

function SetExpirationDateLogic() {
    //STEP1: Init Sets to process
    logDebug("***** START: STEP1 - Set Init ***** ");
    //Set Comments: Initialized, Processing, Successfully processed
    //Set Status: Initialized, Pending, Completed
    var setResult;
    if (setPrefix.length > 0) {
        setResult = createExpirationSet(setPrefix);
        logDebug(setResult.setID);
        updateSetStatus(setResult.setID, setResult.setID, "Processing", "Pending", "Pending");
    }
    logDebug("***** END: STEP1 - Set Init ***** ");

    var capFilterType = 0
    var capFilterInactive = 0;
    var capFilterError = 0;
    var capFilterStatus = 0;
    var capDeactivated = 0;
    var capExpirationDate = 0;
    var capCount = 0;
    var capLPHasDeactivateFlagMatch = 0;
    var inspDate;
    var setName;
    var setDescription;

    var expResult = aa.expiration.getLicensesByDate(expStatus, fromDate, toDate);

    if (expResult.getSuccess()) {
        myExp = expResult.getOutput();
        logDebug("Processing " + myExp.length + " expiration records");
    }
    else {
        logDebug("ERROR: Getting Expirations, reason is: " + expResult.getErrorType() + ":" + expResult.getErrorMessage());
        return false;
    }

    for (thisExp in myExp)  // for each b1expiration (effectively, each license app)
    {
        if (elapsed() > maxSeconds) // only continue if time hasn't expired
        {
            logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
            timeExpired = true;
            break;
        }

        b1Exp = myExp[thisExp];
        var expDate = b1Exp.getExpDate();
        if (expDate) var b1ExpDate = expDate.getMonth() + "/" + expDate.getDayOfMonth() + "/" + expDate.getYear();
        var b1Status = b1Exp.getExpStatus();
        var renewalCapId = null;

        capId = aa.cap.getCapID(b1Exp.getCapID().getID1(), b1Exp.getCapID().getID2(), b1Exp.getCapID().getID3()).getOutput();
        if (!capId) {
            logDebug("Could not get a Cap ID for " + b1Exp.getCapID().getID1() + "-" + b1Exp.getCapID().getID2() + "-" + b1Exp.getCapID().getID3());
            continue;
        }

        altId = capId.getCustomID();

        var isExpired = (dateDiff(convertDate(sysDateMMDDYYYY), convertDate(b1ExpDate)) <= 0);
        if (!isExpired) {
            capExpirationDate++;
            logDebug(altId + ": skipping due to expiration date is not reached " + jsDateToMMDDYYYY(convertDate(b1ExpDate)));
            continue;
        }

        logDebug(altId + ": Renewal Status : " + b1Status + ", Expires on " + b1ExpDate);
        var capResult = aa.cap.getCap(capId);

        if (!capResult.getSuccess()) {
            logDebug(altId + ": Record is deactivated, skipping");
            capDeactivated++;
            continue;
        }
        else {
            var cap = capResult.getOutput();
        }

        var capStatus = cap.getCapStatus();

        appTypeResult = cap.getCapType(); 	//create CapTypeModel object
        appTypeString = appTypeResult.toString();
        appTypeArray = appTypeString.split("/");

        // Filter by CAP Type
        if (appType.length && !appMatch(appType)) {
            capFilterType++;
            logDebug(altId + ": Application Type does not match");
            continue;
        }

        // Filter by CAP Status
        if (exists(capStatus, skipAppStatusArray)) {
            capFilterStatus++;
            logDebug(altId + ": skipping due to application status of " + capStatus);
            continue;
        }

        // Filter by Deactivate Flag on Record LP
        //NOT Applicble for DEC
        /* 
        if (includeOrExcludeDeactivateFlagOnLP.length) {
        var skipLogic = includeOrExcludeDeactivateFlagOnLP.equals("I");   // true if we only want decative flags
        var lpAttributeFlagName = "INACTIVATE_REG";  // attribute name
        var lpAttributeFlagSt = "Y"; // status that means to deactivate
        var skipThisOne = skipLogic;  // skip unless we have the right flag
        var lpArray = getLicenseProfessional(capId);
        for (var i in lpArray) {
        var lp = lpArray[i];
        var lpa = lp.getAttributes();
        for (var j in lpa) {
        var at = lpa[j];

        if (String(at.attributeName).toUpperCase().equals(String(lpAttributeFlagName)) && String(at.attributeValue).toUpperCase().equals(String(lpAttributeFlagSt))) {
        skipThisOne = !skipLogic;
        }
        }
        }


        if (skipThisOne) {
        logDebug(altId + ": skipped due to deactivate flag on record (Include/Exclude) (" + includeOrExcludeDeactivateFlagOnLP + ")");
        capLPHasDeactivateFlagMatch++;
        }
        }
        */
        capCount++;

        // Actions start here:

        var refLic = getRefLicenseProf(altId) // Load the reference License Professional
        if (refLic && deactivateLicense.substring(0, 1).toUpperCase().equals("Y")) {
            refLic.setAuditStatus("I");
            aa.licenseScript.editRefLicenseProf(refLic);
            logDebug(altId + ": deactivated linked License");
        }

        // update expiration status
        if (newExpStatus.length > 0) {
            b1Exp.setExpStatus(newExpStatus);
            aa.expiration.editB1Expiration(b1Exp.getB1Expiration());
            logDebug(altId + ": Update expiration status: " + newExpStatus);
        }

        // update expiration date based on interval
        if (parseInt(gracePeriodDays) != 0) {
            newExpDate = dateAdd(b1ExpDate, parseInt(gracePeriodDays));
            b1Exp.setExpDate(aa.date.parseDate(newExpDate));
            aa.expiration.editB1Expiration(b1Exp.getB1Expiration());

            logDebug(altId + ": updated CAP expiration to " + newExpDate);
            if (refLic) {
                refLic.setLicenseExpirationDate(aa.date.parseDate(newExpDate));
                aa.licenseScript.editRefLicenseProf(refLic);
                logDebug(altId + ": updated License expiration to " + newExpDate);
            }
        }

        //NOT Applicble for DEC 
        /*
        if (sendEmailToContactTypes.length > 0 && emailTemplate.length > 0) {
        var conTypeArray = sendEmailToContactTypes.split(",");
        var conArray = getContactArray(capId);

        logDebug("Have the contactArray");

        for (thisCon in conArray) {
        conEmail = null;
        b3Contact = conArray[thisCon];
        if (exists(b3Contact["contactType"], conTypeArray))
        conEmail = b3Contact["email"];

        if (conEmail) {
        emailParameters = aa.util.newHashtable();
        addParameter(emailParameters, "$$altid$$", altId);
        addParameter(emailParameters, "$$acaUrl$$", acaSite + getACAUrl());
        addParameter(emailParameters, "$$businessName$$", cap.getSpecialText());
        addParameter(emailParameters, "$$expirationDate$$", b1ExpDate);

        var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

        var fileNames = [];

        aa.document.sendEmailAndSaveAsDocument(mailFrom, conEmail, "", emailTemplate, emailParameters, capId4Email, fileNames);
        logDebug(altId + ": Sent Email template " + emailTemplate + " to " + b3Contact["contactType"] + " : " + conEmail);
        }
        }
        }
        */
        // update CAP status
        if (newAppStatus.length > 0) {
            updateAppStatus(newAppStatus, "");
            logDebug(altId + ": Updated Application Status to " + newAppStatus);
        }

        // schedule Inspection

        if (inspSched.length > 0) {
            scheduleInspection(inspSched, "1");
            inspId = getScheduledInspId(inspSched);
            if (inspId) autoAssignInspection(inspId);
            logDebug(altId + ": Scheduled " + inspSched + ", Inspection ID: " + inspId);
        }

        // Add to Set
        if (setPrefix.length > 0) {
            addCapSetMember(capId, setResult);
        }

        // lock Parent License
        if (lockParentLicense != "") {
            licCap = getLicenseCapId("*/*/*/*");

            if (licCap) {
                logDebug(licCap + ": adding Lock : " + lockParentLicense);
                addStdCondition("Suspension", lockParentLicense, licCap);
            }
            else
                logDebug(altId + ": Can't add Lock, no parent license found");
        }

        // create renewal record and add fees
        //Not applicable for DEC
        /*
        if (createRenewalRecord && createRenewalRecord.substring(0, 1).toUpperCase().equals("Y")) {
        createResult = aa.cap.createRenewalRecord(capId)

        if (!createResult.getSuccess)
        { logDebug("Could not create renewal record : " + createResult.getErrorMessage()); }
        else {
        renewalCapId = createResult.getOutput();

        renewalCap = aa.cap.getCap(renewalCapId).getOutput();
        if (renewalCap.isCompleteCap()) {
        logDebug(altId + ": Renewal Record already exists : " + renewalCapId.getCustomID());
        }
        else {
        logDebug(altId + ": created Renewal Record " + renewalCapId.getCustomID());

        // add fees 

        if (feeList.length > 0) {
        for (var fe in feeList.split(","))
        var feObj = addFee(feeList.split(",")[fe], feeSched, feePeriod, 1, "Y", renewalCapId);
        }
        }
        }
        }
        */
    }

    logDebug("Total CAPS qualified date range: " + myExp.length);
    logDebug("Ignored due to application type: " + capFilterType);
    logDebug("Ignored due to expiration date: " + capExpirationDate);
    logDebug("Ignored due to CAP Status: " + capFilterStatus);
    logDebug("Ignored due to Deactivated CAP: " + capDeactivated);
    logDebug("Ignored due to Deactivate Flag on Record LP: " + capLPHasDeactivateFlagMatch);
    logDebug("Total CAPS processed: " + capCount);

    //STEP5: Update Set Status
    if (setPrefix.length > 0) {
        (!isPartialSuccess)
        {
            logDebug("***** START: STEP4 - Update Set Status ***** ");
            updateSetStatus(setResult.setID, setResult.setID, "Successfully processed", "Completed", "Completed");
            logDebug("***** END: STEP4 - Update Set Status ***** ");
        }
    }

}

function createExpirationSet(recordType) {
    var id = recordType;
    var name = null;
    var setType = "LICENSE_EXPIRATIONS"; //configured Set Type 
    var setStatus = "Initialized";
    var setComment = "Initialized";
    var setStatusComment = "Initialized";
    return createSetbylogic(id, name, setType, setComment, setStatus, setStatusComment)
}
