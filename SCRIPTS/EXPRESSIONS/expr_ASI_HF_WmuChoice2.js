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

var aPreviousLicense = expression.getValue("ASI::INTERNAL USE::A_Previous_License");
var aSportsmanEducation = expression.getValue("ASI::INTERNAL USE::A_Sportsman_Education");
var oWmu = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 2");

var wmu = oWmu.value;
var AInfo = new Array();
AInfo["A_Previous_License"] = aPreviousLicense.value;
AInfo["A_Sportsman_Education"] = aSportsmanEducation.value;

var isValid = true;
isValid = isValidBowHuntWmu(wmu, AInfo);

var msg = '';
if (!isValid) {
    msg = 'No Bow hunting education. Selected WMU is valid only for bow hunting.';
}

oWmu.message = msg;
expression.setReturn(oWmu);
