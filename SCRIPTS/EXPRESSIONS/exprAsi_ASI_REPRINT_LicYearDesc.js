var aa = expression.getScriptRoot();
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_EXPRESSIONS"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();
var vUserID = expression.getValue("$$userID$$");
var asiFormO = expression.getValue("ASI::FORM");

var isValidUser = isValidUserForReprintDocuments(vUserID.getValue());
var oLicYear = expression.getValue("ASI::GENERAL INFORMATION::License Year");
var oLicYearDesc = expression.getValue("ASI::GENERAL INFORMATION::License Year Description");
var sYearDesc = oLicYearDesc.value;

if (oLicYearDesc.value != null && oLicYearDesc.value != '') {
	var rows = sYearDesc.split("-");
	var str = rows[0].trim();
	str = str.substring(str.length() - 4, str.length());
    oLicYear.value = str;
}
oLicYear.hidden = true;
expression.setReturn(oLicYear);

if (!isValidUser) {
    oLicYearDesc.message = "This user is not authorized to Replace Documents.";
    oLicYearDesc.readOnly = true;
    expression.setReturn(oLicYearDesc);
}
