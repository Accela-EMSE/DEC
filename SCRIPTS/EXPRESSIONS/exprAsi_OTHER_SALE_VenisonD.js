var totalRowCount = expression.getTotalRowCount();

var oVenison = expression.getValue("ASI::OTHER SALES::Venison Donation");
var oQtyVenison = expression.getValue("ASI::OTHER SALES::Quantity Venison Donation");

var isYesVenison = ((oVenison.value != null && (oVenison.value.equalsIgnoreCase('YES') || oVenison.value.equalsIgnoreCase('Y') || oVenison.value.equalsIgnoreCase('CHECKED') || oVenison.value.equalsIgnoreCase('SELECTED') || oVenison.value.equalsIgnoreCase('TRUE') || oVenison.value.equalsIgnoreCase('ON'))));

oQtyVenison.required = isYesVenison;
//oQtyVenison.readOnly = !isYesVenison;
oQtyVenison.hidden = !isYesVenison;
if (!isYesVenison) {
    oQtyVenison.value = '';
}
else if (isYesVenison && oQtyVenison.value == '') {
    oQtyVenison.value = '1';
}
expression.setReturn(oQtyVenison);
////
