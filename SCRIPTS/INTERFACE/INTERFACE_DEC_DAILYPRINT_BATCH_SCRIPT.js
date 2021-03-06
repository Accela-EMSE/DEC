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
var email_to= lookup("INTERFACE:CONFIGS","DEC_DAILYPRINT_EMAIL_TO");
var email_from = lookup("INTERFACE:CONFIGS","DEC_DAILYPRINT_EMAIL_FROM");
var email_report_to = lookup("INTERFACE:CONFIGS","DEC_DAILYPRINT_Report_Email_To");
var emailSubject = "NYSELS DEC DAILY Print Batch Export Job Notification";
params[0] = "DEC DailyFullfillment Data Export Batch job has been triggered.Report will be sent to "+email_report_to+ " the configured email address once the job is completed";
var res = aa.sendEmail(email_from,email_to,"",emailSubject,params,"");

var param = new Array();
param[0] ="daily";
param[1] ="DECSFTP";//lookup("INTERFACE:CONFIGS","DailyPrintONGORDECSFTP").toString();
var url = lookup("INTERFACE:CONFIGS","DEC_DailyPrint_ServiceURL").toString();
var ExportMethod = lookup("INTERFACE:CONFIGS","DailyPrintExportMethodName").toString();
var result = aa.wsConsumer.consume(url,ExportMethod,param).getOutput();