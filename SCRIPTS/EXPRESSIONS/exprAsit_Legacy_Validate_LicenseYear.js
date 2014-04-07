
var servProvCode = expression.getValue("$$servProvCode$$").value;
var LicenseYear = expression.getValue("ASIT::LICENSE INFORMATION::License Year");

var totalRowCount = expression.getTotalRowCount() - 1;

for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

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
}