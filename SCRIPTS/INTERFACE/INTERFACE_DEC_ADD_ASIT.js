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
try{
var SETID = aa.env.getValue("SETID");
var SetStatus = aa.env.getValue("SetStatus");
var SETPreviousStatus = aa.env.getValue("SETPreviousStatus");
var DependentSets = aa.env.getValue("DependentSets");
var DTime = aa.env.getValue("DateTime");
var DateTime = String(DTime);
var CreatedSource =aa.env.getValue("CreatedSource");
var ACHFailedSets =aa.env.getValue("ACHFailedSets");
var ACHFailedPaidSets = aa.env.getValue("ACHFailedPaidSets");
var GrossSales = aa.env.getValue("GrossSales");
var Commissions = aa.env.getValue("Commissions");
var NetSales = aa.env.getValue("NetSales");
var AdjustmentsAmount =aa.env.getValue("AdjustmentsAmount");
var NonReturnedDocAmt =aa.env.getValue("NonReturnedDocAmt");
var ResolvedDisputedAmt = aa.env.getValue("ResolvedDisputedAmt");
var ACHFailuresReportedAmt = aa.env.getValue("ACHFailuresReportedAmt");
var ACHFailuresPaidAmt =aa.env.getValue("ACHFailuresPaidAmt");
var ACHFailureScheduledforPaymentAmt = aa.env.getValue("ACHFailureScheduledforPaymentAmt");
var AmountDisputed = aa.env.getValue("AmountDisputed");
var DisputedAmtResolved =aa.env.getValue("DisputedAmtResolved");
var NewACHFailuresReportedAmt = aa.env.getValue("NewACHFailuresReportedAmt");
var ACHFailuresPaidAmt_AgentRev = aa.env.getValue("ACHFailuresPaidAmt_AgentRev");
var ACHFailuresScheduledforPaymentAmt_AgentRev =aa.env.getValue("ACHFailuresScheduledforPaymentAmt_AgentRev");
var ACHFailuresRemovedfromSubmissionAmt = aa.env.getValue("ACHFailuresRemovedfromSubmissionAmt");
var BillingPeriodStartDate =aa.env.getValue("BillingPeriodStartDate");
var BllingPeriodEndDate = aa.env.getValue("BllingPeriodEndDate");
var AccountNoticeDate = aa.env.getValue("AccountNoticeDate");
var AgentID = aa.env.getValue("AgentID");
var AgentName_StoreNumber = aa.env.getValue("AgentNameStoreNumber");
var VoidAmt = aa.env.getValue("VoidAmount");
var TotalACHAmount = aa.env.getValue("TotalACHAmount");
var Pending_Charges = aa.env.getValue("Pending_Charges");
var Account_Balance = aa.env.getValue("Account_Balance");
var PreviousBalance_OpenAmounts = aa.env.getValue("PreviousBalance_OpenAmounts");
var PreviousBalance_PendingAmounts = aa.env.getValue("PreviousBalance_PendingAmounts");
var RecordID = String(aa.env.getValue("RecordID"));//String("13CAP-00000-00A5K");//String(aa.env.getValue("RecordID"));
var capId = aa.cap.getCapID(RecordID).getOutput();

var tempArray = new Array();
var temp = new Array();


temp["SETID"]=String(SETID);
temp["SetStatus"]=String(SetStatus);
temp["SETPreviousStatus"]=String(SETPreviousStatus);
temp["DependentSets"]=String(DependentSets);
temp["DateTime"]=DateTime;
temp["CreatedSource"]=String(CreatedSource);
temp["ACHFailedSets"]=String(ACHFailedSets);
temp["ACHFailedPaidSets"]=String(ACHFailedPaidSets);
temp["GrossSales"]=String(GrossSales);
temp["Commissions"]=String(Commissions);
temp["NetSales"]=String(NetSales);
temp["AdjustmentsAmount"]=String(AdjustmentsAmount);
temp["NonReturnedDocAmt"]=String(NonReturnedDocAmt);
temp["ResolvedDisputedAmt"]=String(ResolvedDisputedAmt);
temp["ACHFailuresReportedAmt"]=String(ACHFailuresReportedAmt);
temp["ACHFailuresPaidAmt"]=String(ACHFailuresPaidAmt);
temp["ACHFailureScheduledforPaymentAmt"]=String(ACHFailureScheduledforPaymentAmt);
temp["AmountDisputed"]=String(AmountDisputed);
temp["DisputedAmtResolved"]=String(DisputedAmtResolved);
temp["NewACHFailuresReportedAmt"]=String(NewACHFailuresReportedAmt);
temp["ACHFailuresPaidAmt_AgentRev"]=String(ACHFailuresPaidAmt_AgentRev);
temp["ACHFailuresScheduledforPaymentAmt_AgentRev"]=String(ACHFailuresScheduledforPaymentAmt_AgentRev);
temp["ACHFailuresRemovedfromSubmissionAmt"]=String(ACHFailuresRemovedfromSubmissionAmt);
temp["BillingPeriodStartDate"]=String(BillingPeriodStartDate);
temp["BllingPeriodEndDate"]=String(BllingPeriodEndDate);
temp["AccountNoticeDate"]=String(AccountNoticeDate);

temp["AgentID"]=String(AgentID);
temp["AgentName_StoreNumber"]=String(AgentName_StoreNumber);
temp["VoidAmt"]=String(VoidAmt);
temp["TotalACHAmount"]=String(TotalACHAmount);
temp["Pending_Charges"]=String(Pending_Charges);
temp["Account_Balance"]=String(Account_Balance);
temp["PreviousBalance_OpenAmounts"]=String(PreviousBalance_OpenAmounts);
temp["PreviousBalance_PendingAmounts"]=String(PreviousBalance_PendingAmounts);




//temp["SETID"]="123456";
//temp["SetStatus"]="Swept";
//temp["SETPreviousStatus"]="sweep pending";
//temp["DependentSets"]="sweep failed";
//temp["DateTime"]="09/17/2013";
//temp["CreatedSource"]="source";
//temp["ACHFailedSets"]="failed sets";
//temp["ACHFailedPaidSets"]="failed paid sets";
//temp["GrossSales"]="99";
//temp["Commissions"]="9";
//temp["NetSales"]="109";
//temp["AdjustmentsAmount"]="100";
//temp["NonReturnedDocAmt"]="10";
//temp["ResolvedDisputedAmt"]="111";
//temp["ACHFailuresReportedAmt"]="222";
//temp["ACHFailuresPaidAmt"]="333";
//temp["ACHFailureScheduledforPaymentAmt"]="444";
//temp["AmountDisputed"]="555";
//temp["DisputedAmtResolved"]="666";
//temp["NewACHFailuresReportedAmt"]="777";
//temp["ACHFailuresPaidAmt_AgentRev"]="888";
//temp["ACHFailuresScheduledforPaymentAmt_AgentRev"]="999";
//temp["ACHFailuresRemovedfromSubmissionAmt"]="1245";
//temp["BillingPeriodStartDate"]="09/18/2013";
//temp["BllingPeriodEndDate"]="09/19/2013";
//temp["AccountNoticeDate"]="09/20/2013";

tempArray.push(temp);

addASITable("SET_STATUS",tempArray,capId);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Success Adding Member's");
	aa.env.setValue("InterfaceReturnCode", "0");
	aa.env.setValue("InterfaceReturnMessage","SUCCESS");
	}
 catch (err) {
        aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", "Update failed");
	aa.env.setValue("InterfaceReturnCode", "1");
	aa.env.setValue("InterfaceReturnMessage","Update failed");
    }