/*------------------------------------------------------------------------------------------------------/
| Program : Interface_DEC_OTDA.js
| Event   : Interface
|
| Usage   : 
|			
|			
|
| Client  : N/A
| Action# : N/A
|
| Notes   : This script is used to call OTDA Service of Interface Application Server
|
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|	The following script code will attempt to read the assocaite event and invoker the proper standard choices
|    
/------------------------------------------------------------------------------------------------------*/



/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/

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
var paramemail =new Array();
var param = new Array();

var email_report_to= lookup("INTERFACE:CONFIGS","OTDA_REPORT_EMAIL_TO").toString();
var email_report_from = lookup("INTERFACE:CONFIGS","OTDA_REPORT_EMAIL_FROM").toString();
var email_to=lookup("INTERFACE:CONFIGS","OTDA_EMAIL_TO").toString();
var email_from=lookup("INTERFACE:CONFIGS","OTDA_EMAIL_FROM").toString();
var emailSubject = "NYSELS DEC OTDA Batch Job Notification";
paramemail[0] = "DEC OTDA Batch job has been triggered.Report will be sent to "+email_report_to+ " the configured email address once the job is completed";
var emailres = aa.sendEmail(email_from,email_to,"",emailSubject,paramemail,"");
aa.print(emailres.getSuccess());



param[0] ="DEC_OTDA";
param[1] ="0";  //process id
var url = lookup("INTERFACE:CONFIGS","OTDA_Service_URL").toString();
var result = aa.wsConsumer.consume(url,"queryLicenseInfo",param).getOutput();

if (result == null){
aa.print("failed");
params[0] = "Run failed ";
params[1] = "check OTDA Service logs for error at "; 
params[2] =  lookup("INTERFACE:CONFIGS", "DEC_OTDA_Interface_LogPath").toString(); 
var res = aa.sendEmail(email_report_to,email_report_from,"","DEC OTDA Export/ImportService Result",params,"");
aa.print(res.getSuccess());
} else
{
aa.print(result[0]);
}