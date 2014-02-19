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

//TAG INFORMATION
var otTagId = expression.getValue("ASI::TAG INFORMATION::Carcass Tag ID");
var otDob = expression.getValue("ASI::TAG INFORMATION::Date Of Birth");
var otDecId = expression.getValue("ASI::TAG INFORMATION::DEC Cust. ID");
var otHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");

var variable0 = expression.getValue("ASI::SELECTED TAG::TAG ID to Report On");
variable0.value = String(otTagId.getValue());
expression.setReturn(variable0);

//SELECTED TAG
var osCarcassTagId = expression.getValue("ASI::SELECTED TAG::TAG ID to Report On");
var otIsconsignedDMP = expression.getValue("ASI::TAG INFORMATION::Are you reporting on a consigned DMP tag?");
var otHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");

var carcassTagId = osCarcassTagId.value;
var dob = otDob.value;
var decCustId = otDecId.value;

var isConsignedDMP = otIsconsignedDMP.value.equalsIgnoreCase('YES');
var harvestType = otHarvestType.value;

var isViz = true;
var isBear = false;
var isDeer = false;
var isFallTurky = false;
var isSpringTurky = false;

isBear = harvestType == "Bear Report";
isDeer = false;
if (isConsignedDMP) {
    isDeer = true;
} else {
    isDeer = harvestType == "Deer Report";
}
isSpringTurky = harvestType == "Spring Turkey Report";
isFallTurky = harvestType == "Fall Turkey Report";

if (carcassTagId != '') {
    var msg = isValidTagForDOB(carcassTagId, decCustId, dob, harvestType, isConsignedDMP);
    osCarcassTagId.message = msg;
    asiFormO.blockSubmit = (msg != '');
    expression.setReturn(asiFormO);
}
osCarcassTagId.readOnly = otTagId.value != '';
expression.setReturn(osCarcassTagId);
