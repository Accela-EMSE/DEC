/*------------------------------------------------------------------------------------------------------/
| Program : INTERFACE_DEC_MAGAZINE_EMAIL_SERVICE.js
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
eval(getScriptText("INCLUDES_CUSTOM"));
function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";	
}

emailSubject = aa.env.getValue("EmailSubject");
emailBody = aa.env.getValue("EmailBody");

var emailto= lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_REPORT_EMAIL_TO").toString();
var emailfrom= lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_EMAIL_FROM").toString();
var res = aa.sendEmail(emailfrom,emailto,"",emailSubject,emailBody,"");
aa.print(res.getSuccess());

if(res.getSuccess()){
      aa.env.setValue("ScriptReturnCode","0");
      aa.env.setValue("ScriptReturnMessage", "Email Sent Successfully.");
} else {
      aa.env.setValue("ScriptReturnCode","1");
      aa.env.setValue("ScriptReturnMessage", "Email is not sent.");
}