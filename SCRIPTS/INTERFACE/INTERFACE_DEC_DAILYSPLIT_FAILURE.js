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

var params = new Array();
var email_to= lookup("INTERFACE:CONFIGS","DEC_ACH_Daily_Split_To");
var email_from = lookup("INTERFACE:CONFIGS","DEC_ACH_Daily_Split_From");
var emailSubject = "NYSELS DEC ACH Daily Split Failure Batch Export Job Notification";
params[0] = "NYSELS DEC ACH Daily Split Failure Export Batch job has been triggered.Report will be sent to "+email_to + " the configured email address once the job is completed";
var res = aa.sendEmail(email_from,email_to,"",emailSubject,params,"");


var param = new Array();
param[0] ="DEC_ACH"; 
var url = lookup("INTERFACE:CONFIGS","DEC_DailySplit_Failure_ServiceURL").toString();
var ExportMethod = lookup("INTERFACE:CONFIGS","DEC_ACH_DailySplit_Failure_MethodName").toString();
var result = aa.wsConsumer.consume(url,ExportMethod,param).getOutput();
aa.print(result);