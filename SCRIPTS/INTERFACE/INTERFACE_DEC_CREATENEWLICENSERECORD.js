var SCRIPT_VERSION = 2.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
//eval(getScriptText("INCLUDES_CUSTOM"));
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


var checkResult = aa.cap.checkAppTypeStatus(V_GROUP,V_TYPE,V_SUBTYPE,V_CATEGORY);
if(checkResult.getSuccess())
{
    if("A" == checkResult.getOutput())
    {
         var capIDModel = aa.cap.createApp(V_GROUP,V_TYPE,V_SUBTYPE,V_CATEGORY,V_DESC); //create application that record type is active only. 
         aa.print("Create a record with record type active successfully! "+ capIDModel.getOutput());

         var getCapResult = aa.cap.getCapID(capIDModel.getOutput());
         aa.print(getCapResult.getOutput());
         var capId = getCapResult.getOutput();

         var status = "Active";
         var comment = "New License for Agent ACH SET STATUS";
         updateAppStatus(status, comment, capId);
    }
    else
    {
         var capIDModel = aa.cap.createAppRegardlessAppTypeStatus(V_GROUP,V_TYPE,V_SUBTYPE,V_CATEGORY,V_DESC);  //create application record regardless of record type status. 
         aa.print("Create a record with record type inactive successfully! "+ capIDModel.getOutput());
    }

    
}
else
{
  aa.print("fail");
  aa.print("ERROR: " + checkResult.getErrorMessage()); 
}