var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var vApplyLO1 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice1");
var vApplyLO2 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice2");

var isYesApplyLO1 = ((vApplyLO1.value != null && (vApplyLO1.value.equalsIgnoreCase('YES') || vApplyLO1.value.equalsIgnoreCase('Y') || vApplyLO1.value.equalsIgnoreCase('CHECKED') || vApplyLO1.value.equalsIgnoreCase('SELECTED') || vApplyLO1.value.equalsIgnoreCase('TRUE') || vApplyLO1.value.equalsIgnoreCase('ON'))))
var isYesApplyLO2 = ((vApplyLO2.value != null && (vApplyLO2.value.equalsIgnoreCase('YES') || vApplyLO2.value.equalsIgnoreCase('Y') || vApplyLO2.value.equalsIgnoreCase('CHECKED') || vApplyLO2.value.equalsIgnoreCase('SELECTED') || vApplyLO2.value.equalsIgnoreCase('TRUE') || vApplyLO2.value.equalsIgnoreCase('ON'))))
var msg = '';
if (isYesApplyLO1 && isYesApplyLO2) {
    msg = "Landownership can only be applied to one WMU per license year.";
}
vApplyLO1.message = msg;
expression.setReturn(vApplyLO1);

vApplyLO2.message = msg;
expression.setReturn(vApplyLO2);
