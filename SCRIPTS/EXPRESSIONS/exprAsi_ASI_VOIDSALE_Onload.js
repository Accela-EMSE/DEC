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

var isValidUser = isValidUserForVoidSales(vUserID.getValue());
var oCustoId = expression.getValue("ASI::GENERAL INFORMATION::Customer ID");

if (!isValidUser) {
    oCustoId.message = "Not authorize user to void sales.";
}
oCustoId.readOnly = true;
expression.setReturn(oCustoId);
