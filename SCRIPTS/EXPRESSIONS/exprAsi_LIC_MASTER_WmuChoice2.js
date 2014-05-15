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

var oHWmuChoice1 = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 1");
var oHWmuChoice2 = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 2");
var vApplyLO1 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice1");
var vApplyLO2 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice2");

var isYesApplyLO1 = ((vApplyLO1.value != null && (vApplyLO1.value.equalsIgnoreCase('YES') || vApplyLO1.value.equalsIgnoreCase('Y') || vApplyLO1.value.equalsIgnoreCase('CHECKED') || vApplyLO1.value.equalsIgnoreCase('SELECTED') || vApplyLO1.value.equalsIgnoreCase('TRUE') || vApplyLO1.value.equalsIgnoreCase('ON'))))
var isYesApplyLO2 = ((vApplyLO2.value != null && (vApplyLO2.value.equalsIgnoreCase('YES') || vApplyLO2.value.equalsIgnoreCase('Y') || vApplyLO2.value.equalsIgnoreCase('CHECKED') || vApplyLO2.value.equalsIgnoreCase('SELECTED') || vApplyLO2.value.equalsIgnoreCase('TRUE') || vApplyLO2.value.equalsIgnoreCase('ON'))))
var sHWmuChoice1 = oHWmuChoice1.value;
var sHWmuChoice2 = oHWmuChoice2.value;

var msg = '';
if ((sHWmuChoice1 != sHWmuChoice2) && isYesApplyLO1 && isYesApplyLO2) {
    msg = "Landownership can only be applied to one WMU per license year.";
}
vApplyLO1.message = msg;
expression.setReturn(vApplyLO1);

vApplyLO2.message = msg;
expression.setReturn(vApplyLO2);

var oHWmuChoice1 = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 1");
var oHWmuChoice2 = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 2");
var vApplyLO1 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice1");
var vApplyLO2 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice2");

var isYesApplyLO1 = ((vApplyLO1.value != null && (vApplyLO1.value.equalsIgnoreCase('YES') || vApplyLO1.value.equalsIgnoreCase('Y') || vApplyLO1.value.equalsIgnoreCase('CHECKED') || vApplyLO1.value.equalsIgnoreCase('SELECTED') || vApplyLO1.value.equalsIgnoreCase('TRUE') || vApplyLO1.value.equalsIgnoreCase('ON'))))
var isYesApplyLO2 = ((vApplyLO2.value != null && (vApplyLO2.value.equalsIgnoreCase('YES') || vApplyLO2.value.equalsIgnoreCase('Y') || vApplyLO2.value.equalsIgnoreCase('CHECKED') || vApplyLO2.value.equalsIgnoreCase('SELECTED') || vApplyLO2.value.equalsIgnoreCase('TRUE') || vApplyLO2.value.equalsIgnoreCase('ON'))))
var sHWmuChoice1 = oHWmuChoice1.value;
var sHWmuChoice2 = oHWmuChoice2.value;

var msg = '';
if ((sHWmuChoice1!=sHWmuChoice2) && isYesApplyLO1 && isYesApplyLO2) {
    msg = "Landownership can only be applied to one WMU per license year.";
}
vApplyLO1.message = msg;
expression.setReturn(vApplyLO1);

vApplyLO2.message = msg;
expression.setReturn(vApplyLO2);
