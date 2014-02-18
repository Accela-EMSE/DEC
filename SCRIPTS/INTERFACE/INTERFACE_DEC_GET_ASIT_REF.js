//aa.env.setValue("SETID","1122-00001");
//aa.env.setValue("AGENTREFNUM","879146");
try{
var SETID = String(aa.env.getValue("SETID"));
var AGENTREFNUM =String(aa.env.getValue("AGENTREFNUM"));
var flag =false;
var sdate;
var edate;
var status;
var capId;
var peop = aa.people.getPeople(AGENTREFNUM ).getOutput();
var peopScriptModel = aa.people.getPeopleByPeopleModel(peop).getOutput();
var capModel = aa.people.getCapIDsByRefContact(peopScriptModel[0]).getOutput();
var size=capModel.length;
for(var i=0;i<size;i++){
var capid=capModel[i].getCapID();
var cap =aa.cap.getCap(capid).getOutput();
if(("Licenses/DEC Internal/Revenue Management/ACH Status").equals(cap.getCapType())){
capId = capid;
}
}
var tssm = aa.appSpecificTableScript.getAppSpecificTableModel(capId,"SET_STATUS").getOutput();
var tsm = tssm.getAppSpecificTableModel();
var fld = tsm.getTableField();
var sizeOFRecord = fld.size();
var numberOfRecords= sizeOFRecord / 29;
var toCheckValue1 = SETID.toUpperCase();
var toCheckValue2 = ("Sweep Pending").toUpperCase();
for( var i=0;i< numberOfRecords;i++){
currentIndex = i*29;
var currentRecordToCheck1 = fld.get(currentIndex).toUpperCase();
var currentRecordToCheck2 = fld.get(currentIndex+1).toUpperCase();

if(currentRecordToCheck1.equals(toCheckValue1) && currentRecordToCheck2.equals(toCheckValue2) ){
flag =true;
aa.print("MATCHED");
sdate=fld.get(currentIndex+23);
edate=fld.get(currentIndex+24);
status=fld.get(currentIndex+1);
} 
}
if(flag){
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage","Record Found");
aa.env.setValue("STARTDATE", sdate);
aa.env.setValue("ENDDATE",edate);
aa.env.setValue("SETSTATUS",status);
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage","SUCCESS");

}
else{
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage","Record Not Found");
aa.env.setValue("InterfaceReturnCode", "1");
aa.env.setValue("InterfaceReturnMessage","Record Not Found");
}
}
catch(err){
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage","Record Not Found");
aa.env.setValue("InterfaceReturnCode", "1");
aa.env.setValue("InterfaceReturnMessage","Record Not Found");

}