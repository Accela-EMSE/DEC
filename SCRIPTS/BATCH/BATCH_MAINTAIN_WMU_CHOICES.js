/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_MAINTAIN_WMU_CHOICES.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch Script  
| Agency  : DEC
| Purpose : To make item active/inactive for standard choice WMU choice 1 and WMU choice 2 depending on WMU open/close status.
| Notes   : 07/15/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
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
var capId = null;
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values

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

        MaintainWMUchoices();

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

function MaintainWMUchoices() {
    //var seasonPeriod = GetLicenseSeasonPeriod();
    var now = new Date();
    var currYear = now.getFullYear();
    var month = now.getMonth() + 1;

    var retArray = GetDateRangeForWMU("DEC_CONFIG", "OVERLAP_SEASON", currYear, month)
    currYear = (retArray[0]).getFullYear();

    var currDrawtype = getDrawTypeByPeriod(currYear);
    var strControl = "WMU";
    var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
    if (bizDomScriptResult.getSuccess()) {
        bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
        for (var i in bizDomScriptArray) {

            if (elapsed() > maxSeconds) // only continue if time hasn't expired
            {
                isPartialSuccess = true;
                showDebug = true;
                logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                timeExpired = true;
                return false;
            }

            if (bizDomScriptArray[i].getBizdomainValue() != 'NA' && bizDomScriptArray[i].getBizdomainValue() != 'I don\'t know') {
                var wmu = bizDomScriptArray[i].getBizdomainValue();
                //logDebug(wmu);
                if (currDrawtype != DRAW_INST && currDrawtype != DRAW_FCFS) {
                    editLookupAuditStatus("WMU Choice 1", wmu, "I");
                    editLookupAuditStatus("WMU Choice 2", wmu, "I");
                } else {
                    changeWmuStatus(currYear, wmu, currDrawtype, 1);
                    changeWmuStatus(currYear, wmu, currDrawtype, 2);
                }
            }
        }
    }
}
function changeWmuStatus(year, wmu, drawtype, choiceNum) {
    var keepActive = false;
    //Get WMU Configuration
    var searchCapId = GenerateAltId(AA_Configuration, year, wmu, drawtype);
    var cnfgCapId = getCapId(searchCapId);
    var cnfgAinfo = new Array();

    if (cnfgCapId != null) {
        loadAppSpecific(cnfgAinfo, cnfgCapId);
        //logGlobals(cnfgAinfo);

        var prmitTarget = cnfgAinfo["Permit Target"];
        if (prmitTarget == null) prmitTarget = 0;
        var usedCount = cnfgAinfo["Used Count"];
        if (usedCount == null) usedCount = 0;
        var wmuStatus = cnfgAinfo["Status"];
        var openDt = new Date(cnfgAinfo["Open Date"]);
        var closeDt = new Date(cnfgAinfo["Close Date"]);
        var now = new Date();
        var StatusApplicableTo = cnfgAinfo["Status Applicable To"];

        if (wmuStatus == 'Open') {
            if (StatusApplicableTo == "Both" || StatusApplicableTo == 'WMU Choice ' + choiceNum) {
                if (drawtype == DRAW_INST || (now >= openDt && now <= closeDt)) {
                    if (drawtype == DRAW_INST || (prmitTarget - usedCount > 0)) {
                        keepActive = true;
                    }
                }
            }
        }
    }

    updateWMUChoiceStatus(wmu, choiceNum, keepActive);
}
function GetDateRangeForWMU(stdChoice, sValue, year, month) {
    var returnPeriod = new Array();
    var desc = GetLookupVal(stdChoice, sValue);
    if (sValue != null && sValue != "") {
        if (desc != "") {
            var monthArray = new Array();
            var atmp = desc.toString().split("|");
            var isChangeByDay = false;
            if (atmp.length > 1) {
                isChangeByDay = (atmp[1] == "Monday");
            }
            monthArray = atmp[0].toString().split("-");
            //monthArray = desc.toString().split("-");

            if (monthArray.length != 2) {
                logDebug("**ERROR :DEC_CONFIG >> " + sValue + " is not set up properly");
            } else {
                for (var p = 0; p < monthArray.length; p++) {
                    var op = monthArray[p].toString().split("/");
                    if (p == 0) {
                        if (parseInt(op[0], 10) > month) {
                            year--;
                        }
                    }
                    var dt = new Date(year, op[0] - 1, op[1]);

                    if (p != 0) {
                        if (returnPeriod.length > 0) {
                            if ((returnPeriod[returnPeriod.length - 1]) && dt.getTime() < (returnPeriod[returnPeriod.length - 1]).getTime()) {
                                dt = new Date((parseInt(year) + 1), op[0] - 1, op[1]);
                            }
                        }
                    }
                    returnPeriod[returnPeriod.length] = dt;
                }
            }

            if (isChangeByDay && returnPeriod.length == 2) {
                returnPeriod[0] = getMonday(returnPeriod[0]);
            }
        }
    }
    return returnPeriod;
}
