var servProvCode = expression.getValue("$$servProvCode$$").value;
var LicenseYear = expression.getValue("ASIT::LICENSE INFORMATION::License Year");

var totalRowCount = expression.getTotalRowCount();

for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

	LicenseYear = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::License Year");
	if (LicenseYear.value != null && LicenseYear.value != '') {

		var Pattern = /^\d{4}$/;
		isValid = Pattern.test(LicenseYear.value);

		if (!isValid) {
			LicenseYear.message = "Please enter a valid year in 4 digit format ";
			expression.setReturn(rowIndex, LicenseYear);
		}
	}
}