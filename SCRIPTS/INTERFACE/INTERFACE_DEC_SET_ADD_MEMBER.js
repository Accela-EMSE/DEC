var RecordID;
var capId;

var SETID = aa.env.getValue("SETID");
var lst = aa.env.getValue("RECORDIDS");

if(lst.equals("")){
	aa.print("No members found");
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "No Member's Added");
	aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage","SUCCESS");


}else{


var listRecords = aa.util.toObjectArray(lst).getOutput();

var sizeList = listRecords.length;

var listSetMembers =aa.set.getCAPSetMembersByPK(SETID).getOutput();

if(sizeList > 0){
for(var index=0;index<sizeList;index++)
{
RecordID = listRecords[index];
capId= aa.cap.getCapID(RecordID).getOutput();
if(String(listSetMembers).match(capId)){
aa.print("MATCH : " + capId);
}
else{
aa.set.addCapSetMember(SETID,capId);
}
}
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "Success Adding Member's");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage","SUCCESS");
}
else{
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage", "No ALTID's Found");
aa.env.setValue("InterfaceReturnCode", "1");
aa.env.setValue("InterfaceReturnMessage","No ALTID's Found");
}
}