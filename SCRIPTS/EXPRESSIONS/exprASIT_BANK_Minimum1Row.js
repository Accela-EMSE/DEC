var variable0 = expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::FORM")
var rowIndex = expression.getTotalRowCount();
var minRows = 1;

var variable1 = expression.getValue("REFCONTACTTPLFORM::ASI_AGENT::BUSINESS INFO::Corporate Store?");
if ((variable1.value == null || variable1.value.equals('') || (variable1.value.equalsIgnoreCase('NO') || variable1.value.equalsIgnoreCase('N') || variable1.value.equalsIgnoreCase('UNCHECKED') || variable1.value.equalsIgnoreCase('UNSELECTED') || variable1.value.equalsIgnoreCase('FALSE') || variable1.value.equalsIgnoreCase('OFF')))) {
    if (rowIndex <= minRows) {
        variable0.blockSubmit = true;
        expression.setReturn(variable0);
        variable0.message = "You must enter at least " + minRows + " row(s) on this table";
        expression.setReturn(variable0);
    }
}
