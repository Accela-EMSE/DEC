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
var RecordID = String("999913001150");//String(aa.env.getValue("RecordID"));
var getCapResult = aa.cap.getCapID(RecordID);
var capId = getCapResult.getOutput();

aa.print("capId : "+capId);
if (getCapResult.getSuccess()) 
{
updateTask("Report Game Harvest","Reported","","");
closeTask("Report Game Harvest","Reported","","");
var a = isTaskActive("Report Game Harvest");
aa.print("done"+a);
var status = taskStatus("Report Game Harvest");
aa.print(status);
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "Update Success");
//if(status == "Reported"){
//    var status = "Reported";//aa.env.getValue("Status");
//    var comment = "Updated form script";//aa.env.getValue("Comments");
//    updateAppStatus(status, comment, capId);
//    aa.env.setValue("InterfaceReturnCode", "0");
//    aa.env.setValue("InterfaceReturnMessage", "Application status updatedsuccess");

//}
} else {
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage", "Update Not Successfull. CapId not found for RecordID provided.");
}