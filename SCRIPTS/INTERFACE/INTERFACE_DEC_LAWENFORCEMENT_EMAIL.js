/*------------------------------------------------------------------------------------------------------/
| Program : INTERFACE_DEC_LAWENFORCEMENT_EMAIL.js
| Event   : Interface
|
| Usage   :
|
|
|
| Client  : N/A
| Action# : N/A
|
| Notes   : This script is used to send email.
|
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|	The following script code will attempt to read the assocaite event and invoker the proper standard choices
|
/------------------------------------------------------------------------------------------------------*/

var emailSubject = null;
var emailBody = null;


/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/

var SCRIPT_VERSION = 2.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
//eval(getScriptText("INCLUDES_CUSTOM"));
function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}

emailSubject = aa.env.getValue("EmailSubject");
emailBody1 = aa.env.getValue("EmailBody1");
emailBody2 = aa.env.getValue("EmailBody2");
emailBody = aa.env.getValue("EmailBody");

var email_to= lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_REPORT_EMAIL_TO").toString();
var email_from = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_REPORT_EMAIL_FROM").toString();
var res = aa.sendMail(email_from,email_to,"",emailSubject,emailBody1+emailBody+emailBody2);
aa.print(res.getSuccess());

if(res.getSuccess()){
      aa.env.setValue("ScriptReturnCode","0");
      aa.env.setValue("ScriptReturnMessage", "Email Sent Successfully.");
} else {
      aa.env.setValue("ScriptReturnCode","1");
      aa.env.setValue("ScriptReturnMessage", "Email is not sent.");
}