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
var variable0=expression.getValue("ASIT::DRAW RESULT::DRAW TYPE");
var variable1=expression.getValue("ASIT::DRAW RESULT::Corrected");
var variable2=expression.getValue("ASIT::DRAW RESULT::Result");
var variable3=expression.getValue("ASIT::DRAW RESULT::New?");
var variable4=expression.getValue("ASIT::DRAW RESULT::WMU To Correct");
var variable5=expression.getValue("ASIT::DRAW RESULT::Correct?");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		variable4=expression.getValue(rowIndex, "ASIT::DRAW RESULT::WMU To Correct");
		variable1=expression.getValue(rowIndex, "ASIT::DRAW RESULT::Corrected");
		variable5=expression.getValue(rowIndex, "ASIT::DRAW RESULT::Correct?");
		variable0=expression.getValue(rowIndex, "ASIT::DRAW RESULT::DRAW TYPE");
		variable3=expression.getValue(rowIndex, "ASIT::DRAW RESULT::New?");
		variable2=expression.getValue(rowIndex, "ASIT::DRAW RESULT::Result");
		if(variable0.value!=null && variable0.value.equals(String("CORRECTION")) && (variable1.value==null || variable1.value.equals('') || (variable1.value.equalsIgnoreCase('NO') || variable1.value.equalsIgnoreCase('N') || variable1.value.equalsIgnoreCase('UNCHECKED') || variable1.value.equalsIgnoreCase('UNSELECTED') || variable1.value.equalsIgnoreCase('FALSE') || variable1.value.equalsIgnoreCase('OFF'))) && variable2.value!=null && variable2.value.equals(String(""))){

			variable3.message="Please check 'New' to create tag for this correction.";
		expression.setReturn(rowIndex,variable3);

			variable0.message="Please check 'New' to create tag for this correction.";
		expression.setReturn(rowIndex,variable0);

			variable4.readOnly=true;
		expression.setReturn(rowIndex,variable4);

			variable5.readOnly=true;
		expression.setReturn(rowIndex,variable5);

			variable1.readOnly=true;
		expression.setReturn(rowIndex,variable1);
	}else{ 
		variable4.readOnly=false;
		expression.setReturn(rowIndex,variable4);
		variable5.readOnly=false;
		expression.setReturn(rowIndex,variable5);
		variable1.readOnly=false;
		expression.setReturn(rowIndex,variable1);
	}
}