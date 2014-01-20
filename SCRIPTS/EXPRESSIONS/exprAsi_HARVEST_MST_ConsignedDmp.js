var servProvCode = expression.getValue("$$servProvCode$$").value;
var oConsignedDmp = expression.getValue("ASI::TAG INFORMATION::Are you reporting on a consigned DMP tag?");
var oHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");
var otDecId = expression.getValue("ASI::TAG INFORMATION::DEC Cust. ID");

var totalRowCount = expression.getTotalRowCount();

var isYesConsignedDmp = ((oConsignedDmp.value != null && (oConsignedDmp.value.equalsIgnoreCase('YES') || oConsignedDmp.value.equalsIgnoreCase('Y') || oConsignedDmp.value.equalsIgnoreCase('CHECKED') || oConsignedDmp.value.equalsIgnoreCase('SELECTED') || oConsignedDmp.value.equalsIgnoreCase('TRUE') || oConsignedDmp.value.equalsIgnoreCase('ON'))));

oHarvestType.readOnly = isYesConsignedDmp;
expression.setReturn(oHarvestType);
if (isYesConsignedDmp) {
    oHarvestType.value = String("Deer Report");
}
expression.setReturn(oHarvestType);

otDecId.required = isYesConsignedDmp;
expression.setReturn(otDecId);
