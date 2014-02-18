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
var systemUserObj = aa.person.getUser("INTERFACEUSER").getOutput();        // Current User Object
var dateOfKill = aa.env.getValue("dateOfKill");
var countyOfKill= aa.env.getValue("countyOfKill");
var town= aa.env.getValue("town");
var wmu = aa.env.getValue("wmu");
var bearSeason= aa.env.getValue("bearSeason");
var bearTakenWith = aa.env.getValue("bearTakenWith");
var age= aa.env.getValue("age");
var sex = aa.env.getValue("sex");
var ivrConfirmationNumber= aa.env.getValue("ivrConfirmationNumber");
var countyExam = aa.env.getValue("countyExam");
var addrExam = aa.env.getValue("addrExam");
var contactPhone = aa.env.getValue("contactPhone");
var deerSeason = aa.env.getValue("deerSeason");
var deerTakenWith = aa.env.getValue("deerTakenWith");
var leftAntlerPoint = aa.env.getValue("leftAntlerPoint");
var rightAntlerPoint = aa.env.getValue("rightAntlerPoint");
var isDMPTag= aa.env.getValue("isDMPTag");
var customerID = aa.env.getValue("customerID");
var weight = aa.env.getValue("weight");
var spurLength = aa.env.getValue("spurLength");
var beardLength= aa.env.getValue("beardLength");
var legSaved= aa.env.getValue("legSaved");
var numberOfDays = aa.env.getValue("numberOfDays");
var capId = aa.cap.getCapID(aa.env.getValue("CarcassTagID").toString()).getOutput();
aa.print(capId);
var capID = aa.cap.getCap(capId).getOutput();
aa.print(capID.getCapType());
capAppType = capID.getCapType().toString();
var capArr = capAppType.split("/");
aa.print(capArr[3]);
var animalType = capArr[3];

if(animalType.equals("Bear")){
aa.print("match bear");
aa.print("Editing the Date of Kill : ");
aa.print(dateOfKill);
editAppSpecific("Date of Kill",dateOfKill, capId);
aa.print("Editing the County of Kill : ");
aa.print(countyOfKill);
editAppSpecific("County of Kill", countyOfKill, capId);
aa.print("Editing Town : ");
aa.print(town);
editAppSpecific("Town",town, capId);
aa.print("Editing WMU : ");
aa.print(wmu);
editAppSpecific("WMU", wmu, capId);
aa.print("Editing Bear Season : ");
aa.print(bearSeason);
editAppSpecific("Bear Season", bearSeason, capId);
aa.print("Editing Bear taken with :");
aa.print(bearTakenWith);
editAppSpecific("Bear Taken With", bearTakenWith, capId);
aa.print("Editing Age : ");
aa.print(age);
editAppSpecific("Age", age, capId);
aa.print("Editing the Sex : ");
aa.print(sex);
editAppSpecific("Sex", sex, capId);
aa.print("Editing Source : ");
aa.print("IVR");
editAppSpecific("Source", "IVR", capId);
aa.print("IVR Confirmation Number : ");
aa.print(ivrConfirmationNumber);
editAppSpecific("IVR Confirmation Number", ivrConfirmationNumber, capId);
aa.print("Editing County for Examination of Bear");
aa.print(countyExam);
editAppSpecific("County for Examination of Bear", countyExam, capId);
aa.print("Editing the Address for Examination of Bear");
aa.print(addrExam);
editAppSpecific("Address for Examination",addrExam, capId);
aa.print("Editing Contact Phone ");
aa.print(contactPhone);
var editResult=editAppSpecific("Contact Phone #", contactPhone, capId);
aa.print(editResult);
var workflowtaskupdateResult=updateWorkFlowTask(capId);
if(workflowtaskupdateResult)
{
   aa.env.setValue("ScriptReturnCode", "0");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Success");
}
else
{
    aa.env.setValue("ScriptReturnCode", "1");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Failed");
}
}
else if(animalType.equals("DMP Deer") || animalType.equals("Deer") || animalType.equals("Either Sex") || animalType.equals("Antlerless")){
aa.print("match deer");
editAppSpecific("Date of Kill", dateOfKill, capId);
editAppSpecific("County of Kill",countyOfKill, capId);
editAppSpecific("Town", town, capId);
editAppSpecific("WMU", wmu, capId);
editAppSpecific("Deer Season",deerSeason, capId);
editAppSpecific("Deer Taken With", deerTakenWith, capId);
editAppSpecific("Sex", sex, capId);
editAppSpecific("Left Antler Points",leftAntlerPoint, capId);
editAppSpecific("Right Antler Points",rightAntlerPoint, capId);
editAppSpecific("Source", "IVR", capId);
editAppSpecific("IVR Confirmation Number", ivrConfirmationNumber, capId);
editAppSpecific("Is consigned DMP tag?", isDMPTag, capId);
if(isDMPTag.equals("Y"))
{
  editAppSpecific("Consignee DEC Customer ID",customerID, capId);
}
var workflowtaskupdateResult=updateWorkFlowTask(capId);
if(workflowtaskupdateResult)
{
   aa.env.setValue("ScriptReturnCode", "0");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Success");
}
else
{
    aa.env.setValue("ScriptReturnCode", "1");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Failed");
}
}
else if(animalType.equals("Fall Turkey")){
aa.print("match Fall Turkey");
editAppSpecific("Date of Kill", dateOfKill, capId);
editAppSpecific("County of Kill",countyOfKill, capId);
editAppSpecific("Town", town, capId);
editAppSpecific("WMU", wmu, capId);
// editAppSpecific("Weight (to the nearest pound)", weight, capId);
// editAppSpecific("Turkey Spur Length", spurLength, capId);
// editAppSpecific("Turkey Beard Length", beardLength, capId);
editAppSpecific("Turkey Leg Saved?",legSaved, capId);
editAppSpecific("Source", "IVR", capId);
editAppSpecific("IVR Confirmation Number",ivrConfirmationNumber, capId);
editAppSpecific("Number of days hunted to kill this turkey", numberOfDays, capId);
var workflowtaskupdateResult=updateWorkFlowTask(capId);
if(workflowtaskupdateResult)
{
   aa.env.setValue("ScriptReturnCode", "0");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Success");
}
else
{
    aa.env.setValue("ScriptReturnCode", "1");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Failed");
}
}
else if(animalType.equals("Spring Turkey")){
aa.print("match Spring Turkey");
editAppSpecific("Date of Kill", dateOfKill, capId);
editAppSpecific("County of Kill",countyOfKill, capId);
editAppSpecific("Town", town, capId);
editAppSpecific("WMU", wmu, capId);
editAppSpecific("Sex", sex, capId);
editAppSpecific("Weight (to the nearest pound)", weight, capId);
editAppSpecific("Turkey Spur Length", spurLength, capId);
editAppSpecific("Turkey Beard Length", beardLength, capId);
// editAppSpecific("Turkey Leg Saved?",legSaved, capId);
editAppSpecific("Source", "IVR", capId);
editAppSpecific("IVR Confirmation Number",ivrConfirmationNumber, capId);
editAppSpecific("Number of days hunted to kill this turkey", numberOfDays, capId);
var workflowtaskupdateResult=updateWorkFlowTask(capId);
if(workflowtaskupdateResult)
{
   aa.env.setValue("ScriptReturnCode", "0");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Success");
}
else
{
    aa.env.setValue("ScriptReturnCode", "1");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Failed");
}
}
else {
aa.env.setValue("ScriptReturnCode", "1");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Failed");
}

}
catch(err){
aa.env.setValue("ScriptReturnCode", "1");
   aa.env.setValue("ScriptReturnMessage", "Update Harvest Information Failed");
}


