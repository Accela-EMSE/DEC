var servProvCode = expression.getValue("$$servProvCode$$").value;
var oApplyLand = expression.getValue("ASIT::DRAW RESULT::Apply Land Owner");
var oChoiceNum = expression.getValue("ASIT::DRAW RESULT::Choice Number");
var oDrawType = expression.getValue("ASIT::DRAW RESULT::DRAW TYPE");
var oLandOwner = expression.getValue("ASIT::DRAW RESULT::Land Owner?");
var oPrefBucket = expression.getValue("ASIT::DRAW RESULT::Preference Bucket");
var oPrefAfter = expression.getValue("ASIT::DRAW RESULT::Preference Points After");
var oPrefGiven = expression.getValue("ASIT::DRAW RESULT::Preference Points Given");
var oResult = expression.getValue("ASIT::DRAW RESULT::Result");
var oWmu = expression.getValue("ASIT::DRAW RESULT::WMU");
var oCorrect = expression.getValue("ASIT::DRAW RESULT::Correct?");
var oNew = expression.getValue("ASIT::DRAW RESULT::New?");
var oWmuToCorrect = expression.getValue("ASIT::DRAW RESULT::WMU To Correct");
var oPrefCorrect = expression.getValue("ASIT::DRAW RESULT::Preference Points Corrected");
var oCorrected = expression.getValue("ASIT::DRAW RESULT::Corrected");

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

    oPrefBucket = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Preference Bucket");
    oLandOwner = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Land Owner?");
    oWmu = expression.getValue(rowIndex, "ASIT::DRAW RESULT::WMU");
    oApplyLand = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Apply Land Owner");
    oChoiceNum = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Choice Number");
    oDrawType = expression.getValue(rowIndex, "ASIT::DRAW RESULT::DRAW TYPE");
	oCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Correct?");
    oNew = expression.getValue(rowIndex, "ASIT::DRAW RESULT::New?");
    oResult = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Result");
    oPrefGiven = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Preference Points Given");
    oPrefAfter = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Preference Points After");
	oCorrected = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Corrected");


    oApplyLand.readOnly = true;
    expression.setReturn(rowIndex, oApplyLand);

    oChoiceNum.readOnly = true;
    expression.setReturn(rowIndex, oChoiceNum);

    oDrawType.readOnly = true;
    expression.setReturn(rowIndex, oDrawType);

    oLandOwner.readOnly = true;
    expression.setReturn(rowIndex, oLandOwner);

    oPrefBucket.readOnly = true;
    expression.setReturn(rowIndex, oPrefBucket);

    oPrefAfter.readOnly = true;
    expression.setReturn(rowIndex, oPrefAfter);

    oPrefGiven.readOnly = true;
    expression.setReturn(rowIndex, oPrefGiven);

    oResult.readOnly = true;
    expression.setReturn(rowIndex, oResult);

    oWmu.readOnly = true;
    expression.setReturn(rowIndex, oWmu);

    oNew.readOnly = true;
    expression.setReturn(rowIndex, oNew);

    oWmuToCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::WMU To Correct");
    oCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Correct?");
    oNew = expression.getValue(rowIndex, "ASIT::DRAW RESULT::New?");
    oPrefCorrect = expression.getValue(rowIndex, "ASIT::DRAW RESULT::Preference Points Corrected");

    var isYesCorrect = (oCorrect.value != null && (oCorrect.value.equalsIgnoreCase('YES') || oCorrect.value.equalsIgnoreCase('Y') || oCorrect.value.equalsIgnoreCase('CHECKED') || oCorrect.value.equalsIgnoreCase('SELECTED') || oCorrect.value.equalsIgnoreCase('TRUE') || oCorrect.value.equalsIgnoreCase('ON')));
    var isYesNew = (oNew.value != null && (oNew.value.equalsIgnoreCase('YES') || oNew.value.equalsIgnoreCase('Y') || oNew.value.equalsIgnoreCase('CHECKED') || oNew.value.equalsIgnoreCase('SELECTED') || oNew.value.equalsIgnoreCase('TRUE') || oNew.value.equalsIgnoreCase('ON')));

    oWmuToCorrect.readOnly = true;
    expression.setReturn(rowIndex, oWmuToCorrect);

    oPrefCorrect.readOnly = true;
    expression.setReturn(rowIndex, oPrefCorrect);
    
	if (isYesNew) {
        oNew.readOnly = (isYesNew);
		oNew.value = false;
        expression.setReturn(rowIndex, oNew);
    }
    oCorrect.message = (isYesCorrect);
    if (isYesCorrect) {
        oCorrect.readOnly = (isYesCorrect);
        expression.setReturn(rowIndex, oCorrect);

        oNew.readOnly = (isYesCorrect);
        expression.setReturn(rowIndex, oNew);
		
		oCorrected.value = "Yes";
	} else {
		oCorrected.value = "No";
	}
	oCorrected.readOnly = true;
	expression.setReturn(rowIndex, oCorrected);
}

