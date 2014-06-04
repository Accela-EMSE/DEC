var aa = expression.getScriptRoot();

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_EXPRESSIONS"));

function diffDate(iDate1, iDate2) {
    return expression.diffDate(iDate1, iDate2);
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var isNew = (sCapStatus.value != null && sCapStatus.value.equals(String("")));
var isCapClosed = (sCapStatus.value != null && sCapStatus.value.equals(String("Closed")));

if (!(isNew || isCapClosed)) {
    var oOpenDt = expression.getValue("ASI::CONFIGURATION::Open Date");
    var oCloseDt = expression.getValue("ASI::CONFIGURATION::Close Date");

    var totalRowCount = expression.getTotalRowCount();

    if (isNull(oOpenDt.value, '') != '' && isNull(oCloseDt.value, '') != '') {
        var msg = "Close date cannot be prior to open date";
        oCloseDt.message = diffDate(oOpenDt.getValue(), oCloseDt.getValue()) < 0 ? msg : '';
    } else {
        oCloseDt.message = '';
    }
    oCloseDt.required = true;
    expression.setReturn(oCloseDt);
}
