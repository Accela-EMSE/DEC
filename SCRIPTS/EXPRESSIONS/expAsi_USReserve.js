var servProvCode = expression.getValue("$$servProvCode$$").value;
var oUSReserve = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::U.S. Reserve Member");
var oUSReserveServiceType = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::U.S. Reserve Member Type");

var isUSReserve = ((oUSReserve.value != null && (oUSReserve.value.equalsIgnoreCase('YES') || oUSReserve.value.equalsIgnoreCase('Y') || oUSReserve.value.equalsIgnoreCase('CHECKED') || oUSReserve.value.equalsIgnoreCase('SELECTED') || oUSReserve.value.equalsIgnoreCase('TRUE') || oUSReserve.value.equalsIgnoreCase('ON'))));

oUSReserveServiceType.required = isUSReserve;
oUSReserveServiceType.hidden = !isUSReserve;
//oUSReserveServiceType.readOnly = !isUSReserve;
if (!isUSReserve) {
    oUSReserveServiceType.value = null;
}
expression.setReturn(oUSReserveServiceType);
