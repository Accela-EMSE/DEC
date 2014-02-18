var SCRIPT_VERSION = 2.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));
function getScriptText(vScriptName){
vScriptName = vScriptName.toUpperCase();
var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
return emseScript.getScriptText() + "";
}
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
			logDebug("Contact successfully added to CAP.");
			var capContactResult = aa.people.getCapContactByCapID(capId);
			if (capContactResult.getSuccess())
			{
				aa.print("Reference Contact connected to License Record");
				var Contacts = capContactResult.getOutput();
				var idx = Contacts.length;
				var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
				aa.env.setValue("ContactNbr",contactNbr);
				aa.print("Contact Number = " +contactNbr);
				aa.print("CAPID = " +capId);
				aa.env.setValue("ScriptReturnCode", "0");
				aa.env.setValue("ScriptReturnMessage", "Success adding ref contact to capId");
				aa.env.setValue("InterfaceReturnCode", "0");
				aa.env.setValue("InterfaceReturnMessage",capId);
			}
			else
			{
			aa.print("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			aa.env.setValue("ScriptReturnCode", "1");
			aa.env.setValue("ScriptReturnMessage", "Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			aa.env.setValue("InterfaceReturnCode", "1");
			aa.env.setValue("InterfaceReturnMessage","Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			}
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
			logDebug("Contact successfully added to CAP.");
			var capContactResult = aa.people.getCapContactByCapID(capId);
			if (capContactResult.getSuccess())
			{
				aa.print("Reference Contact connected to License Record");
				var Contacts = capContactResult.getOutput();
				var idx = Contacts.length;
				var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
				aa.env.setValue("ContactNbr",contactNbr);
				aa.print("Contact Number = " +contactNbr);
				aa.env.setValue("InterfaceReturnCode", "0");
				aa.env.setValue("InterfaceReturnMessage",capId);
			}
			else
			{
			aa.print("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			aa.env.setValue("ScriptReturnCode", "1");
			aa.env.setValue("ScriptReturnMessage", "Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			aa.env.setValue("InterfaceReturnCode", "1");
			aa.env.setValue("InterfaceReturnMessage","Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			}
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