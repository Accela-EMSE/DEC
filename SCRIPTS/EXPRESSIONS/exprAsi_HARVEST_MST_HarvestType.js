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

//TAG INFORMATION
//var otTagId = expression.getValue("ASI::TAG INFORMATION::Carcass Tag ID");
//var otDob = expression.getValue("ASI::TAG INFORMATION::Date Of Birth");
//var otDedId = expression.getValue("ASI::TAG INFORMATION::DEC Cust. ID");
//var otHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");

//SELECTED TAG
var osCarcassTagId = expression.getValue("ASI::SELECTED TAG::TAG ID to Report On");
var otIsconsignedDMP = expression.getValue("ASI::TAG INFORMATION::Are you reporting on a consigned DMP tag?");
var otHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");


var carcassTagId = osCarcassTagId.value;
var isConsignedDMP = otIsconsignedDMP.value.equalsIgnoreCase('YES');
var harvestType = otHarvestType.value;

var isViz = (carcassTagId != '');
var isBear = false;
var isDeer = false;
var isFallTurky = false;
var isSpringTurky = false;

if (carcassTagId != '') {
    isBear = harvestType == "Bear Report";
    isDeer = false;
    if (isConsignedDMP) {
        isDeer = true;
    } else {
        isDeer = harvestType == "Deer Report";
    }
    isSpringTurky = harvestType == "Spring Turkey Report";
    isFallTurky = harvestType == "Fall Turkey Report";
}
//KILL INFORMATION
//var okLicenseYear = expression.getValue("ASI::KILL INFORMATION::License Year");
//var okTagDesc = expression.getValue("ASI::KILL INFORMATION::Tag Description");
//var okTagDocId = expression.getValue("ASI::KILL INFORMATION::Tag Document Id");
var okDateOfKill = expression.getValue("ASI::KILL INFORMATION::Date of Kill");
okDateOfKill.readOnly = !isViz;
okDateOfKill.required = isViz;
if (!isViz) {
    okDateOfKill.value = '';
}
expression.setReturn(okDateOfKill);

var okCounty = expression.getValue("ASI::KILL INFORMATION::County of Kill");
okCounty.hidden = !isViz;
//okCounty.readOnly = !isViz;
okCounty.required = isViz;
if (!isViz) {
    okCounty.value = '';
}
expression.setReturn(okCounty);

var okTown = expression.getValue("ASI::KILL INFORMATION::Town");
okTown.hidden = !isViz;
//okTown.readOnly = !isViz;
okTown.required = isViz;
if (!isViz) {
    okTown.value = '';
}
expression.setReturn(okTown);

var okwMU = expression.getValue("ASI::KILL INFORMATION::WMU");
okwMU.hidden = !isViz;
//okwMU.readOnly = !isViz;
okwMU.required = isViz;
if (!isViz) {
    okwMU.value = '';
}
expression.setReturn(okwMU);

//Bear,Deer
var okSex = expression.getValue("ASI::KILL INFORMATION::Sex");
okSex.hidden = !(isViz && (isBear || isDeer));
//okSex.readOnly = !(isViz && (isBear || isDeer));
okSex.required = (isViz && (isBear || isDeer));
if (!(isViz && (isBear || isDeer))) {
    okSex.value = '';
}
expression.setReturn(okSex);

//Only Bear
var okBearSeason = expression.getValue("ASI::KILL INFORMATION::Bear Season");
okBearSeason.hidden = !(isViz && isBear);
//okBearSeason.readOnly = !(isViz && isBear);
okBearSeason.required = (isViz && isBear);
if (!(isViz && isBear)) {
    okBearSeason.value = '';
}
expression.setReturn(okBearSeason);

var okBearTakenWith = expression.getValue("ASI::KILL INFORMATION::Bear Taken With");
okBearTakenWith.hidden = !(isViz && isBear);
//okBearTakenWith.readOnly = !(isViz && isBear);
okBearTakenWith.required = (isViz && isBear);
if (!(isViz && isBear)) {
    okBearTakenWith.value = '';
}
expression.setReturn(okBearTakenWith);

var okAge = expression.getValue("ASI::KILL INFORMATION::Age");
okAge.hidden = !(isViz && isBear);
//okAge.readOnly = !(isViz && isBear);
okAge.required = (isViz && isBear);
if (!(isViz && isBear)) {
    okAge.value = '';
}
expression.setReturn(okAge);

//Only Deeer
var okDeerSeason = expression.getValue("ASI::KILL INFORMATION::Deer Season");
okDeerSeason.hidden = !(isViz && isDeer);
//okDeerSeason.readOnly = !(isViz && isDeer);
okDeerSeason.required = (isViz && isDeer);
if (!(isViz && isDeer)) {
    okDeerSeason.value = '';
}
expression.setReturn(okDeerSeason);

var okDeerTakenWith = expression.getValue("ASI::KILL INFORMATION::Deer Taken With");
okDeerTakenWith.hidden = !(isViz && isDeer);
//okDeerTakenWith.readOnly = !(isViz && isDeer);
okDeerTakenWith.required = (isViz && isDeer);
if (!(isViz && isDeer)) {
    okDeerTakenWith.value = '';
}
expression.setReturn(okDeerTakenWith);

