var myCapId = "14TMP-01224073"; //14TMP-654547";//"14TMP-654551";//
var myUserId = "PUBLICUSER98482"
var startDate = new Date();
var startTime = startDate.getTime();			// Start timer

//wfTask = "License Issuance";	
//wfStatus = "Issued";			
//aa.env.setValue("EventName","WorkflowTaskUpdateAfter");
aa.env.setValue("EventName","ApplicationSubmitAfter");

var runEvent = false; // set to false if you want to roll your own code here in script test
/* master script code don't touch */ 
var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));	}	eval(getScriptText("INCLUDES_CUSTOM"));if (documentOnly) {	doStandardChoiceActions(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName){	var servProvCode = aa.getServiceProviderCode();	if (arguments.length > 1) servProvCode = arguments[1]; vScriptName = vScriptName.toUpperCase();		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");		return emseScript.getScriptText() + "";			} catch(err) {		return "";	}} logGlobals(AInfo); if (runEvent && doStdChoices) doStandardChoiceActions(controlString,true,0); if (runEvent && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  logDebug(z);
//
// User code goes here
//capId = aa.cap.getCapID("13EST","00000","03843").getOutput();

showDebug = 3;
logDebug("STARTSTART - 14TMP-00655362 attempt 1");


frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_CTRC);

if (appTypeString == 'Licenses/Sales/Reprint/Documents') {
	ReprintDocuments();
}

if (appTypeString == 'Licenses/Annual/Application/NA') {
	SetformForSelectedLics(frm);
	//createActiveHoldingTableForTxfr();
}

if (appTypeString == 'Licenses/Other/Sales/Application') {
	SetOtherformForSelectedLics(frm);
	//SetExpressformForSelectedLics(frm);
}

try {	
	issueSelectedSalesItems(frm);
}
catch(err) {
	logDebug("ERROR: " + err.message + " In " + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

logDebug("ENDEND - 14TMP-00655362 attempt 1");

/*

   var f = frm;

    var ruleParams = f.getRulesParam();
	
	
	var fj = {};
	for (var i in f) if (String(f[i]).indexOf("function (") == -1) 
		fj[i] = String(f[i]);
	
	fj.rules = {};
	for (var i in ruleParams) if (String(ruleParams[i]).indexOf("function (") == -1) 
		fj.rules[i] = String(ruleParams[i]);
	
	
	fj.licObjArray = []
	for (var i in f.licObjARRAY) {
		var lic = {};
		for (j in f.licObjARRAY[i]) {
			lic[j] = String(f.licObjARRAY[i][j]);
			}
		delete lic.toString;
		fj.licObjArray.push(lic);
		}
	delete fj.licObjARRAY
	
	
	fj.VersionItems = [];
	for (var i in f.VersionItems) {
		var lic = {};
		for (j in f.VersionItems[i]) {
			lic[j] = String(f.VersionItems[i][j]);
			}
		delete lic.toString;
		fj.VersionItems.push(lic);
		}


	fj.versions = [];
	for (var i in f.versions) {
		var lic = {};
		for (j in f.versions[i]) {
			lic[j] = String(f.versions[i][j]);
			}
		delete lic.toString;
		fj.versions.push(lic);
		}
		


	fj.AnnualDisablity = [];
	for (var i in f.AnnualDisablity) {
		var lic = {};
		for (j in f.AnnualDisablity[i]) {
			lic[j] = String(f.AnnualDisablity[i][j]);
			}
		delete lic.toString;
		fj.AnnualDisablity.push(lic);
		}		

	fj.LandOwnerInfo = [];
	for (var i in f.LandOwnerInfo) {
		var lic = {};
		for (j in f.LandOwnerInfo[i]) {
			lic[j] = String(f.LandOwnerInfo[i][j]);
			}
		delete lic.toString;
		fj.LandOwnerInfo.push(lic);
		}		

	fj.PriorLicense = [];
	for (var i in f.PriorLicense) {
		var lic = {};
		for (j in f.PriorLicense[i]) {
			lic[j] = String(f.PriorLicense[i][j]);
			}
		delete lic.toString;
		fj.PriorLicense.push(lic);
		}		

	fj.SportsmanEducation = [];
	for (var i in f.SportsmanEducation) {
		var lic = {};
		for (j in f.SportsmanEducation[i]) {
			lic[j] = String(f.SportsmanEducation[i][j]);
			}
		delete lic.toString;
		fj.SportsmanEducation.push(lic);
		}		
		


	logDebug("fj = " + JSON.stringify(fj));

	*/

// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)


