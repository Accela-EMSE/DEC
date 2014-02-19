var servProvCode = expression.getValue("$$servProvCode$$").value;

var aa = expression.getScriptRoot();
eval(getScriptText("INCLUDES_EXPRESSIONS"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

/*

var ofieldToValid = expression.getValue("ASIT::SPORTSMAN EDUCATION::Certificate Number");

var isValid = isValidSsn(ofieldToValid.value);

if (!isValid) {
    ofieldToValid.message = "Please enter valid SSN";
} else {
    ofieldToValid.message = "";
}
expression.setReturn(ofieldToValid);

*/