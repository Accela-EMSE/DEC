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

var oNativeAmeican = expression.getValue("ASI::APPEARANCE::Native American?");
var oA_IsNativeAmerican = expression.getValue("ASI::INTERNAL USE::A_IsNativeAmerican");

var vUserID = expression.getValue("$$userID$$");

var isNativeAmeican = isNativeAmericanAgent(vUserID.getValue());

if (!isNativeAmeican) {
    oA_IsNativeAmerican.value = "";
    expression.setReturn(oA_IsNativeAmerican);

    oNativeAmeican.hidden = true;
    expression.setReturn(oNativeAmeican);
}
