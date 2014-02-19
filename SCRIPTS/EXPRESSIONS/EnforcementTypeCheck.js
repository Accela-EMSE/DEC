var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("ASI::ENFORCEMENT DETAILS::Revoke Fishing");
var variable1=expression.getValue("ASI::ENFORCEMENT DETAILS::Revoke Hunting");
var variable2=expression.getValue("ASI::ENFORCEMENT DETAILS::Revoke Trapping");
var variable3=expression.getValue("ASI::ENFORCEMENT DETAILS::Enforcement Type");

var thisForm = expression.getValue("ASI::FORM");
var msg = " ";

var totalRowCount = expression.getTotalRowCount();

if(variable0.value!=null && variable0.value.equalsIgnoreCase(String("Revocation"))){
       msg = "Please select one of the 3 options.";
    thisForm.blockSubmit=false;
}

 variable0.message = msg;
       expression.setReturn(variable0);
        expression.setReturn(thisForm);


