var servProvCode = expression.getValue("$$servProvCode$$").value;
var oCHK1 = expression.getValue("ASI::TEST_CHK::CHK1");
var oCHK2 = expression.getValue("ASI::TEST_CHK::CHK2");
var oCHK3 = expression.getValue("ASI::TEST_CHK::CHK3");

var isYescChk1 = ((oCHK1.value != null && (oCHK1.value.equalsIgnoreCase('YES') || oCHK1.value.equalsIgnoreCase('Y') || oCHK1.value.equalsIgnoreCase('CHECKED') || oCHK1.value.equalsIgnoreCase('SELECTED') || oCHK1.value.equalsIgnoreCase('TRUE') || oCHK1.value.equalsIgnoreCase('ON'))));

oCHK2.required = isYescChk1;
oCHK2.readOnly = !isYescChk1;
oCHK2.hidden = !isYescChk1;
if (!isYescChk1) {
    oCHK2.value = false;
}
expression.setReturn(oCHK2);

oCHK3.required = isYescChk1;
oCHK3.readOnly = !isYescChk1;
oCHK3.hidden = !isYescChk1;
if (!isYescChk1) {
    oCHK3.value = false;
}
expression.setReturn(oCHK3);
