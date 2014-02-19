var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("REFCONTACT::contactTypeFlag");
var variable1=expression.getValue("REFCONTACT::contactType");
var variable2= expression.getValue("REFCONTACT::firstName");
var variable3= expression.getValue("REFCONTACT::lastName");
var variable4 = expression.getValue("REFCONTACT::businessName");


if(variable1.value != null && (variable1.value.equals('DEC Agent') || variable1.value.equals('Individual') || variable1.value.equals('Corporation')))
{
    if(variable0.value != null && variable0.value.equals('individual'))
    {
         variable2.required = true;
        expression.setReturn(variable2);        
        variable3.required = true;
        expression.setReturn(variable3);       
          variable4.required = false;
        expression.setReturn(variable4);        

    }
    else if(variable0.value != null && variable0.value.equals('organization'))
    {
         variable2.required = false;
        expression.setReturn(variable2);        
        variable3.required = false;
        expression.setReturn(variable3);       
        variable4.required = true;
        expression.setReturn(variable4);        
    }
}