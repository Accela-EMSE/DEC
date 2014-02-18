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
var SALEDATE = aa.env.getValue("SALEDATE");
var SALEPERIODTXN = aa.env.getValue("SALEPERIODTXN");
var NETSALE = aa.env.getValue("NETSALE");
var COMMISSION = aa.env.getValue("COMMISSION");
var GROSSSALES = aa.env.getValue("GROSSSALES");





var RecordID = String(aa.env.getValue("RECORDID"));//String("13CAP-00000-00F6X");//String(aa.env.getValue("RecordID"));

if(RecordID.equals("null")){

var V_GROUP= "Licenses";
var V_TYPE = "DEC Internal";
var V_SUBTYPE = "Revenue Management";
var V_CATEGORY = "ACH Status";
var V_DESC = "Create a record with active record type";
var refContactSeqNumber = aa.env.getValue("contactSeqNbr");
var checkResult = aa.cap.checkAppTypeStatus(V_GROUP,V_TYPE,V_SUBTYPE,V_CATEGORY);
if(checkResult.getSuccess())
{
    if("A" == checkResult.getOutput())
    {
         var capIDModel = aa.cap.createApp(V_GROUP,V_TYPE,V_SUBTYPE,V_CATEGORY,V_DESC); //create application that record type is active only.
         aa.print("Create a record with record type active successfully! "+ capIDModel.getOutput());
         var capId = aa.cap.getCapID(capIDModel.getOutput()).getOutput();
         aa.print(capId.getCustomID());

         var getCapResult = aa.cap.getCapID(capIDModel.getOutput());
         aa.print(getCapResult.getOutput());

         var status = "Active";
         var comment = "New License for Agent ACH SET STATUS";
         updateAppStatus(status, comment, capId);
         var pplModel= aa.people.getPeople(aa.util.parseLong(refContactSeqNumber)).getOutput();
         aa.print(pplModel);

		var contactAddResult = aa.people.createCapContactWithRefPeopleModel(capId, pplModel);
		if (contactAddResult.getSuccess())
		{
			var tempArray = new Array();
			var temp = new Array();
			temp["Date"]=String(SALEDATE);
			temp["SalePeriod_Txns"]=String(SALEPERIODTXN);
			temp["NetSales"]=String(NETSALE);
			temp["Commissions"]=String(COMMISSION);
			temp["GrossSales"]=String(GROSSSALES);
			tempArray.push(temp);

			addASITable("ANS_DATA",tempArray,capId);
			aa.env.setValue("ScriptReturnCode", "0");
			aa.env.setValue("ScriptReturnMessage", "Success Adding ASIT's");
			aa.env.setValue("InterfaceReturnCode", "0");
			aa.env.setValue("InterfaceReturnMessage","SUCCESS");
		}
		else
		{
			aa.print("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage());
			aa.env.setValue("ScriptReturnCode", "1");
			aa.env.setValue("ScriptReturnMessage", "Cannot add contact: " + contactAddResult.getErrorMessage());
			aa.env.setValue("InterfaceReturnCode", "1");
			aa.env.setValue("InterfaceReturnMessage","Cannot add contact: " + contactAddResult.getErrorMessage());
		}
    }
    else
    {
         var capIDModel = aa.cap.createAppRegardlessAppTypeStatus(V_GROUP,V_TYPE,V_SUBTYPE,V_CATEGORY,V_DESC);  //create application record regardless of record type status.
         aa.print("Create a record with record type other than active successfully! "+ capIDModel.getOutput());
		          var capId = aa.cap.getCapID(capIDModel.getOutput()).getOutput();
         aa.print(capId.getCustomID());

         var getCapResult = aa.cap.getCapID(capIDModel.getOutput());
         aa.print(getCapResult.getOutput());

         var status = "Active";
         var comment = "New License for Agent ACH SET STATUS";
         updateAppStatus(status, comment, capId);
         var pplModel= aa.people.getPeople(aa.util.parseLong(refContactSeqNumber)).getOutput();
         aa.print(pplModel);

		var contactAddResult = aa.people.createCapContactWithRefPeopleModel(capId, pplModel);
		if (contactAddResult.getSuccess())
		{
			var tempArray = new Array();
			var temp = new Array();
			temp["Date"]=String(SALEDATE);
			temp["SalePeriod_Txns"]=String(SALEPERIODTXN);
			temp["NetSales"]=String(NETSALE);
			temp["Commissions"]=String(COMMISSION);
			temp["GrossSales"]=String(GROSSSALES);
			tempArray.push(temp);

			addASITable("ANS_DATA",tempArray,capId);
			aa.env.setValue("ScriptReturnCode", "0");
			aa.env.setValue("ScriptReturnMessage", "Success Adding ASIT's");
			aa.env.setValue("InterfaceReturnCode", "0");
			aa.env.setValue("InterfaceReturnMessage","SUCCESS");
		}
		else
		{
			aa.print("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage());
			aa.env.setValue("ScriptReturnCode", "1");
			aa.env.setValue("ScriptReturnMessage", "Cannot add contact: " + contactAddResult.getErrorMessage());
			aa.env.setValue("InterfaceReturnCode", "1");
			aa.env.setValue("InterfaceReturnMessage","Cannot add contact: " + contactAddResult.getErrorMessage());
		}
    }

}
else
{
	aa.print("fail");
	aa.print("ERROR: " + checkResult.getErrorMessage());
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", "Error getting License App Type " + checkResult.getErrorMessage());
	aa.env.setValue("InterfaceReturnCode", "1");
	aa.env.setValue("InterfaceReturnMessage","Error getting License App Type " + checkResult.getErrorMessage());
}


}
else{

var capId = aa.cap.getCapID(RecordID).getOutput();

var tempArray = new Array();
var temp = new Array();


temp["Date"]=String(SALEDATE);
temp["SalePeriod_Txns"]=String(SALEPERIODTXN);
temp["NetSales"]=String(NETSALE);
temp["Commissions"]=String(COMMISSION);
temp["GrossSales"]=String(GROSSSALES);



tempArray.push(temp);

addASITable("ANS_DATA",tempArray,capId);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Success Adding ASIT's");
	aa.env.setValue("InterfaceReturnCode", "0");
	aa.env.setValue("InterfaceReturnMessage","SUCCESS");
	}
	}
 catch (err) {
        aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", "Update failed");
	aa.env.setValue("InterfaceReturnCode", "1");
	aa.env.setValue("InterfaceReturnMessage","Update failed");
    }