var totalRowCount = expression.getTotalRowCount();

var oTrailPatch = expression.getValue("ASI::OTHER SALES::Trail Supporter Patch");
var oQtyTrailPatch = expression.getValue("ASI::OTHER SALES::Quantity Trail Supporter Patch");

var isYesTrailPatch = ((oTrailPatch.value != null && (oTrailPatch.value.equalsIgnoreCase('YES') || oTrailPatch.value.equalsIgnoreCase('Y') || oTrailPatch.value.equalsIgnoreCase('CHECKED') || oTrailPatch.value.equalsIgnoreCase('SELECTED') || oTrailPatch.value.equalsIgnoreCase('TRUE') || oTrailPatch.value.equalsIgnoreCase('ON'))));

oQtyTrailPatch.required = isYesTrailPatch;
//oQtyTrailPatch.readOnly = !isYesTrailPatch;
oQtyTrailPatch.hidden = !isYesTrailPatch;
if (!isYesTrailPatch) {
    oQtyTrailPatch.value = '';
}
else if (isYesTrailPatch && oQtyTrailPatch.value == '') {
    oQtyTrailPatch.value = '1';
}

expression.setReturn(oQtyTrailPatch);
////