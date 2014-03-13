var servProvCode = expression.getValue("$$servProvCode$$").value;
var oCorrect = expression.getValue("ASIT::DRAW RESULT::Correct?");
var oNew = expression.getValue("ASIT::DRAW RESULT::New?");
var variable2 = expression.getValue("ASIT::DRAW RESULT::FORM");


var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

    oCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Correct?");
    oNew = expression.getValue(rowIndex, "ASIT::DRAW RESULT::New?");
    variable2 = expression.getValue(rowIndex, "ASIT::DRAW RESULT::FORM");

    var isYesCorrect = (oCorrect.value != null && (oCorrect.value.equalsIgnoreCase('YES') || oCorrect.value.equalsIgnoreCase('Y') || oCorrect.value.equalsIgnoreCase('CHECKED') || oCorrect.value.equalsIgnoreCase('SELECTED') || oCorrect.value.equalsIgnoreCase('TRUE') || oCorrect.value.equalsIgnoreCase('ON')));
    var isYesNew = (oNew.value != null && (oNew.value.equalsIgnoreCase('YES') || oNew.value.equalsIgnoreCase('Y') || oNew.value.equalsIgnoreCase('CHECKED') || oNew.value.equalsIgnoreCase('SELECTED') || oNew.value.equalsIgnoreCase('TRUE') || oNew.value.equalsIgnoreCase('ON')));

    if (isYesCorrect && isYesNew) {
        variable2.blockSubmit = isYesCorrect && isYesNew;
        variable2.message = 'Row index #' + (rowIndex + 1) + ' has "Correct? and "New?" are checked. Please seclect only one action.';
        expression.setReturn(rowIndex, variable2);
    }
}