function updateWorkFlowTask(tempcapID)
{
 aa.print("Updating Work FLow");
 var workflowResult = aa.workflow.getTasks(tempcapID);
 var tastUpdateResult = false;
 if (workflowResult.getSuccess()) {
		 aa.print("1");
         var workflowResult = aa.workflow.getTasks(capId);
         if (workflowResult.getSuccess()) {
					aa.print("2");
                    var wfObj = workflowResult.getOutput();
					aa.print("3");
//                    for (i in wfObj) {
//                            var fTask = wfObj[i];                                       
//                             if(fTask.getTaskDescription().equals("Report Game Harvest") && fTask.getActiveFlag().equals("Y"))
//                              {                              
//								aa.print("4");
//                                aa.print("Cap ID =" +capId +" Task Name = " +fTask.getTaskDescription() + " and Status = " +fTask.getActiveFlag());
//                                aa.print("Match Found.");                                                                                                                                                                                                           
//                                 //closeTask(fTask.getTaskDescription(),"Reported","GH Reported","");                                                                                                  
//								 updateTagStatus("Reported", "Reported", capId);
//								 closeTaskForRec("Report Game Harvest", "Reported", "", "", "", capId);
//							     closeTaskForRec("Void Document", "", "", "", "", capId);
//								 closeTaskForRec("Revocation", "", "", "", "", capId);
//								 closeTaskForRec("Suspension", "", "", "", "", capId);
//                                 var status = taskStatus("Report Game Harvest");
//                                 aa.print("Status"+status);
//                                tastUpdateResult=true;
//                                break;
//                                 }
//                           }
								updateTagStatus("Reported", "Reported", capId);
								closeTaskForRec("Report Game Harvest", "Reported", "", "", "", capId);
							    closeTaskForRec("Void Document", "", "", "", "", capId);
								closeTaskForRec("Revocation", "", "", "", "", capId);
								closeTaskForRec("Suspension", "", "", "", "", capId);
                                var status = taskStatus("Report Game Harvest");
                                aa.print("Status"+status);
                                tastUpdateResult=true;
             return tastUpdateResult; 
          } else 
          {

                  return tastUpdateResult;
          }
   }
}