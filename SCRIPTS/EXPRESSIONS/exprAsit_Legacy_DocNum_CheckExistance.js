
var servProvCode = expression.getValue("$$servProvCode$$").value;
var DocumentNumber = expression.getValue("ASIT::LICENSE INFORMATION::Document Number");

var aa = expression.getScriptRoot();

var totalRowCount = expression.getTotalRowCount() - 1;
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

    DocumentNumber = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Document Number");

    if (DocumentNumber.value.length() != 12) {
        DocumentNumber.message = "The document number should be 12 characters.";
        expression.setReturn(rowIndex, DocumentNumber);
    }

    if (DocumentNumber.value != null && FindExistingDocument(DocumentNumber.value) != null) {
        DocumentNumber.message = "This document already exists";
        expression.setReturn(rowIndex, DocumentNumber);
    }
}

function FindExistingDocument(recordNum) {
    var getCapResult = aa.cap.getCapID(recordNum);

    if (getCapResult.getSuccess()) {
        return getCapResult.getOutput();
    } else {
        return null;
    }
}