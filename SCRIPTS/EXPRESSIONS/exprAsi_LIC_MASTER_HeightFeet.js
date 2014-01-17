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
var oInch = expression.getValue("ASI::APPEARANCE::Height");

var isValid = true;
isValid = isValidIntegerInches(oInch.value);

var msg = '';
if (!isValid) {
    msg = 'Please enter valid integer.';
}
else {
    if (oInch.value != null && (parseInt(oInch.value) < 0)) {
        msg = "Inches must be less than 0.";
        expression.setReturn(oInch);
    }
}
oInch.message = msg;
expression.setReturn(oInch);
