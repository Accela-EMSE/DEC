/*------------------------------------------------------------------------------------------------------/
| Program : ACA Onload Contact.js
| Event   : ACA_AfterButton Event
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;						// Set to true to see results in popup window
var showDebug = false;							// Set to true to see debug messages in popup window
var useAppSpecificGroupName = false;			// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;			// Use Group name when populating Task Specific Info Values
var cancel = false;
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";							// Message String
var debug = "";								// Debug String
var br = "<BR>";							// Break Tag

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 
	useSA = true; 	
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 
	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }
	}
	
if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));
	eval(getScriptText(SAScript,SA));
	}
else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
	}
	
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName){
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();	
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
		return emseScript.getScriptText() + "";	
		} catch(err) {
		return "";
	}
}

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode()       		// Service Provider Code
var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var capIDString = capId.getCustomID(); 				// alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); 			// Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); 			// Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();

var AInfo = new Array();						// Create array for tokenized variables
//loadAppSpecific4ACA(AInfo); 						// Add AppSpecific Info
//loadTaskSpecific(AInfo);						// Add task specific info
//loadParcelAttributes(AInfo);						// Add parcel attributes
//loadASITables4ACA();

var AInfo = new Array(); 					// Create array for tokenized variables

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

try {
	logDebug("currentUserID = " + currentUserID);
	logDebug("public user = " + aa.publicUser.getPublicUserByPUser(currentUserID).getOutput());
	refCon = getRefConByPublicUserSeq(aa.publicUser.getPublicUserByPUser(currentUserID).getOutput().getUserSeqNum());
	
	if (refCon) {
		var peopleSequenceNumber = refCon.getContactSeqNumber()
        var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
        var tmpl = peopleModel.getTemplate();
		
		var asitModel;
		var new_asit;
		var hasHoldings = false;
		var holdingMessage = "";
		var availableActiveItems = getActiveHoldings(peopleSequenceNumber, null);
		
		for (var tidx in availableActiveItems) {
			var tObj = availableActiveItems[tidx];
			if (tObj.RecordType == AA54_TAG_PRIV_PANEL || tObj.RecordType == AA09_LIFETIME_BOWHUNTING || tObj.RecordType == AA10_LIFETIME_FISHING || tObj.RecordType == AA11_LIFETIME_MUZZLELOADING || tObj.RecordType == AA12_LIFETIME_SMALL_AND_BIG_GAME || tObj.RecordType == AA13_LIFETIME_SPORTSMAN || tObj.RecordType == AA14_LIFETIME_TRAPPING) {
				if (hasHoldings) holdingMessage += ", ";
				hasHoldings = true;
				holdingMessage += tObj.Description;
				}
			}
			
		if (!hasHoldings) holdingMessage = "You currently do not hold any lifetime licenses.";
		
		editAppSpecific4ACA("Explanation",holdingMessage);
        }
	else 
		{
		editAppSpecific4ACA("Explanation","no contact found");
		}
}
catch (err) {
	editAppSpecific4ACA("Explanation","an error occurred: " + err.message);
	}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
}
else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
    else {
        aa.env.setValue("ErrorCode", "0");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/