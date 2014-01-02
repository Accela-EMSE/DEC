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
var otHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");
var harvestType = otHarvestType.value;
var asiFormO = expression.getValue("ASI::FORM");

var msg = '';
if (isNull(harvestType, '') != '') {
    if (!isValidHarvestSeasonByType(harvestType)) {
        msg = 'Selected harvest type is not available to report.';
    }
}

asiFormO.blockSubmit = (msg != '');
expression.setReturn(asiFormO);
otHarvestType.message = msg;
expression.setReturn(otHarvestType);