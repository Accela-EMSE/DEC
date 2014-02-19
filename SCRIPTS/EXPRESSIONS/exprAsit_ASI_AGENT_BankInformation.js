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
    vMainCtrl = expression.getValue("ASIT::BANK INFORMATION::Bank Name");
    var vRTNbr = expression.getValue("ASIT::BANK INFORMATION::Routing Transit Number");
    var vEffDt = expression.getValue("ASIT::BANK INFORMATION::Effective Date");

    var vTform = expression.getValue("ASIT::BANK INFORMATION::FORM");
    var oToday = expression.getValue("$$today$$");   
	
    var allMsg = '';
    var msg = '';

    for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
        vTform = expression.getValue(rowIndex, "ASIT::BANK INFORMATION::FORM");
        vMainCtrl = expression.getValue(rowIndex, "ASIT::BANK INFORMATION::Bank Name");
        vRTNbr = expression.getValue(rowIndex, "ASIT::BANK INFORMATION::Routing Transit Number");
        vEffDt = expression.getValue(rowIndex, "ASIT::BANK INFORMATION::Effective Date");

        var isValid = true;
        isValid = isValidTaxMapId(vMainCtrl.value);
        msg = '';
        if (!isValid) {
            msg = "Please enter valid Bank Name";
        }
        vMainCtrl.message = msg;
        expression.setReturn(rowIndex, vMainCtrl);

        isValid = true;
        isValid = isValidSWISCode(vRTNbr.value);
        msg = '';
        if (!isValid) {
            msg = "Please enter valid 6 digit Routing Transit Number.";
        }
        vRTNbr.message = msg;
        expression.setReturn(rowIndex, vRTNbr);

        isValid = true;
        isValid = isValidYear(vEffDt.value);

        msg = '';
        if (!isValid) {
            msg = "Please enter valid year.";
        }
        vEffDt.message = msg;
        expression.setReturn(rowIndex, vEffDt);
    }
}
catch (err) {
    vMainCtrl = expression.getValue("ASIT::BANK INFORMATION::Bank Name");
    vMainCtrl.message = "An error occured in expression valid dates : " + err.message;
    expression.setReturn(expression.getTotalRowCount(), vCourseDate);
}
