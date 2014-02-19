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
var variable0=expression.getValue("REFCONTACTTPLFORM::ASI_AGENT::BUSINESS INFO::Corporate Store?");
var variable1=expression.getValue("REFCONTACTTPLFORM::ASI_AGENT::FINANCIAL INFO::Sweep Delay");
var variable2=expression.getValue("REFCONTACTTPLFORM::ASI_AGENT::FINANCIAL INFO::Sales Period Length");
var variable3=expression.getValue("REFCONTACTTPLFORM::ASI_AGENT::FINANCIAL INFO::Close of Sales Period"); 


var totalRowCount = expression.getTotalRowCount();
variable1.required=true;
variable2.required=true;
variable3.required=true;

if((variable0.value!=null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y') || variable0.value.equalsIgnoreCase('CHECKED') || variable0.value.equalsIgnoreCase('SELECTED') || variable0.value.equalsIgnoreCase('TRUE') || variable0.value.equalsIgnoreCase('ON'))) || (variable0.value!=null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y') || variable0.value.equalsIgnoreCase('CHECKED') || variable0.value.equalsIgnoreCase('SELECTED') || variable0.value.equalsIgnoreCase('TRUE') || variable0.value.equalsIgnoreCase('ON')))){

		variable1.required=false;
		variable2.required=false;
		variable3.required=false;
	
	}
else {
		variable1.required=true;
		variable2.required=true;
		variable3.required=true;
		
}
expression.setReturn(variable1);
expression.setReturn(variable2);
expression.setReturn(variable3);

