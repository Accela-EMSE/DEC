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

function diffDate(iDate1, iDate2) {
    return expression.diffDate(iDate1, iDate2);
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var vMainCtrl;
try {
    vMainCtrl = expression.getValue("ASIT::PREVIOUS LICENSE::License Number");
    var vLicdt = expression.getValue("ASIT::PREVIOUS LICENSE::License Date");
    var vState = expression.getValue("ASIT::PREVIOUS LICENSE::State");
    var vTform = expression.getValue("ASIT::PREVIOUS LICENSE::FORM");
    var oToday = expression.getValue("$$today$$");

    var allMsg = '';
    var msg = '';

    for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
        vTform = expression.getValue(rowIndex, "ASIT::PREVIOUS LICENSE::FORM");
        vMainCtrl = expression.getValue(rowIndex, "ASIT::PREVIOUS LICENSE::License Number");
        vState = expression.getValue(rowIndex, "ASIT::PREVIOUS LICENSE::State");
        vLicdt = expression.getValue(rowIndex, "ASIT::PREVIOUS LICENSE::License Date");

        var isValid = true;
        if (vState.value == 'NY') {
            isValid = isValidPriorLicense(vMainCtrl.value);
        }

        msg = '';
        if (!isValid) {
            msg = "Please enter valid prior license number.";
        }
        vMainCtrl.message = msg;
        expression.setReturn(rowIndex, vMainCtrl);

        msg = "License Date cannot be after today's date";
        vLicdt.message = diffDate(oToday.getValue(), vLicdt.value) > 0 ? msg : '';
        expression.setReturn(rowIndex, vLicdt);
    }
}
catch (err) {
    vMainCtrl = expression.getValue("ASIT::PREVIOUS LICENSE::License Number");
    vMainCtrl.message = "An error occured in expression valid dates : " + err.message;
    expression.setReturn(expression.getTotalRowCount(), vMainCtrl);
}
