/*------------------------------------------------------------------------------------------------------/
| Program : Interface_DEC_Magazine.js
| Event   : Interface
|
| Usage   : 
|			
|			
|
| Client  : N/A
| Action# : N/A
|
| Notes   : This script is used to call Magazine export service of Interface Application Server.
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

var params = new Array();
var param = new Array();
param[0] ="DEC_Magazine";
param[1] ="0";
var url = lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_WS_URL").toString();
var result = aa.wsConsumer.consume(url,"export",param).getOutput();


if (result == null){
aa.print("Run Not Successfull");
params[0] = "Run failed. Not able to Access the Service or null response received.";
params[1] = "check Magazine logs for error at "; 
params[2] = "at /app/jboss-admin/logs";
var emailfrom = lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_EMAIL_FROM").toString();
var emailto = lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_EMAIL_TO").toString();
var res = aa.sendEmail(emailfrom,emailto,"","Magazine Result",params,"");
aa.print("Email Sent Status = ");
aa.print(res.getSuccess());
} else
{
params[0] = "Magazine Service Triggered. Response from Service = " +result[0];
params[1] = " Check interface logs at "; 
params[2] = "/app/jboss/logs"; 
var emailfrom = lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_EMAIL_FROM").toString();
var emailto = lookup("INTERFACE:CONFIGS","DEC_MAGAZINE_EMAIL_TO").toString();
var res = aa.sendEmail(emailfrom,emailto,"","Magazine Result",params,"");
aa.print("Email Sent Status = ");
aa.print(res.getSuccess());
}