var servProvCode = expression.getValue("$$servProvCode$$").value;

var oLtIncription = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Inscription");
var oLtIncriptionText = expression.getValue("ASI::LIFETIME LICENSES::Inscription");

var isLtIncription = ((oLtIncription.value != null && (oLtIncription.value.equalsIgnoreCase('YES') || oLtIncription.value.equalsIgnoreCase('Y') || oLtIncription.value.equalsIgnoreCase('CHECKED') || oLtIncription.value.equalsIgnoreCase('SELECTED') || oLtIncription.value.equalsIgnoreCase('TRUE') || oLtIncription.value.equalsIgnoreCase('ON'))));

//oLtIncriptionText.readOnly = !isLtIncription;
oLtIncriptionText.hidden = !isLtIncription;
oLtIncriptionText.required = isLtIncription;
if (!isLtIncription) {
    oLtIncriptionText.value = '';
}
expression.setReturn(oLtIncriptionText);
