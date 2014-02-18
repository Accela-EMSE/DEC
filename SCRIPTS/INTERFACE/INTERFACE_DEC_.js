var RecordID;
var capId;

//aa.env.setValue("AGENTID","agntName");
//aa.env.setValue("USERNAME","Training2");
//aa.env.setValue("RECORDIDS",null);
//aa.env.setValue("AGNT_REFNUM","999900000183");
//aa.env.setValue("SETID","0183-1");


var agentID = aa.env.getValue("AGENTID");
var userName = aa.env.getValue("USERNAME");
var lst = aa.env.getValue("RECORDIDS");
var newSetID = aa.env.getValue("SETID");
var refNumber=aa.env.getValue("AGNT_REFNUM");


var setScript = aa.set.getSetHeaderScriptModel().getOutput();
setScript.setSetID(newSetID);
setScript.setSetTitle(agentID+'-'+getTDate());
setScript.setSetComment("SET Comments");
setScript.setSetStatus("Sweep Pending");
setScript.setSetStatusComment(refNumber);
setScript.setRecordSetType("ACH Transfers");
setScript.setServiceProviderCode("DEC");
setScript.setAuditDate(aa.date.getCurrentDate());
setScript.setAuditID(userName);
var setCreateResult = aa.set.createSetHeader(setScript);

if(setCreateResult.getSuccess()){
	var setOutput= setCreateResult.getOutput();
	var setid =setOutput.getSetID();
aa.print(setid);

if( lst.equals("")){

aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "Success Created SET without SET member's");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage",setid);


}else{
var listRecords = aa.util.toObjectArray(lst).getOutput();
var sizeList = listRecords.length;
if(sizeList > 0){
for(var index=0;index<sizeList;index++)
{
RecordID = listRecords[index];
capId= aa.cap.getCapID(RecordID).getOutput();
aa.set.addCapSetMember(setid,capId);
}
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "Success Created SET");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage",setid);
}
else{
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "No ALTID's Found");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage",setid);

}


}

}
else{
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage", "Unable to Create SET");
aa.env.setValue("InterfaceReturnCode", "1");
aa.env.setValue("InterfaceReturnMessage","SET creation unsucessfull");
}
function getTDate(){
var sysDate =aa.date.getCurrentDate();
var pMonth  = sysDate.getMonth();
var pDay = sysDate.getDayOfMonth();
var fYear = sysDate.getYear().toString();
var pYear = fYear.substring(2,4);
if (pMonth > 9){
pMonth  = pMonth.toString();
}
else{
pMonth = "0"+pMonth.toString();
}
if (pDay > 9){
pDay = pDay.toString();
}
else{
pDay = "0"+pDay.toString();
}

var tDate= pMonth+pDay+pYear;
return tDate;
}