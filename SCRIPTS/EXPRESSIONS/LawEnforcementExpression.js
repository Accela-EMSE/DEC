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
var variable0=expression.getValue("ASI::REVOCATION DETAILS::Enforcement Type");
var variable1=expression.getValue("ASI::REVOCATION DETAILS::Revoke Fishing");
var variable2=expression.getValue("ASI::REVOCATION DETAILS::Revoke Hunting");
var variable3=expression.getValue("ASI::REVOCATION DETAILS::Revoke Trapping");

var totalRowCount = expression.getTotalRowCount();

if(variable0.value!=null && variable0.value.equals(String("Revocation")))
{
                    variable1.hidden=false;
                    expression.setReturn(variable1);
                    variable2.hidden=false;
                    expression.setReturn(variable2);
                     variable3.hidden=false;
                    expression.setReturn(variable3);

}
else
{
                    variable1.hidden=true;
                    expression.setReturn(variable1);
                    variable2.hidden=true;
                    expression.setReturn(variable2);
                     variable3.hidden=true;
                    expression.setReturn(variable3);

}
			
