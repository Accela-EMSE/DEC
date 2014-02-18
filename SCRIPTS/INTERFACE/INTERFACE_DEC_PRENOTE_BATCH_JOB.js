var SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));
function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";	
}

var param = new Array();
param[0] ="prenote"; 
var url = lookup("INTERFACE:CONFIGS","DEC_PreNote_ServiceURL").toString();
var ExportMethod = lookup("INTERFACE:CONFIGS","PrenoteExportMethodName").toString();
var result = aa.wsConsumer.consume(url,ExportMethod,param).getOutput();

if(result == null){
aa.print("Not Exported");
} else {
aa.print(result[0]);
}