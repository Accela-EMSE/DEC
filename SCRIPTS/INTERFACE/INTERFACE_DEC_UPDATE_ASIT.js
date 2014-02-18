var USERNAME = "Training2";//aa.env.getValue("USERNAME");
var SETID = "1002-5";//aa.env.getValue("SETID");
var SetStatus ="Sweep Pending";// aa.env.getValue("SetStatus");
var SETPreviousStatus = "dd";//aa.env.getValue("SETPreviousStatus");
var DependentSets = "aa";//aa.env.getValue("DependentSets");
var DateTime = "10/10/2013";//aa.env.getValue("DateTime");
var CreatedSource ="aa";//aa.env.getValue("CreatedSource");
var ACHFailedSets ="aa";//aa.env.getValue("ACHFailedSets");
var ACHFailedPaidSets = "aa";//aa.env.getValue("ACHFailedPaidSets");
var GrossSales = "0";//aa.env.getValue("GrossSales");
var Commissions ="0";// aa.env.getValue("Commissions");
var NetSales ="0";// aa.env.getValue("NetSales");
var AdjustmentsAmount ="0";//aa.env.getValue("AdjustmentsAmount");
var NonReturnedDocAmt ="0";//aa.env.getValue("NonReturnedDocAmt");
var ResolvedDisputedAmt = "0";//aa.env.getValue("ResolvedDisputedAmt");
var ACHFailuresReportedAmt = "0";//aa.env.getValue("ACHFailuresReportedAmt");
var ACHFailuresPaidAmt ="0";//aa.env.getValue("ACHFailuresPaidAmt");
var ACHFailureScheduledforPaymentAmt = "0";//aa.env.getValue("ACHFailureScheduledforPaymentAmt");
var AmountDisputed = "0";//aa.env.getValue("AmountDisputed");
var DisputedAmtResolved ="0";//aa.env.getValue("DisputedAmtResolved");
var NewACHFailuresReportedAmt = "0";//aa.env.getValue("NewACHFailuresReportedAmt");
var ACHFailuresPaidAmt_AgentRev = "0";//aa.env.getValue("ACHFailuresPaidAmtAgentRev");
var ACHFailuresScheduledforPaymentAmt_AgentRev ="0";//aa.env.getValue("ACHFailuresSchforPaymentAmt");
var ACHFailuresRemovedfromSubmissionAmt = "0";//aa.env.getValue("ACHFailuresRemovedfromSubmissionAmt");
var BillingPeriodStartDate ="10/10/2010";//aa.env.getValue("BillingPeriodStartDate");
var BillingPeriodEndDate = "10/10/2010";//aa.env.getValue("BillingPeriodEndDate");
var AccountNoticeDate = "10/10/2010";//aa.env.getValue("AccountNoticeDate");
var AgentID = "1002";//aa.env.getValue("AgentID");
var AgentName_StoreNumber ="aaaaaa";// aa.env.getValue("AgentNameStoreNumber");
var VoidAmt = "0";//aa.env.getValue("VoidAmt");
var TotalACHAmount = "0";//aa.env.getValue("TotalACHAmount");
var Pending_Charges = "0";//aa.env.getValue("PendingCharges");
var Account_Balance = "0";//aa.env.getValue("AccountBalance");
var PreviousBalance_OpenAmounts = "0";//aa.env.getValue("PrevBalanceOpenAmounts");
var PreviousBalance_PendingAmounts = "0";//aa.env.getValue("PrevBalancePendingAmounts");

var flag =false;


var RecordID =String("13CAP-00000-00CXS"); //String(aa.env.getValue("RECORDID"));//String("13CAP-00000-00A5K");
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
var currentRecordToCheck1 = fld.get(currentIndex).toUpperCase();
var toCheckValue1 = SETID.toUpperCase();
var currentRecordToCheck2 = fld.get(currentIndex+1).toUpperCase();
var toCheckValue2 = SetStatus.toUpperCase();

if(currentRecordToCheck1.equals(toCheckValue1) && currentRecordToCheck2.equals(toCheckValue2))
{
flag =true;
fld.set(currentIndex+2,SETPreviousStatus);
fld.set(currentIndex+3,DependentSets);
fld.set(currentIndex+4,aa.util.parseDate(DateTime));
fld.set(currentIndex+5,CreatedSource);
fld.set(currentIndex+6,ACHFailedSets);
fld.set(currentIndex+7,ACHFailedPaidSets);
fld.set(currentIndex+8,GrossSales);
fld.set(currentIndex+9,Commissions);
fld.set(currentIndex+10,NetSales);
fld.set(currentIndex+11,AdjustmentsAmount);
fld.set(currentIndex+12,NonReturnedDocAmt);
fld.set(currentIndex+13,ResolvedDisputedAmt);
fld.set(currentIndex+14,ACHFailuresReportedAmt);
fld.set(currentIndex+15,ACHFailuresPaidAmt);
fld.set(currentIndex+16,ACHFailureScheduledforPaymentAmt);
fld.set(currentIndex+17,AmountDisputed);
fld.set(currentIndex+18,DisputedAmtResolved);
fld.set(currentIndex+19,NewACHFailuresReportedAmt);
fld.set(currentIndex+20,ACHFailuresPaidAmt_AgentRev);
fld.set(currentIndex+21,ACHFailuresScheduledforPaymentAmt_AgentRev);
fld.set(currentIndex+22,ACHFailuresRemovedfromSubmissionAmt);
fld.set(currentIndex+23,aa.util.parseDate(BillingPeriodStartDate));
fld.set(currentIndex+24,aa.util.parseDate(BillingPeriodEndDate));
fld.set(currentIndex+25,aa.util.parseDate(AccountNoticeDate));
fld.set(currentIndex+26,AgentID);
fld.set(currentIndex+27,AgentName_StoreNumber);
fld.set(currentIndex+28,VoidAmt);
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
if(flag == false){
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage","Record Not Found");
aa.env.setValue("InterfaceReturnCode", "0");
aa.env.setValue("InterfaceReturnMessage","Record Not Found");
}
