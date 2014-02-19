var effDate=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Effective Date");
var todayDate=expression.getValue("$$today$$");
var bankName=expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Bank Name");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

	var futureDate = true;

	effDate=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Effective Date");
	bankName=expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Bank Name");
	if(effDate.value!=null && formatDate(effDate.value,'yyyy/MM/dd')<=formatDate(todayDate.getValue() ,'yyyy/MM/dd') && bankName.value!=null && bankName.value.equals(String(""))){

		effDate.value="";
		effDate.message="Must be a future date";
		futureDate = false;
		
	} else {
		effDate.message="";
	}

	if (futureDate) {
		for (var eRowIndex = 0; eRowIndex < totalRowCount; eRowIndex++) {
			if (rowIndex == eRowIndex)
				continue; //Don't do check for current row

			effDateCheck=expression.getValue(eRowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Effective Date");

			if (effDate.getValue() == effDateCheck.getValue() && bankName.value!=null && bankName.value.equals(String(""))) {
				effDate.value="";
				effDate.message="Cannot have to accounts with same effective date.";
				break;
			}
		}		
	}


	expression.setReturn(rowIndex,effDate);

}


function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}