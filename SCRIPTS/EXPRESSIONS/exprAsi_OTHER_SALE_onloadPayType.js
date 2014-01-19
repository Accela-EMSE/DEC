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

var vPaymentType = expression.getValue("ASI::PAYMENT INFORMATION::Payment Type");
var vUserID = expression.getValue("$$userID$$");

var isAgent = isValidUserForPayementInfo(vUserID.getValue());

if (!isAgent) {
    vPaymentType.value = "Credit Card";
    vPaymentType.readOnly = !isAgent;
    expression.setReturn(vPaymentType);
}
