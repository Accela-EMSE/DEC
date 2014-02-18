/*------------------------------------------------------------------------------------------------------/
| Program : Interface_DEC_ACH_ANS_FAILURE.js
| Event   : Interface
|
| Usage   : 
|			
|			
|
| Client  : N/A
| Action# : N/A
|
| Notes   : This script is used to call ANS Service of Interface Application Server
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
var param = new Array();
param[0] =aa.env.getValue("SERVICE_NAME");
param[1] =aa.env.getValue("FAILURE_AGENTREFCONTACTNUM");
aa.print(param[1]);
var url = lookup("INTERFACE:CONFIGS","DEC_ACH_ANSFAILURE_URL").toString();
aa.print(url);
var email_report_to=lookup("INTERFACE:CONFIGS","DEC_ANS_Report_Email_To").toString();
params[0] = "DEC ANS Batch job has been triggered. Report will be sent to " +email_report_to+ " once the job is completed";
var email_to= lookup("INTERFACE:CONFIGS","DEC_ANS_EMAIL_TO").toString();
var email_from = lookup("INTERFACE:CONFIGS","DEC_ANS_EMAIL_FROM").toString();

var res = aa.sendEmail(email_from,email_to,"","ANS Batch Job Trigger Notification",params,"");
aa.print(res.getSuccess());

var result = aa.wsConsumer.consume(url,"createANSLicensesSet",param).getOutput();