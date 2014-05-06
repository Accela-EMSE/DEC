
var servProvCode = expression.getValue("$$servProvCode$$").value;
var DocumentNumber = expression.getValue("ASIT::LICENSE INFORMATION::Document Number");
var hasDocumentNumber = expression.getValue("ASIT::LICENSE INFORMATION::Has Document Number?");
DocumentNumber.message = "";
var aa = expression.getScriptRoot();

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

    DocumentNumber = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Document Number");
    hasDocumentNumber = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Has Document Number?");

	var isYesHasDocNumber = ((hasDocumentNumber.value!=null && (hasDocumentNumber.value.equalsIgnoreCase('YES') || hasDocumentNumber.value.equalsIgnoreCase('Y') || hasDocumentNumber.value.equalsIgnoreCase('CHECKED') || hasDocumentNumber.value.equalsIgnoreCase('SELECTED') || hasDocumentNumber.value.equalsIgnoreCase('TRUE') || hasDocumentNumber.value.equalsIgnoreCase('ON'))));
    if (isYesHasDocNumber) {
		if (DocumentNumber.value == null || DocumentNumber.value == "") {
            DocumentNumber.message = "Document Number is required.";
            expression.setReturn(rowIndex, DocumentNumber);
		} else if (DocumentNumber.value.length() != 12) {
            DocumentNumber.message = "The document number should be 12 characters.";
            expression.setReturn(rowIndex, DocumentNumber);
        } else if (DocumentNumber.value != null && FindExistingDocument(DocumentNumber.value) != null) {
			DocumentNumber.message = "This document already exists";
			expression.setReturn(rowIndex, DocumentNumber);
		}
    } else {
		if (DocumentNumber.value != null && DocumentNumber.value != "") {
			DocumentNumber.message = "Please verify selection of Has Document Number.";
			expression.setReturn(rowIndex, DocumentNumber);
		}
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