var servProvCode = expression.getValue("$$servProvCode$$").value;
var variable0 = expression.getValue("ASI::TEST_DD::RDO");
var variable1 = expression.getValue("ASI::TEST_DD::DD1");
var variable2 = expression.getValue("ASI::TEST_DD::DD2");


var totalRowCount = expression.getTotalRowCount();

var isYes = ((variable0.value != null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y') || variable0.value.equalsIgnoreCase('CHECKED') || variable0.value.equalsIgnoreCase('SELECTED') || variable0.value.equalsIgnoreCase('TRUE') || variable0.value.equalsIgnoreCase('ON'))));

    variable1.required = isYes;
    variable1.readOnly = !isYes;
    variable1.hidden = !isYes;
    if (!isYes) {
        variable1.value = '';
    }
    expression.setReturn(variable1);

    variable2.required = isYes;
    variable2.readOnly = !isYes;
    variable2.hidden = !isYes;
    if (!isYes) {
        variable2.value = '';
    } expression.setReturn(variable2);
