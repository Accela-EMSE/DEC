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
var variable0=expression.getValue("ASIT::LICENSE INFORMATION::Effective Date");
var variable1=expression.getValue("$$today$$");
var variable2=expression.getValue("ASIT::LICENSE INFORMATION::FORM");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		variable2=expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::FORM");
		variable0=expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Effective Date");
		if(variable0.value!=null && formatDate(variable0.value,'yyyy/MM/dd')>formatDate(variable1.getValue() ,'yyyy/MM/dd')){

			variable0.message="Effective date should not be a future date";
		expression.setReturn(rowIndex,variable0);

			variable2.blockSubmit=true;
		expression.setReturn(rowIndex,variable2);
	}}