var totalRowCount = expression.getTotalRowCount();

var oConservationFund = expression.getValue("ASI::OTHER SALES::Conservation Fund");
var oQtyConservationFund = expression.getValue("ASI::OTHER SALES::Quantity Conservation Fund");

var isYesConservationFund = ((oConservationFund.value != null && (oConservationFund.value.equalsIgnoreCase('YES') || oConservationFund.value.equalsIgnoreCase('Y') || oConservationFund.value.equalsIgnoreCase('CHECKED') || oConservationFund.value.equalsIgnoreCase('SELECTED') || oConservationFund.value.equalsIgnoreCase('TRUE') || oConservationFund.value.equalsIgnoreCase('ON'))));

oQtyConservationFund.required = isYesConservationFund;
//oQtyConservationFund.readOnly = !isYesConservationFund;
oQtyConservationFund.hidden = !isYesConservationFund;
if (!isYesConservationFund) {
    oQtyConservationFund.value = '';
}
else if (isYesConservationFund && oQtyConservationFund.value == '') {
    oQtyConservationFund.value = '1';
}
expression.setReturn(oQtyConservationFund);
////
