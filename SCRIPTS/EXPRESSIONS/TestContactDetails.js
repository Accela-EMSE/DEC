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
var variable1=expression.getValue("REFCONTACT::businessName");
var variable2=expression.getValue("REFCONTACT::firstName");
var variable3=expression.getValue("REFCONTACT::middleName");
var variable4=expression.getValue("REFCONTACT::lastName");
var variableArray=new Array();

var totalRowCount = expression.getTotalRowCount();

if(variable0.value!=null && variable0.value.equals(String("Individual"))){
                                                                 variable1.hidden=true;
                                                                 variable2.hidden=false;
                                                                 variable3.hidden=false;
                                                                 variable4.hidden=false;     
		                      expression.setReturn(variable1);
                                                                expression.setReturn(variable2);
                                                                expression.setReturn(variable3);
                                                                expression.setReturn(variable4); 
	                     }
                                          else if (variable0.value!=null && variable0.value.equals(String("Organization"))) {
                                                             variable2.hidden=true;
                                                             variable3.hidden=true;
                                                             variable4.hidden=true;     
                                                             variable1.hidden=false;
                                                            expression.setReturn(variable1);
                                                            expression.setReturn(variable2);
                                                            expression.setReturn(variable3);
                                                            expression.setReturn(variable4);
                                           }
                                           else
                                            {
                                                         variable1.hidden=false;
                                                         variable2.hidden=false;
                                                          variable3.hidden=false;
                                                          variable4.hidden=false;
                                                          expression.setReturn(variable1);
                                                          expression.setReturn(variable2);
                                                          expression.setReturn(variable3);
                                                          expression.setReturn(variable4);
                                             }

