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
var email_to= lookup("INTERFACE:CONFIGS","DEC_ACH_MANUAL_EMAIL_TO");
var email_from = lookup("INTERFACE:CONFIGS","DEC_ACH_MANUAL_EMAIL_FROM");
var email_report_to = lookup("INTERFACE:CONFIGS","DEC_ACH_Report_Email_To");
var emailSubject = "NYSELS DEC ACH Batch Export Job Notification";
params[0] = "NYSELS DEC ACH Data Export Batch job has been triggered.Report will be sent to "+email_report_to+ " the configured email address once the job is completed";
var res = aa.sendEmail(email_from,email_to,"",emailSubject,params,"");

var param = new Array();
param[0] =aa.env.getValue("serviceName");
param[1] =aa.env.getValue("contactNbrs");
aa.print(param[0]);
aa.print(param[1]);
var url = lookup("INTERFACE:CONFIGS","DEC_ACH_Manual_ServiceURL").toString();
var ExportMethod = lookup("INTERFACE:CONFIGS","ACHManualExportMethodName").toString();
var result = aa.wsConsumer.consume(url,ExportMethod,param).getOutput();

