var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var oWmuToCorrect = expression.getValue("ASIT::DRAW RESULT::WMU To Correct");
var oCorrect = expression.getValue("ASIT::DRAW RESULT::Correct?");
var oPrefCorrect = expression.getValue("ASIT::DRAW RESULT::Preference Points Corrected");
var oCorrected = expression.getValue("ASIT::DRAW RESULT::Corrected");

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
    oWmuToCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::WMU To Correct");
    oCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Correct?");
    oPrefCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Preference Points Corrected");
    oCorrected = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Corrected");

    var isYesCorrect = (oCorrect.value != null && (oCorrect.value.equalsIgnoreCase('YES') || oCorrect.value.equalsIgnoreCase('Y') || oCorrect.value.equalsIgnoreCase('CHECKED') || oCorrect.value.equalsIgnoreCase('SELECTED') || oCorrect.value.equalsIgnoreCase('TRUE') || oCorrect.value.equalsIgnoreCase('ON')));
	var isYesCorrected = (oCorrected.value != null && (oCorrected.value.equalsIgnoreCase('YES') || oCorrected.value.equalsIgnoreCase('Y') || oCorrected.value.equalsIgnoreCase('CHECKED') || oCorrected.value.equalsIgnoreCase('SELECTED') || oCorrected.value.equalsIgnoreCase('TRUE') || oCorrected.value.equalsIgnoreCase('ON')));

    oWmuToCorrect.readOnly = (!isYesCorrect || isYesCorrected);
    if (!isYesCorrect && isYesCorrected) {
        oWmuToCorrect.value = String("");
    }
    expression.setReturn(rowIndex, oWmuToCorrect);

    oPrefCorrect.readOnly = (!isYesCorrect || isYesCorrected);
    if (!isYesCorrect && isYesCorrected) {
        oPrefCorrect.value = toPrecision("");
    }
    expression.setReturn(rowIndex, oPrefCorrect);
}
