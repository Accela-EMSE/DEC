var SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";	
}
var showDebug;
var debug;
var br;
var peopleSequenceNumber = "879124";
var newAInfo = new Array();
var subGroupName = "APPEARANCE";
newAInfo.push(new NewLicDef("Height", "5", subGroupName));
newAInfo.push(new NewLicDef("Eye Color", "Black", subGroupName));
var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
setContactASI(peopleModel.getTemplate(), newAInfo);