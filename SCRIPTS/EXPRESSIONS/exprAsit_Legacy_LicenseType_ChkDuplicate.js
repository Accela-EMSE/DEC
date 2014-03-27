var servProvCode = expression.getValue("$$servProvCode$$").value;
var LicenseType = expression.getValue("ASIT::LICENSE INFORMATION::License Type");
var form = expression.getValue("ASIT::LICENSE INFORMATION::FORM");
var totalRowCount = expression.getTotalRowCount();
var DuplicateCounter = 0;

var aa = expression.getScriptRoot();

var strControl = "DD_LEGACY_LICENSE_TYPE";
var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);

if (bizDomScriptResult.getSuccess())
{
    bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
   

    for (var i in bizDomScriptArray)
    {
        // these are the same variable as lic type
        for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++)
        {

            form = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::FORM");
            var LicenseType = expression.getValue(rowIndex, "ASIT::LICENSE INFORMATION::License Type");

            if (bizDomScriptArray[i].getBizdomainValue().equals(LicenseType.value)) {
                DuplicateCounter = DuplicateCounter + 1;
            }
        }

        if (DuplicateCounter >= 2) {
            form.message = "License type should not be duplicated";
            form.blockSubmit = true;
            expression.setReturn(rowIndex, form);
        }
        else {
            DuplicateCounter = 0;
        }

    }
}

