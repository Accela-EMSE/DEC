var SCRIPT_VERSION = 2.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_ACCELA_CONTACT_ASI"));

function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";	
}
try{
	//aa.env.setValue("AGENTREFNUM","879146");
	var agentRefNum= aa.env.getValue("AGENTREFNUM");
	var peop = aa.people.getPeople(agentRefNum).getOutput();
	var agentID = getTemplateValueByForm(peop.getTemplate(), "INTERNAL PROCESSING", "Agent Id");
	var agentSeqID = getTemplateValueByForm(peop.getTemplate(), "INTERNAL PROCESSING", "Agent ANS Seq");
	aa.print("agentSeqID = " +agentSeqID);
//	if(agentSeqID.equals("") || agentSeqID == null){
//		aa.print("agentSeqID is null. Taking defautl value as 0 " +agentSeqID);
//		agentSeqID = "0";
//	}
	
	try{
		var agentSeqID = aa.util.add(agentSeqID,"1");
	} catch(err){
		aa.print("agentSeqID is null or not numeric. Taking default value as 0 " +agentSeqID);
		agentSeqID = "0";
		var agentSeqID = aa.util.add(agentSeqID,"1");
	}
	setTemplateValueByForm(peop.getTemplate(), "INTERNAL PROCESSING", "Agent ANS Seq",agentSeqID);
	aa.people.editPeople(peop);
	aa.env.setValue("InterfaceReturnCode","0");
	aa.env.setValue("InterfaceReturnMessage",agentID+"-"+agentSeqID); 
	}
catch(err){
aa.env.setValue("InterfaceReturnCode","1");
aa.env.setValue("InterfaceReturnMessage","Error in Updating Sequence Number"); 
}