
var servProvCode=expression.getValue("$$servProvCode$$").value;
var DocumentNumber=expression.getValue("ASIT::LICENSE INFORMATION::Document Number");
var form=expression.getValue("ASIT::LICENSE INFORMATION::FORM");

var aa = expression.getScriptRoot();

var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		DocumentNumber=expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::Document Number");
		form=expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::FORM");
		
		if(DocumentNumber.value.length() !=12)
		{
			DocumentNumber.message="The document number should be 12 characters.";
			expression.setReturn(rowIndex,DocumentNumber);
			form.blockSubmit=true;
			expression.setReturn(rowIndex,form);
		}
		
		if(DocumentNumber.value!=null && FindExistingDocument(DocumentNumber.value) !=null)
		{

			DocumentNumber.message="This document already exists";
			expression.setReturn(rowIndex,DocumentNumber);

			form.blockSubmit=true;
			expression.setReturn(rowIndex,form);
		}

		for (var rowIndex2 = rowIndex + 1; rowIndex2 < totalRowCount; rowIndex2++) {
		    var _documentNumber = expression.getValue(rowIndex2, "ASIT::LICENSE INFORMATION::Document Number");
		    if (DocumentNumber.value.equals(_documentNumber.value))
		    {
		        DocumentNumber.message = "Duplicate document number.";
		        expression.setReturn(rowIndex, DocumentNumber);

		        form.blockSubmit = true;
		        expression.setReturn(rowIndex, form);
		       // break;
		    }
		}
	}
	
	function FindExistingDocument(recordNum) {
	var getCapResult = aa.cap.getCapID(recordNum);

    if (getCapResult.getSuccess()) {
        return getCapResult.getOutput();
    } else {
        return null;
    }
}