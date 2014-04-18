var servProvCode=expression.getValue("$$servProvCode$$").value;
var modifiedFlag=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Modified Flag");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

	modifiedFlag=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Modified Flag");
	if (modifiedFlag.value == '' || modifiedFlag.value == null) {
		modifiedFlag.value=1;
		expression.setReturn(rowIndex,modifiedFlag);
	}
}