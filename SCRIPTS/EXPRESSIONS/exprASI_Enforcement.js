var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("ASI::ENFORCEMENT DETAILS::Enforcement Type");
var variable1=expression.getValue("ASI::ENFORCEMENT DETAILS::Revoke Fishing");
var variable2=expression.getValue("ASI::ENFORCEMENT DETAILS::Revoke Hunting");
var variable3=expression.getValue("ASI::ENFORCEMENT DETAILS::Revoke Trapping");

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
			


