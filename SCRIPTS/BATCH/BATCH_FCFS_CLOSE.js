/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_CLOSE_WMU_CHOICES.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch Script  
| Agency  : DEC
| Purpose : To make item active/inactive for standard choice WMU choice 1 and WMU choice 2 depending on WMU open/close status.
| Notes   : 07/15/2013, Mihir Roy,     Initial Version /
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
var emailAddress = "mihir@gcomsoft.com"; // email to send report
var recordType = "WMU";    //WMU in this case
var recordSubType = "Draw"; //Draw

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
	var dateFile = new Date();
	var dateString = (dateFile.getMonth()+1) + "/" + dateFile.getDate() + "/" + dateFile.getFullYear();
	/*------------------------------------------------------------------------------------------------------/
	|  Get the AGM Tonnage Licenses
	/------------------------------------------------------------------------------------------------------*/

    //Identify the AGM records for tonnage
	//Loop through the AGM records for tonnage
	var emptyCm1 = aa.cap.getCapModel().getOutput();
	var emptyCt1 = emptyCm1.getCapType();
	emptyCt1.setGroup("Licenses");
	emptyCt1.setType(recordType);
	emptyCt1.setSubType(recordSubType);
	emptyCt1.setCategory("Configure");
	emptyCm1.setCapType(emptyCt1);
	var vCapList; //Retrieve Cap Array Based on Cap Model
	var emptyGISArray = new Array();
	var vCapListResult = aa.cap.getCapListByCollection(emptyCm1, null, null, null, null, null, emptyGISArray);
	if (vCapListResult.getSuccess()) {
		vCapList = vCapListResult.getOutput();
	}	
	else {
		logMessage("ERROR", "ERROR: Getting Records, reason is: " + vCapListResult.getErrorType() + ":" + vCapListResult.getErrorMessage());
	}
	for (thisCap in vCapList){
		var currentYear = new Date();
		var year = currentYear.getFullYear();		
		var capId = aa.cap.getCapID(vCapList[thisCap].getCapID().getID1(), vCapList[thisCap].getCapID().getID2(), vCapList[thisCap].getCapID().getID3()).getOutput();
		//logDebug("Cap ID value: " + capId.getCustomID());
		var cnfgAinfo = new Array();
		loadAppSpecific(cnfgAinfo, capId);
		if(cnfgAinfo["Draw Type"] == "FCFS"){
			var prmitTarget = 0;
			prmitTarget = cnfgAinfo["Permit Target"];
			var usedCount = 0;
			usedCount = cnfgAinfo["Used Count"];
			var wmuStatus = cnfgAinfo["Status"];
			var wmuName = cnfgAinfo["WMU"];
			var sum = usedCount - prmitTarget;			
			if(sum > 0 || wmuStatus == "Closed"){
			logDebug(">>>> wmuStatus : " + wmuStatus + "  " + capId.getCustomID() + "  " + year);			
			var regex = new RegExp( '\\b' + year + '\\b' );
			logDebug(" Flag 2 : " + (regex.test(capId.getCustomID())));				
			
				if (regex.test(capId.getCustomID())) {												
				logDebug(" WMU Name: " + wmuName + " wmuStatus: " + wmuStatus);				
				if(wmuStatus == "Open"){																			
					editAppSpecific("Status", "Closed", capId);
				}
					editAppSpecific("Close Date", dateString, capId);					
					editLookupAuditStatus("WMU Choice 1", wmuName, "I");
					editLookupAuditStatus("WMU Choice 2", wmuName, "I");
				}
			}
		}
	}
}

function editLookupAuditStatus(stdChoice, stdValue, stdAuditStaus) {
   //check if stdChoice and stdValue already exist; if they do, update;
   var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
   if (bizDomScriptResult.getSuccess()) {
   	bds = bizDomScriptResult.getOutput();
   	var bd = bds.getBizDomain();
   	bd.setAuditStatus(stdAuditStaus);
   	var editResult = aa.bizDomain.editBizDomain(bd)
   	if (editResult.getSuccess())
   		aa.print("Successfully edited Std Choice Audit Status(" + stdChoice + "," + stdValue + ") = " + stdAuditStaus);
   	else
   		aa.print("**WARNING editing Std Choice  Audit Statu" + editResult.getErrorMessage());
   }
}