var SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_ACCELA_CONTACT_ASI"));

function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";	
}

//aa.env.setValue("contactNumber", "879147");
//aa.env.setValue("updateDate", "08/30/2013");
//aa.env.setValue("updateTime", "09:00:00");
//aa.env.setValue("lineNbr", "1");

try{
    //updateASITable();
    updateASIT();
    aa.env.setValue("ScriptReturnCode", "0");
    aa.env.setValue("ScriptReturnMessage", "Update of Bank Information has Successful");

    aa.env.setValue("InterfaceReturnCode", "0");
    aa.env.setValue("InterfaceReturnMessage", "Update of Bank Information has Successful");
} catch(err){
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Update of Bank Information has Failed");

    aa.env.setValue("InterfaceReturnCode", "1");
    aa.env.setValue("InterfaceReturnMessage", "Update of Bank Information has Failed");

}

function updateASIT() {
//var contactNumber = aa.env.getValue("contactNumber");//879147
//var updateDatevalue = aa.env.getValue("updateDate");
//var updateTimevalue = aa.env.getValue("updateTime");

    var peopleSequenceNumber = aa.env.getValue("contactNumber");
    var updateTime = aa.env.getValue("updateTime");
    var updateDate = aa.env.getValue("updateDate");
    var tableSubgroup = "BANK INFORMATION";
    var tableFieldName = "Bank Info Changed?";
    var tableFieldNameDate = "Last Pre-Note Date";
    var tableFieldNameTime = "Last Pre-Note Time";
    var lineNbr = aa.env.getValue("lineNbr");

    var peopleModel = aa.people.getPeople(peopleSequenceNumber).getOutput();
    setTemplateValueByTableRow(peopleModel.getTemplate(), tableSubgroup, tableFieldName, lineNbr, "N");
    setTemplateValueByTableRow(peopleModel.getTemplate(), tableSubgroup, tableFieldNameDate, lineNbr, updateDate);
    setTemplateValueByTableRow(peopleModel.getTemplate(), tableSubgroup, tableFieldNameTime, lineNbr, updateTime);
    aa.people.editPeople(peopleModel);
    aa.print("ASIT update Finished");
}
function updateASITable(){
    var peopleSequenceNumber = aa.env.getValue("contactNumber");//879147
    //ASI Sub Group
    var subGroupName = "PRE NOTE PROCESSING";
    var subGroupName2 = "BANK INFORMATION"
    //Fields to update
    var newAInfo = new Array();
    newAInfo.push(new NewTblDef("Bank Info Changed?", "N", subGroupName));

   //Set Value
   var peopleModel = aa.people.getPeople(peopleSequenceNumber).getOutput();
   setContactASI(peopleModel.getTemplate(), newAInfo);

   //update
   aa.people.editPeople(peopleModel);
   aa.print("ASI update");

}