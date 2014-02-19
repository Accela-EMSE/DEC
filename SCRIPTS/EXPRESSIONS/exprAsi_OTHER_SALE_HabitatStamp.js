var totalRowCount = expression.getTotalRowCount();

var oHabitat = expression.getValue("ASI::OTHER SALES::Habitat/Access Stamp");
var oQtyHabitat = expression.getValue("ASI::OTHER SALES::Quantity Habitat/Access Stamp");

var isYesHabitat = ((oHabitat.value != null && (oHabitat.value.equalsIgnoreCase('YES') || oHabitat.value.equalsIgnoreCase('Y') || oHabitat.value.equalsIgnoreCase('CHECKED') || oHabitat.value.equalsIgnoreCase('SELECTED') || oHabitat.value.equalsIgnoreCase('TRUE') || oHabitat.value.equalsIgnoreCase('ON'))));

oQtyHabitat.required = isYesHabitat;
//oQtyHabitat.readOnly = !isYesHabitat;
oQtyHabitat.hidden = !isYesHabitat;
if (!isYesHabitat) {
    oQtyHabitat.value = '';
}
else if (isYesHabitat && oQtyHabitat.value == '') {
    oQtyHabitat.value = '1';
}
expression.setReturn(oQtyHabitat);
////