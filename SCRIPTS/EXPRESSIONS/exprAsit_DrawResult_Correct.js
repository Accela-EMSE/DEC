var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var oWmuToCorrect = expression.getValue("ASIT::DRAW RESULT::WMU To Correct");
var oCorrect = expression.getValue("ASIT::DRAW RESULT::Correct?");
var oPrefCorrect = expression.getValue("ASIT::DRAW RESULT::Preference Points Corrected");

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
    oWmuToCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::WMU To Correct");
    oCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Correct?");
    oPrefCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Preference Points Corrected");
    var isYesCorrect = (oCorrect.value != null && (oCorrect.value.equalsIgnoreCase('YES') || oCorrect.value.equalsIgnoreCase('Y') || oCorrect.value.equalsIgnoreCase('CHECKED') || oCorrect.value.equalsIgnoreCase('SELECTED') || oCorrect.value.equalsIgnoreCase('TRUE') || oCorrect.value.equalsIgnoreCase('ON')));

    oWmuToCorrect.readOnly = !isYesCorrect;
    if (!isYesCorrect) {
        oWmuToCorrect.value = String("");
    }
    expression.setReturn(rowIndex, oWmuToCorrect);


    oPrefCorrect.readOnly = !isYesCorrect;
    if (!isYesCorrect) {
        oPrefCorrect.value = toPrecision("");
    }
    expression.setReturn(rowIndex, oPrefCorrect);
}