

var myCapId = "DEC-LS-14485832"
var myUserId = "PUBLICUSER98451"
var startDate = new Date();
var startTime = startDate.getTime();			// Start timer

//  **** WARNING!!! USES A CUSTOM version of INCLUDES_CUSTOM called INCLUDES_CUSTOM_DEBUG that forces DMP on


//wfTask = "License Issuance";	
//wfStatus = "Issued";			
//aa.env.setValue("EventName","WorkflowTaskUpdateAfter");
aa.env.setValue("EventName","ApplicationSubmitAfter");

var runEvent = false; // set to false if you want to roll your own code here in script test
/* master script code don't touch */ var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));	}	eval(getScriptText("INCLUDES_CUSTOM_DEBUG"));if (documentOnly) {	doStandardChoiceActions(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName){	var servProvCode = aa.getServiceProviderCode();	if (arguments.length > 1) servProvCode = arguments[1]; vScriptName = vScriptName.toUpperCase();		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");		return emseScript.getScriptText() + "";			} catch(err) {		return "";	}} logGlobals(AInfo); if (runEvent && doStdChoices) doStandardChoiceActions(controlString,true,0); if (runEvent && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z);
//
// User code goes here

// User code goes here
//capId = aa.cap.getCapID("13EST","00000","03843").getOutput();

showDebug = 3;
logDebug("STARTSTART - 13TMP-003846 attempt 1");

try {

frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_CTRC); 
if (appTypeString == 'Licenses/Annual/Application/NA') { SetformForSelectedLics(frm); } 
if (appTypeString == 'Licenses/Other/Sales/Application') { SetOtherformForSelectedLics(frm); }
if (appTypeString == 'Licenses/Sales/Application/Sporting') { SetExpressformForSelectedLics(frm); } 
issueSelectedSalesItems(frm);

}
catch(err) {
	logDebug("ERROR: " + err.message + " In " + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
	}


logDebug("ENDEND - 13TMP-003846 attempt 1");


// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)

