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
var email_to= lookup("INTERFACE:CONFIGS","DEC_LTPRINT_Email_To");
var email_from = lookup("INTERFACE:CONFIGS","DEC_LTPRINT_Email_From");
var email_report_to = lookup("INTERFACE:CONFIGS","DEC_LTPRINT_Report_To");
var emailSubject = "NYSELS DEC Print LifeTime Fullfillment Batch Export Job Notification";
params[0] = "NYSELS DEC Print LifeTime Fullfillment Data Export Batch job has been triggered.Report will be sent to "+email_report_to+ " the configured email address once the job is completed";
var res = aa.sendEmail(email_from,email_to,"",emailSubject,params,"");


var param = new Array();
param[0] ="LT"; 
var url = lookup("INTERFACE:CONFIGS","DEC_LTPrint_ServiceURL").toString();
var ExportMethod = lookup("INTERFACE:CONFIGS","LTExportMethodName").toString();
var result = aa.wsConsumer.consume(url,ExportMethod,param).getOutput();
if(result == null){
aa.print("Not Exported");
aa.sendEmail(email_from,email_to,"",emailSubject,"NYSELS DEC LifeTime Fullfillment Print Data Export Batch job has not exported files. Please check after some time.","");
} else {
aa.print(result[0]);
}