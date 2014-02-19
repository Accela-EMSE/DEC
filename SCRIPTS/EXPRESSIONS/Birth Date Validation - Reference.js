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
var variable0=expression.getValue("REFCONTACT::birthDate");
var oToday = expression.getValue("$$today$$");

var totalRowCount = expression.getTotalRowCount();
var msg = "";
dd =  diffDate(oToday.getValue(), variable0.getValue());
if (dd > 0)	msg =  "Birth Date cannot be in the future";
if (dd < -36524) msg =  "Birth Date cannot be more than 100 years into the past" ;
variable0.message = msg;
if (msg != "") variable0.value = ""
expression.setReturn(variable0);