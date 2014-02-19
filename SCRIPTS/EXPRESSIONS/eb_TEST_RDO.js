var servProvCode = expression.getValue("$$servProvCode$$").value;
var variable0 = expression.getValue("ASI::TEST_RDO::CHK4");
var variable1 = expression.getValue("ASI::TEST_RDO::RDO2");

var isYes = ((variable0.value != null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y') || variable0.value.equalsIgnoreCase('CHECKED') || variable0.value.equalsIgnoreCase('SELECTED') || variable0.value.equalsIgnoreCase('TRUE') || variable0.value.equalsIgnoreCase('ON'))));

    variable1.required = isYes;
    variable1.readOnly = !isYes;
    variable1.hidden = !isYes;
    expression.setReturn(variable1);
