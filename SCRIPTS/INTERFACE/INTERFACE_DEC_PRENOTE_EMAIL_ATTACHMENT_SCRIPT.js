/*------------------------------------------------------------------------------------------------------/
| Program : INTERFACE_DEC_PRENOTE_EMAIL_ATTACHMENT_SCRIPT.js
| Event   : Interface
|
| Usage   : 
|			
|			
|
| Client  : N/A
| Action# : N/A
|
| Notes   : This script is used to send email with Attachment.
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
var emailFrom = null;
var emailTo = null;



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

var data = aa.env.getValue("lines");
var fname= aa.env.getValue("fileName");
emailSubject = aa.env.getValue("EmailSubject");
emailBody = aa.env.getValue("EmailBody");
email_to= lookup("INTERFACE:CONFIGS","DEC_PRENOTE_EMAIL_ATTACHMENT_TO").toString();
email_from = lookup("INTERFACE:CONFIGS","DEC_PRENOTE_EMAIL_ATTACHMENT_FROM").toString();
var filePath = lookup("INTERFACE:CONFIGS","DEC_PRENOTE_EMAIL_ATTACHMENT_PATH").toString();

var str = '';
    for (var i = 0; i < data.length; i++){
        str += data[i] <= 0x7F?
                data[i] === 0x25 ? "%25" : // %
                String.fromCharCode(data[i]) :
                "%" + data[i].toString(16).toUpperCase();
}

var str2 = decodeURIComponent(str);
var deleteFileRes = aa.util.deleteFile(filePath+fname);
var myfile = aa.util.writeToFile(str2,filePath+fname);
var res =aa.sendEmail(email_from,email_to,"",emailSubject,emailBody,myfile);

if(res.getSuccess()){
      //aa.util.deleteFile(filePath+fname);
      aa.env.setValue("ScriptReturnCode","0");
      aa.env.setValue("ScriptReturnMessage", "Email with Attachment sent Successfully.");
} else {
      aa.env.setValue("ScriptReturnCode","1");
      aa.env.setValue("ScriptReturnMessage", "Email with Attachment is not sent.");
}