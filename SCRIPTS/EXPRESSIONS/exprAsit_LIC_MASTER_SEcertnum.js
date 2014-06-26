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
    vMainCtrl = expression.getValue("ASIT::SPORTSMAN EDUCATION::Certificate Number");
    var vState = expression.getValue("ASIT::SPORTSMAN EDUCATION::State");
    var vCertDate = expression.getValue("ASIT::SPORTSMAN EDUCATION::Certification Date");
    var vTform = expression.getValue("ASIT::SPORTSMAN EDUCATION::State");
    var allMsg = '';
    var msg = '';

    for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
        vTform = expression.getValue(rowIndex, "ASIT::SPORTSMAN EDUCATION::FORM");
        vMainCtrl = expression.getValue(rowIndex, "ASIT::SPORTSMAN EDUCATION::Certificate Number");
        vState = expression.getValue(rowIndex, "ASIT::SPORTSMAN EDUCATION::State");
        vCertDate = expression.getValue(rowIndex, "ASIT::SPORTSMAN EDUCATION::Certification Date");
        var oToday = expression.getValue("$$today$$");


        var isValid = true;
        if (vState.value == 'NY') {
            isValid = isValidCertificateNum(vMainCtrl.value);
        }

        msg = '';
        if (!isValid) {
            msg = "Please enter valid certificate number.";
        }
        vMainCtrl.message = msg;
        expression.setReturn(rowIndex, vMainCtrl);

        msg = "Certification Date cannot be after today's date";
        if (vCertDate.getValue()) {
            vCertDate.message = diffDate(oToday.getValue(), vCertDate.getValue()) > 0 ? msg : '';
            expression.setReturn(rowIndex, vCertDate);
        }
        //code started
        if (vCertDate.getValue()) {
            var asiValDate = new Date(vCertDate.getValue());
            var cDate = new Date();
            cDate.setFullYear(cDate.getFullYear() - 75);
            if (asiValDate <= cDate) {
                msg = "Certification Date is incorrect.";
                vCertDate.message = msg;
                expression.setReturn(rowIndex, vCertDate);
            }
        }
        //code ended

    }
}
catch (err) {
    vMainCtrl = expression.getValue("ASIT::SPORTSMAN EDUCATION::Certificate Number");
    vMainCtrl.message = "An error occured in expression valid dates : " + err.message;
    expression.setReturn(expression.getTotalRowCount(), vMainCtrl);
}