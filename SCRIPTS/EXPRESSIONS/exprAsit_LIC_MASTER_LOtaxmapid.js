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

var vMainCtrl;
try {
    vMainCtrl = expression.getValue("ASIT::LAND OWNER INFORMATION::Tax Map ID/Parcel ID");
    var vSwisCode = expression.getValue("ASIT::LAND OWNER INFORMATION::SWIS Code");
    var vYear = expression.getValue("ASIT::LAND OWNER INFORMATION::License Year");
    
    var vTform = expression.getValue("ASIT::LAND OWNER INFORMATION::FORM");

    var allMsg = '';
    var msg = '';

    for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
        vTform = expression.getValue(rowIndex, "ASIT::LAND OWNER INFORMATION::FORM");
        vMainCtrl = expression.getValue(rowIndex, "ASIT::LAND OWNER INFORMATION::Tax Map ID/Parcel ID");
        vSwisCode = expression.getValue(rowIndex, "ASIT::LAND OWNER INFORMATION::SWIS Code");
        vYear = expression.getValue(rowIndex, "ASIT::LAND OWNER INFORMATION::License Year");

        var isValid = true;
        isValid = isValidTaxMapId(vMainCtrl.value);
        msg = '';
        if (!isValid) {
            msg = "Please enter valid Tax Map ID/Parcel ID";
        }
        vMainCtrl.message = msg;
        expression.setReturn(rowIndex, vMainCtrl);

        isValid = true;
        isValid = isValidSWISCode(vSwisCode.value);
        msg = '';
        if (!isValid) {
            msg = "Please enter valid 6 digit SWIS code.";
        }
        vSwisCode.message = msg;
        expression.setReturn(rowIndex, vSwisCode);

        isValid = true;
        isValid = isValidYear(vYear.value);

        msg = '';
        if (!isValid) {
            msg = "Please enter valid year.";
        }
        vYear.message = msg;
        expression.setReturn(rowIndex, vYear);
    }
}
catch (err) {
    vMainCtrl = expression.getValue("ASIT::LAND OWNER INFORMATION::Tax Map ID/Parcel ID");
    vMainCtrl.message = "An error occured in expression valid dates : " + err.message;
    expression.setReturn(expression.getTotalRowCount(), vMainCtrl);
}
