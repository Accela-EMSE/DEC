var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var oPermDisability = expression.getValue("ASI::APPEARANCE::Permanent Disability");
var oPermDisabilityNum = expression.getValue("ASI::APPEARANCE::Permanent Disability Number");


var isyesPermDisability = ((oPermDisability.value != null && (oPermDisability.value.equalsIgnoreCase('YES') || oPermDisability.value.equalsIgnoreCase('Y') || oPermDisability.value.equalsIgnoreCase('CHECKED') || oPermDisability.value.equalsIgnoreCase('SELECTED') || oPermDisability.value.equalsIgnoreCase('TRUE') || oPermDisability.value.equalsIgnoreCase('ON'))))

//oPermDisabilityNum.readOnly = !isyesPermDisability;
oPermDisabilityNum.hidden = !isyesPermDisability;
oPermDisabilityNum.required = isyesPermDisability;
if (!isyesPermDisability) {
    oPermDisabilityNum.value = '';
}
expression.setReturn(oPermDisabilityNum);
