var aa = expression.getScriptRoot();

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_EXPRESSIONS"));

function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}

var servProvCode=expression.getValue("$$servProvCode$$").value;
var contactSeqNumber=expression.getValue("REFCONTACT::contactSeqNumber");
var SubmissionDate=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::ACH SWEEPS::Submission Date");
var todayDate=expression.getValue("$$today$$");
var form=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::ACH SWEEPS::FORM");

var peopleModel = getOutput(aa.people.getPeople(contactSeqNumber.value), "");
var oldValueArray = new Array();
if (peopleModel.getTemplate()) {
	var subGroupArray = getTemplateValueByTableArrays(peopleModel.getTemplate());
	oldValueArray = GetSubmissionDateArray(subGroupArray["ACH SWEEPS"]);
}

var totalRowCount = expression.getTotalRowCount()-1;
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){
	SubmissionDate.message="";
	SubmissionDate=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::ACH SWEEPS::Submission Date");
	var doValidation = true;

	if (rowIndex < oldValueArray.length) {
		doValidation = !(SubmissionDate.value == oldValueArray[rowIndex]);
	}

	if (doValidation) {
		if(SubmissionDate.value!=null && formatDate(SubmissionDate.value,'yyyy/MM/dd')<formatDate(todayDate.getValue() ,'yyyy/MM/dd')){
			SubmissionDate.message="Submission Date cannot be in past. Please change the date.";
			form.message="Submission Date cannot be in past. Please change the date.";
			form.blockSubmit=true;
		}
	}
	expression.setReturn(rowIndex,SubmissionDate);
	expression.setReturn(form);
}
