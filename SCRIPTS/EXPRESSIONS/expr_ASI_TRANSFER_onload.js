var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

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
var vUserID = expression.getValue("$$userID$$");
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

var isValidUser = isValidUserForTransferLifetimeLicense(vUserID.getValue());
var msg = "";
if (!isValidUser) {
    msg = "Not authorize user to transfer license.";
} 
oLicYearDesc.readOnly = !isValidUser;
oLicYearDesc.message = msg;
expression.setReturn(oLicYearDesc);
	