var okLeftAntlerPoints = expression.getValue("ASI::KILL INFORMATION::Left Antler Points");
okLeftAntlerPoints.hidden = !(isViz && isDeer);
//okLeftAntlerPoints.readOnly = !(isViz && isDeer);
okLeftAntlerPoints.required = (isViz && isDeer);
if (!(isViz && isDeer)) {
    okLeftAntlerPoints.value = '';
}
expression.setReturn(okLeftAntlerPoints);

var okRighttAntlerPoints = expression.getValue("ASI::KILL INFORMATION::Right Antler Points");
okRighttAntlerPoints.hidden = !(isViz && isDeer);
//okRighttAntlerPoints.readOnly = !(isViz && isDeer);
okRighttAntlerPoints.required = (isViz && isDeer);
if (!(isViz && isDeer)) {
    okRighttAntlerPoints.value = '';
}
expression.setReturn(okRighttAntlerPoints);

//Onli Turkey
var okTurkBeardLen = expression.getValue("ASI::KILL INFORMATION::Turkey Beard Length");
okTurkBeardLen.hidden = !(isViz && (isSpringTurky || isFallTurky));
//okTurkBeardLen.readOnly = !(isViz && (isSpringTurky || isFallTurky));
okTurkBeardLen.required = (isViz && (isSpringTurky || isFallTurky));
if (!(isViz && (isSpringTurky || isFallTurky))) {
    okTurkBeardLen.value = '';
}
expression.setReturn(okTurkBeardLen);

var okTurkLegSaved = expression.getValue("ASI::KILL INFORMATION::Turkey Leg Saved?");
okTurkLegSaved.hidden = !(isViz && (isSpringTurky || isFallTurky));
//okTurkLegSaved.readOnly = !(isViz && (isSpringTurky || isFallTurky));
okTurkLegSaved.required = (isViz && (isSpringTurky || isFallTurky));
if (!(isViz && (isSpringTurky || isFallTurky))) {
    okTurkLegSaved.value = '';
}
expression.setReturn(okTurkLegSaved);

var okTurkSpurLen = expression.getValue("ASI::KILL INFORMATION::Turkey Spur Length");
okTurkSpurLen.hidden = !(isViz && (isSpringTurky || isFallTurky));
//okTurkSpurLen.readOnly = !(isViz && (isSpringTurky || isFallTurky));
okTurkSpurLen.required = (isViz && (isSpringTurky || isFallTurky));
if (!(isViz && (isSpringTurky || isFallTurky))) {
    okTurkSpurLen.value = '';
}
expression.setReturn(okTurkSpurLen);

var okWeight = expression.getValue("ASI::KILL INFORMATION::Weight (to nearest pound)");
okWeight.hidden = !(isViz && (isSpringTurky || isFallTurky));
//okWeight.readOnly = !(isViz && (isSpringTurky || isFallTurky));
okWeight.required = (isViz && (isSpringTurky || isFallTurky));
if (!(isViz && (isSpringTurky || isFallTurky))) {
    okWeight.value = '';
}
expression.setReturn(okWeight);

//OTHER INFORMATION
//Bear
var ooAddrExam = expression.getValue("ASI::OTHER INFORMATION::Address for Examination");
ooAddrExam.hidden = !(isViz && isBear);
//ooAddrExam.readOnly = !(isViz && isBear);
ooAddrExam.required = (isViz && isBear);
if (!(isViz && isBear)) {
    ooAddrExam.value = '';
}
expression.setReturn(ooAddrExam);

var ooContactPhone = expression.getValue("ASI::OTHER INFORMATION::Contact Phone #");
ooContactPhone.hidden = !(isViz && isBear);
//ooContactPhone.readOnly = !(isViz && isBear);
ooContactPhone.required = (isViz && isBear);
if (!(isViz && isBear)) {
    ooContactPhone.value = '';
}
expression.setReturn(ooContactPhone);

var ooCountyExam = expression.getValue("ASI::OTHER INFORMATION::County for Examination of Bear");
ooCountyExam.hidden = !(isViz && isBear);
//ooCountyExam.readOnly = !(isViz && isBear);
ooCountyExam.required = (isViz && isBear);
if (!(isViz && isBear)) {
    ooCountyExam.value = '';
}
expression.setReturn(ooCountyExam);

///Turkey
var ooTurkNumDaysToKill = expression.getValue("ASI::OTHER INFORMATION::Number of days hunted to kill this turkey");
ooTurkNumDaysToKill.hidden = !(isViz && (isSpringTurky || isFallTurky));
//ooTurkNumDaysToKill.readOnly = !(isViz && (isSpringTurky || isFallTurky));
ooTurkNumDaysToKill.required = (isViz && (isSpringTurky || isFallTurky));
if (isFallTurky) {
    ooTurkNumDaysToKill.message = "Did you save a leg from this turkey? DEC would like to send you an envelope to mail it back.";
} else {
    ooTurkNumDaysToKill.message = "";
}

if (!(isViz && (isSpringTurky || isFallTurky))) {
    ooTurkNumDaysToKill.value = '';
}
expression.setReturn(ooTurkNumDaysToKill);

var ooReportingChannnel = expression.getValue("ASI::OTHER INFORMATION::Reporting Channel");
ooReportingChannnel.hidden = !isViz;
//ooReportingChannnel.readOnly = !isViz;
ooReportingChannnel.required = isViz;
if (!isViz) {
    ooReportingChannnel.value = '';
}
expression.setReturn(ooReportingChannnel);
