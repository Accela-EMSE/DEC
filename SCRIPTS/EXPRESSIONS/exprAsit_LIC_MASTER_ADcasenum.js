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
    vMainCtrl = expression.getValue("ASIT::ANNUAL DISABILITY::Annual Disability Case Number");
    var vYear = expression.getValue("ASIT::ANNUAL DISABILITY::Year");
    var vTform = expression.getValue("ASIT::ANNUAL DISABILITY::FORM");
    var allMsg = '';
    var msg = '';

    for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
        vTform = expression.getValue(rowIndex, "ASIT::ANNUAL DISABILITY::FORM");
        vMainCtrl = expression.getValue(rowIndex, "ASIT::ANNUAL DISABILITY::Annual Disability Case Number");
        vYear = expression.getValue(rowIndex, "ASIT::ANNUAL DISABILITY::Year");

        var isValid = true;
        isValid = isValidDisabilityNumber(vMainCtrl.value);

        msg = '';
        if (!isValid) {
            msg = "Please enter valid annual disability case number.";
        }
        vMainCtrl.message = msg;
        expression.setReturn(rowIndex, vMainCtrl);

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
    vMainCtrl = expression.getValue("ASIT::ANNUAL DISABILITY::Annual Disability Case Number");
    vMainCtrl.message = "An error occured in expression valid dates : " + err.message;
    expression.setReturn(expression.getTotalRowCount(), vMainCtrl);
}
