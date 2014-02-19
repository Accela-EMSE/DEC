var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var aOth1 = expression.getValue("ASI::OTHER SALES::Habitat/Access Stamp");
var isYesaOth1 = ((aOth1.value != null && (aOth1.value.equalsIgnoreCase('YES') || aOth1.value.equalsIgnoreCase('Y') || aOth1.value.equalsIgnoreCase('CHECKED') || aOth1.value.equalsIgnoreCase('SELECTED') || aOth1.value.equalsIgnoreCase('TRUE') || aOth1.value.equalsIgnoreCase('ON'))));
var aOth2 = expression.getValue("ASI::OTHER SALES::Venison Donation");
var isYesaOth2 = ((aOth2.value != null && (aOth2.value.equalsIgnoreCase('YES') || aOth2.value.equalsIgnoreCase('Y') || aOth2.value.equalsIgnoreCase('CHECKED') || aOth2.value.equalsIgnoreCase('SELECTED') || aOth2.value.equalsIgnoreCase('TRUE') || aOth2.value.equalsIgnoreCase('ON'))));
var aOth3 = expression.getValue("ASI::OTHER SALES::Conservation Fund");
var isYesaOth3 = ((aOth3.value != null && (aOth3.value.equalsIgnoreCase('YES') || aOth3.value.equalsIgnoreCase('Y') || aOth3.value.equalsIgnoreCase('CHECKED') || aOth3.value.equalsIgnoreCase('SELECTED') || aOth3.value.equalsIgnoreCase('TRUE') || aOth3.value.equalsIgnoreCase('ON'))));
var aOth4 = expression.getValue("ASI::OTHER SALES::Trail Supporter Patch");
var isYesaOth4 = ((aOth4.value != null && (aOth4.value.equalsIgnoreCase('YES') || aOth4.value.equalsIgnoreCase('Y') || aOth4.value.equalsIgnoreCase('CHECKED') || aOth4.value.equalsIgnoreCase('SELECTED') || aOth4.value.equalsIgnoreCase('TRUE') || aOth4.value.equalsIgnoreCase('ON'))));
var aOth5 = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
var isYesaOth5 = ((aOth5.value != null && (aOth5.value.equalsIgnoreCase('YES') || aOth5.value.equalsIgnoreCase('Y') || aOth5.value.equalsIgnoreCase('CHECKED') || aOth5.value.equalsIgnoreCase('SELECTED') || aOth5.value.equalsIgnoreCase('TRUE') || aOth5.value.equalsIgnoreCase('ON'))));
var aOth6 = expression.getValue("ASI::OTHER SALES::Conservation Patron");
var isYesaOth6 = ((aOth6.value != null && (aOth6.value.equalsIgnoreCase('YES') || aOth6.value.equalsIgnoreCase('Y') || aOth6.value.equalsIgnoreCase('CHECKED') || aOth6.value.equalsIgnoreCase('SELECTED') || aOth6.value.equalsIgnoreCase('TRUE') || aOth6.value.equalsIgnoreCase('ON'))));
var aOth7 = expression.getValue("ASI::OTHER SALES::Lifetime Card Replace");
var isYesaOth7 = ((aOth7.value != null && (aOth7.value.equalsIgnoreCase('YES') || aOth7.value.equalsIgnoreCase('Y') || aOth7.value.equalsIgnoreCase('CHECKED') || aOth7.value.equalsIgnoreCase('SELECTED') || aOth7.value.equalsIgnoreCase('TRUE') || aOth7.value.equalsIgnoreCase('ON'))));
var aOth8 = expression.getValue("ASI::OTHER SALES::Sportsman Ed Certification");
var isYesaOth8 = ((aOth8.value != null && (aOth8.value.equalsIgnoreCase('YES') || aOth8.value.equalsIgnoreCase('Y') || aOth8.value.equalsIgnoreCase('CHECKED') || aOth8.value.equalsIgnoreCase('SELECTED') || aOth8.value.equalsIgnoreCase('TRUE') || aOth8.value.equalsIgnoreCase('ON'))));

var isSelected = (isYesaOth1 || isYesaOth2 || isYesaOth3 || isYesaOth4 || isYesaOth5 || isYesaOth6 || isYesaOth7 || isYesaOth8);

var asiFormO = expression.getValue("ASI::FORM");
if (!isSelected) {
    asiFormO.message = "Please select sales item.";
    expression.setReturn(asiFormO);
}
asiFormO.blockSubmit = !isSelected;
expression.setReturn(asiFormO);
