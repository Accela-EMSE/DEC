
var servProvCode = expression.getValue("$$servProvCode$$").value;
var form = expression.getValue("ASIT::LICENSE INFORMATION::FORM");
var totalRowCount = expression.getTotalRowCount();
var aa = expression.getScriptRoot();
var DuplicateCounter = 0;
var Today = expression.getValue("$$today$$");

var strControl = "DD_LEGACY_LICENSE_TYPE";
var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);

var EffectiveDate = expression.getValue("ASIT::LICENSE INFORMATION::Effective Date");
var DocumentNumber = expression.getValue("ASIT::LICENSE INFORMATION::Document Number");
var LicenseType = expression.getValue("ASIT::LICENSE INFORMATION::License Type");
var LicenseYear = expression.getValue("ASIT::LICENSE INFORMATION::License Year");

// Check number of records
var minRows = 1;
if (totalRowCount <= minRows) {
    form.message = "You must enter at least " + minRows + " row(s) on this table"; ;
    form.blockSubmit = true;
    expression.setReturn(form);
}

// Chech duplicate license types

if (bizDomScriptResult.getSuccess()) {
    bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
    for (var i in bizDomScriptArray) {
        // these are the same variable as lic type
        for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
            form = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::FORM");
            LicenseType = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::License Type");
            if (bizDomScriptArray[i].getBizdomainValue().equals(LicenseType.value)) {
                DuplicateCounter = DuplicateCounter + 1;
            }
        }
        if (DuplicateCounter >= 2) {
            form.message = "License type should not be duplicated";
            form.blockSubmit = true;
            expression.setReturn(rowIndex, form);
        }
        else {
            DuplicateCounter = 0;
        }
    }
}



for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {


    form = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::FORM");

    LicenseYear = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::License Year");
    if (LicenseYear.value != null && LicenseYear.value != '') {
        var Pattern = /^\d{4}$/;
        isValid = Pattern.test(LicenseYear.value);
        if (!isValid) {
            form.blockSubmit = true;
            expression.setReturn(rowIndex, form);
            LicenseYear.message = "Please enter a valid year";
            expression.setReturn(rowIndex, LicenseYear);
        }
    }



    DocumentNumber = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Document Number");

    if (DocumentNumber.value.length() > 12) {
        DocumentNumber.message = "The document number should not be greater than 12 characters.";
        expression.setReturn(rowIndex, DocumentNumber);
        form.blockSubmit = true;
        expression.setReturn(rowIndex, form);
    }

    if (DocumentNumber.value != null && FindExistingDocument(DocumentNumber.value) != null) {

        DocumentNumber.message = "This document already exists";
        expression.setReturn(rowIndex, DocumentNumber);
        form.blockSubmit = true;
        expression.setReturn(rowIndex, form);
    }

    for (var rowIndex2 = rowIndex + 1; rowIndex2 < totalRowCount; rowIndex2++) {
        var _documentNumber = expression.getValue(rowIndex2, "ASIT::LICENSE INFORMATION::Document Number");
        if (DocumentNumber.value.equals(_documentNumber.value)) {
            DocumentNumber.message = "Duplicate document number.";
            expression.setReturn(rowIndex, DocumentNumber);

            form.blockSubmit = true;
            expression.setReturn(rowIndex, form);
            // break;
        }
    }

    EffectiveDate = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Effective Date");
    if (EffectiveDate.value != null && formatDate(EffectiveDate.value, 'yyyy/MM/dd') > formatDate(Today.getValue(), 'yyyy/MM/dd')) {
        EffectiveDate.message = "Effective date should not be a future date";
        expression.setReturn(rowIndex, EffectiveDate);
        form.blockSubmit = true;
        expression.setReturn(rowIndex, form);
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

function formatDate(dateString, pattern) {
    if (dateString == null || dateString == '') {
        return '';
    }
    return expression.formatDate(dateString, pattern);
}

