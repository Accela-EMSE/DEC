var USERNAME = aa.env.getValue("USERNAME");
var SETID = aa.env.getValue("SETID");
var SetStatus =aa.env.getValue("SetStatus");
var AmountDisputed = aa.env.getValue("AmountDisputed");
var DisputedAmtResolved =aa.env.getValue("DisputedAmtResolved");
var NewACHFailuresReportedAmt = aa.env.getValue("NewACHFailuresReportedAmt");
var ACHFailuresPaidAmt_AgentRev = aa.env.getValue("ACHFailuresPaidAmtAgentRev");
var ACHFailuresScheduledforPaymentAmt_AgentRev =aa.env.getValue("ACHFailuresSchforPaymentAmt");
var TotalACHAmount = aa.env.getValue("TotalACHAmount");
var Pending_Charges = aa.env.getValue("PendingCharges");
var Account_Balance = aa.env.getValue("AccountBalance");
var PreviousBalance_OpenAmounts = aa.env.getValue("PrevBalanceOpenAmounts");
var PreviousBalance_PendingAmounts = aa.env.getValue("PrevBalancePendingAmounts");
var flag =false;
//var peop = aa.people.getPeople(AGENTREFNUM).getOutput();
//var peopScriptModel = aa.people.getPeopleByPeopleModel(peop).getOutput();
//var capModel = aa.people.getCapIDsByRefContact(peopScriptModel[0]).getOutput();
//var size=capModel.length;
//for(var i=0;i<size;i++){
//var capid=capModel[i].getCapID();
//var cap =aa.cap.getCap(capid).getOutput();
//if(("Licenses/DEC Internal/Revenue Management/ACH Status").equals(cap.getCapType())){
//capId = capid;
//}
//}

try{
var RecordID =String(aa.env.getValue("RECORDID"));//String("13CAP-00000-00A5K");
var capId = aa.cap.getCapID(RecordID).getOutput();
aa.print(capId);
var tssm = aa.appSpecificTableScript.getAppSpecificTableModel(capId,"SET_STATUS").getOutput();
var tsm = tssm.getAppSpecificTableModel();
var fld = tsm.getTableField();
var sizeOFRecord = fld.size();
aa.print(sizeOFRecord);
var numberOfRecords= sizeOFRecord / 34;
for( var i=0;i< numberOfRecords;i++){
currentIndex = i*34;

if(null == fld.get(currentIndex) || ("").equals(fld.get(currentIndex)) || null == fld.get(currentIndex+1) || ("").equals(fld.get(currentIndex+1))){

aa.print("Either SETID or Set Status is empty");


}
else{
var currentRecordToCheck1 = fld.get(currentIndex).toUpperCase();
var toCheckValue1 = SETID.toUpperCase();
var currentRecordToCheck2 = fld.get(currentIndex+1).toUpperCase();
var toCheckValue2 = SetStatus.toUpperCase();
if(currentRecordToCheck1.equals(toCheckValue1) && currentRecordToCheck2.equals(toCheckValue2))
{
flag =true;
fld.set(currentIndex+17,AmountDisputed);
fld.set(currentIndex+18,DisputedAmtResolved);
fld.set(currentIndex+19,NewACHFailuresReportedAmt);
fld.set(currentIndex+20,ACHFailuresPaidAmt_AgentRev);
fld.set(currentIndex+21,ACHFailuresScheduledforPaymentAmt_AgentRev);
fld.set(currentIndex+29,TotalACHAmount);
fld.set(currentIndex+30,Pending_Charges);
fld.set(currentIndex+31,Account_Balance);
fld.set(currentIndex+32,PreviousBalance_OpenAmounts);
fld.set(currentIndex+33,PreviousBalance_PendingAmounts);
tsm.setTableField(fld);
aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, capId, USERNAME).getOutput();
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage","Success");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage","SUCCESS");
}

}




}
if(flag == false){
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage","Record Not Found");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage","Record Not Found");
}

}
catch(err){
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage","Error in Script" + err);
aa.env.setValue("InterfaceReturnCode", "1");
aa.env.setValue("InterfaceReturnMessage","Error in Script");
}
