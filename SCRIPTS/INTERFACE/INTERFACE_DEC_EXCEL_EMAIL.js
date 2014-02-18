/*------------------------------------------------------------------------------------------------------/
| Program : INTERFACE_DEC_EXCEL_EMAIL.js
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

var data = aa.env.getValue("ARRAY");
var fname= aa.env.getValue("FILENAME");
emailSubject = aa.env.getValue("SUBJECT");
emailBody = aa.env.getValue("BODY");
var bname = aa.env.getValue("BUSNAME");
var busEmail;
if(bname.toLowerCase().contains("sports")){
busEmail= lookup("INTERFACE:CONFIGS","DEC_CANS_Attachment_SportsAuthority_EMAIL_TO").toString();
}else if(bname.toLowerCase().contains("wal-mart")){
busEmail= lookup("INTERFACE:CONFIGS","DEC_CANS_Attachment_WalMart_EMAIL_TO").toString();
}else if(bname.toLowerCase().contains("k-mart")){
busEmail= lookup("INTERFACE:CONFIGS","DEC_CANS_Attachment_KMART_EMAIL_TO").toString();
}else if(bname.toLowerCase().contains("dick's")){
busEmail= lookup("INTERFACE:CONFIGS","DEC_CANS_Attachment_DICKS_EMAIL_TO").toString();
}else{
busEmail= lookup("INTERFACE:CONFIGS","DEC_CANS_Attachment_DEFAULT_EMAIL_TO").toString();
}

//var email_to= lookup("INTERFACE:CONFIGS","DEC_ACH_EMAIL_ATTACHMENT_TO").toString();
var email_from = lookup("INTERFACE:CONFIGS","DEC_ACH_EMAIL_ATTACHMENT_FROM").toString();
//var res = aa.sendEmail(email_from,email_to,"",emailSubject,emailBody,"");
var filePath = lookup("INTERFACE:CONFIGS","DEC_ACH_EMAIL_ATTACHMENT_PATH").toString();

var str = '';
    for (var i = 0; i < data.length; i++){
        str += data[i] <= 0x7F?
                data[i] === 0x25 ? "%25" : // %
                String.fromCharCode(data[i]) :
                "%" + data[i].toString(16).toUpperCase();
}

var str2 = decodeURIComponent(str);
var myfile = aa.util.writeToFile(str2,filePath+fname);
var res =aa.sendEmail(email_from,busEmail,"",emailSubject,emailBody,myfile);


if(res.getSuccess()){
      aa.util.deleteFile(filePath+fname);
      aa.env.setValue("ScriptReturnCode","0");
      aa.env.setValue("ScriptReturnMessage", "Email Sent Successfully.");
} else {
      aa.env.setValue("ScriptReturnCode","1");
      aa.env.setValue("ScriptReturnMessage", "Email is not sent.");
}