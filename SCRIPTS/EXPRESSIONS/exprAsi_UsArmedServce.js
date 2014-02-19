var servProvCode = expression.getValue("$$servProvCode$$").value;
var oUsArmed = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Full-time U.S. Armed Service");
var oUsArmedServceType = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Full-time U.S. Armed Service Type");

var isUsArmed = ((oUsArmed.value != null && (oUsArmed.value.equalsIgnoreCase('YES') || oUsArmed.value.equalsIgnoreCase('Y') || oUsArmed.value.equalsIgnoreCase('CHECKED') || oUsArmed.value.equalsIgnoreCase('SELECTED') || oUsArmed.value.equalsIgnoreCase('TRUE') || oUsArmed.value.equalsIgnoreCase('ON'))));

oUsArmedServceType.required = isUsArmed;
oUsArmedServceType.hidden = !isUsArmed;
//oUsArmedServceType.readOnly = !isUsArmed;
if (!isUsArmed) {
    oUsArmedServceType.value = null;
}
expression.setReturn(oUsArmedServceType);
