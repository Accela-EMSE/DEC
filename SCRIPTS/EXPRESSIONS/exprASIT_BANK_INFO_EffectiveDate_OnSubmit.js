var toPrecision=function(value){
	var multiplier=10000;
	return Math.round(value*multiplier)/multiplier;
}
function addDate(iDate, nDays){ 
	if(isNaN(nDays)){
		throw("Day is a invalid number!");
	}
	return expression.addDate(iDate,parseInt(nDays));
}

function diffDate(iDate1,iDate2){
	return expression.diffDate(iDate1,iDate2);
}

function parseDate(dateString){
	return expression.parseDate(dateString);
}

function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}

var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Modified Flag");
var variable1=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Effective Date");
var form=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::FORM");
var variable2=expression.getValue("$$today$$");
form.blockSubmit=false;

var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

	variable1=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Effective Date");
	variable0=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Modified Flag");
	variable1.message="";
	if(variable0.value!=null && variable0.value*1==toPrecision(1) && variable1.value!=null && formatDate(variable1.value,'yyyy/MM/dd')<formatDate(variable2.getValue() ,'yyyy/MM/dd')){
		variable1.message="Effective Date cannot be in past. Please change the date.";
		form.blockSubmit=true;
	}
	expression.setReturn(rowIndex,variable1);
	expression.setReturn(form);
}
