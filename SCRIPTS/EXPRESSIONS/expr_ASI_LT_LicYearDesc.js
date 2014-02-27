var oLicYear = expression.getValue("ASI::GENERAL INFORMATION::License Year");
var oLicYearDesc = expression.getValue("ASI::GENERAL INFORMATION::License Year Description");
var sYearDesc = oLicYearDesc.value;

if (oLicYearDesc.value != null && oLicYearDesc.value != '') {
    //var str = sYearDesc.substring(11, 15);
	var rows = sYearDesc.split("-");
	var str = rows[0].trim();
	str = str.substring(str.length() - 4, str.length());
    oLicYear.value = str;
}
oLicYear.hidden = true;
expression.setReturn(oLicYear);

