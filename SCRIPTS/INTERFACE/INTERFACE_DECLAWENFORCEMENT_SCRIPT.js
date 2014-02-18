/*------------------------------------------------------------------------------------------------------/
| Program : Interface_DEC_LawEnforcement.js
| Event   : Interface
|
| Usage   :
|
|
|
| Client  : N/A
| Action# : N/A
|
| Notes   : This script is used to call Law Enforcement Import service of Interface Application Server.
|
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|	The following script code will attempt to read the assocaite event and invoker the proper standard choices
|
/------------------------------------------------------------------------------------------------------*/


var url = null;
var result = null;

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
var email_to= lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_EMAIL_TO").toString();
var email_from = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_EMAIL_FROM").toString();
var email_report_to = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_REPORT_EMAIL_TO").toString();
var body = "DEC Law Enforcement Batch Job triggered. Email will be sent to " +email_report_to+ " once Job is finished";
aa.sendMail(email_from,email_to,"","DEC Law Enforcement BatchJob Triggered",body);
aa.print("DEC DMV Batch Job Triggered");

var param = new Array();
param[0] = "DEC_LAWENFORCEMENT";
var url = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_WS_URL").toString();
var method = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_WS_METHOD").toString();
aa.wsConsumer.consume(url,method,param);
