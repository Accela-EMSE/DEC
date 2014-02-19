var oDate = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Affidavit Date");
var oAffirmation = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Affirmation");
var oUsArmed = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Full-time U.S. Armed Service");
var oUsArmedServceType = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Full-time U.S. Armed Service Type");
var oGradeRank = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Grade / Rank");
var oLocation = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Location");
var oMilitaryServiceMan = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Military Serviceman");
var oNameCO = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Name of Commanding Officer");
var oNYOrgnizedMilitia = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::NY Organized Militia");
var oNYOrgnizedMilitiaType = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::NY Organized Militia Type");
var oPhoneCO = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Phone of Commanding Officer");
var oUSReserve = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::U.S. Reserve Member");
var oUSReserveServiceType = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::U.S. Reserve Member Type");
var oUnitName = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Unit Name");


var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var isYesMilitaryServiceMan = oMilitaryServiceMan.value.equalsIgnoreCase('YES');

//oMilitaryServiceMan.hidden = true;
oUsArmed.hidden = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oUsArmed.value = false;
}
expression.setReturn(oUsArmed);

var isUsArmed = ((oUsArmed.value != null && (oUsArmed.value.equalsIgnoreCase('YES') || oUsArmed.value.equalsIgnoreCase('Y') || oUsArmed.value.equalsIgnoreCase('CHECKED') || oUsArmed.value.equalsIgnoreCase('SELECTED') || oUsArmed.value.equalsIgnoreCase('TRUE') || oUsArmed.value.equalsIgnoreCase('ON'))));

oUsArmedServceType.hidden = !isUsArmed;
oUsArmedServceType.required = isUsArmed;
//oUsArmedServceType.readOnly = !isUsArmed;
if (!isUsArmed) {
    oUsArmedServceType.value = null;
}
expression.setReturn(oUsArmedServceType);


oNYOrgnizedMilitia.hidden = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oNYOrgnizedMilitia.value = false;
}
expression.setReturn(oNYOrgnizedMilitia);

var isoNYOrgnizedMilitia = ((oNYOrgnizedMilitia.value != null && (oNYOrgnizedMilitia.value.equalsIgnoreCase('YES') || oNYOrgnizedMilitia.value.equalsIgnoreCase('Y') || oNYOrgnizedMilitia.value.equalsIgnoreCase('CHECKED') || oNYOrgnizedMilitia.value.equalsIgnoreCase('SELECTED') || oNYOrgnizedMilitia.value.equalsIgnoreCase('TRUE') || oNYOrgnizedMilitia.value.equalsIgnoreCase('ON'))));

oNYOrgnizedMilitiaType.hidden = !isoNYOrgnizedMilitia;
oNYOrgnizedMilitiaType.required = isoNYOrgnizedMilitia;
//oNYOrgnizedMilitiaType.readOnly = !isoNYOrgnizedMilitia;
if (!isoNYOrgnizedMilitia) {
    oNYOrgnizedMilitiaType.value = null;
}
expression.setReturn(oNYOrgnizedMilitiaType);


oUSReserve.hidden = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oUSReserve.value = false;
}
expression.setReturn(oUSReserve);

var isUSReserve = ((oUSReserve.value != null && (oUSReserve.value.equalsIgnoreCase('YES') || oUSReserve.value.equalsIgnoreCase('Y') || oUSReserve.value.equalsIgnoreCase('CHECKED') || oUSReserve.value.equalsIgnoreCase('SELECTED') || oUSReserve.value.equalsIgnoreCase('TRUE') || oUSReserve.value.equalsIgnoreCase('ON'))));

oUSReserveServiceType.hidden = !isUSReserve;
oUSReserveServiceType.required = isUSReserve;
//oUSReserveServiceType.readOnly = !isUSReserve;
if (!isUSReserve) {
    oUSReserveServiceType.value = null;
}
expression.setReturn(oUSReserveServiceType);

oUnitName.hidden = !isYesMilitaryServiceMan;
oUnitName.required = isYesMilitaryServiceMan;
//oUnitName.readOnly = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oUnitName.value = "";
}
expression.setReturn(oUnitName);

oGradeRank.hidden = !isYesMilitaryServiceMan;
oGradeRank.required = isYesMilitaryServiceMan;
//oGradeRank.readOnly = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oGradeRank.value = "";
}
expression.setReturn(oGradeRank);

oLocation.hidden = !isYesMilitaryServiceMan;
oLocation.required = isYesMilitaryServiceMan;
//oLocation.readOnly = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oLocation.value = "";
}
expression.setReturn(oLocation);

oPhoneCO.hidden = !isYesMilitaryServiceMan;
oPhoneCO.required = isYesMilitaryServiceMan;
//oPhoneCO.readOnly = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oPhoneCO.value = "";
}
expression.setReturn(oPhoneCO);

oNameCO.hidden = !isYesMilitaryServiceMan;
oNameCO.required = isYesMilitaryServiceMan;
//oNameCO.readOnly = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oNameCO.value = "";
}
expression.setReturn(oNameCO);

oAffirmation.hidden = !isYesMilitaryServiceMan;
oAffirmation.required = isYesMilitaryServiceMan;
//oAffirmation.readOnly = !isYesMilitaryServiceMan;
if (!isYesMilitaryServiceMan) {
    oAffirmation.value = false;
}
expression.setReturn(oAffirmation);

oDate.hidden = !isYesMilitaryServiceMan;
oDate.required = false;
oDate.readOnly = true;
if (isYesMilitaryServiceMan) {
    oDate.value = expression.getValue("$$today$$").value;
}
else {
    oDate.value = null;
}
expression.setReturn(oDate);
