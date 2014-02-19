var servProvCode = expression.getValue("$$servProvCode$$").value;
var oNYOrgnizedMilitia = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::NY Organized Militia");
var oNYOrgnizedMilitiaType = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::NY Organized Militia Type");

var isoNYOrgnizedMilitia = ((oNYOrgnizedMilitia.value != null && (oNYOrgnizedMilitia.value.equalsIgnoreCase('YES') || oNYOrgnizedMilitia.value.equalsIgnoreCase('Y') || oNYOrgnizedMilitia.value.equalsIgnoreCase('CHECKED') || oNYOrgnizedMilitia.value.equalsIgnoreCase('SELECTED') || oNYOrgnizedMilitia.value.equalsIgnoreCase('TRUE') || oNYOrgnizedMilitia.value.equalsIgnoreCase('ON'))));

oNYOrgnizedMilitiaType.required = isoNYOrgnizedMilitia;
oNYOrgnizedMilitiaType.hidden = !isoNYOrgnizedMilitia;
//oNYOrgnizedMilitiaType.readOnly = !isoNYOrgnizedMilitia;
if (!isoNYOrgnizedMilitia) {
    oNYOrgnizedMilitiaType.value = null;
}
expression.setReturn(oNYOrgnizedMilitiaType);
