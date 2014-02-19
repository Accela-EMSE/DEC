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
var variable0=expression.getValue("REFCONTACT::contactType");
var variable1=expression.getValue("REFCONTACT::gender");
var variable2=expression.getValue("REFCONTACTTPLFORM::CNT_MASTER::ADDITIONAL INFO::Preference Points");
var variable3=expression.getValue("REFCONTACT::birthDate");

variable1.required=false;	
variable2.required=false;
variable3.required=false;
		

var totalRowCount = expression.getTotalRowCount();

		if(variable0.value!=null && variable0.value.equals(String("Individual"))){

			variable1.required=true;


			variable2.required=true;
		
			variable3.required=true;
	

			//variable2.message=variable0.getValue() ;
		
	}else{ 
		variable1.required=false;
		
		variable2.required=false;
		
		variable3.required=false;
		
	}

expression.setReturn(variable1);
expression.setReturn(variable2);
expression.setReturn(variable3);
