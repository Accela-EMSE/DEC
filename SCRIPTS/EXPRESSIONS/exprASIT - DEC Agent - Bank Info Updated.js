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
var variable0=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Bank Name");
var variable1=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Bank Info Changed?");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		variable1=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Bank Info Changed?");
		variable0=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Bank Name");
		if(variable0.value!=null && !variable0.value.equals(String(""))){
			if (variable1.value=null || variable1.value.equals(String(""))){ 
				variable1.value="Y";
			}
		expression.setReturn(rowIndex,variable1);
	}}