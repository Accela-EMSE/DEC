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

var sCapStatus = expression.getValue("CAP::capModel*capStatus");
var isNew = (sCapStatus.value != null && sCapStatus.value.equals(String("")));
var isCapClosed = (sCapStatus.value != null && sCapStatus.value.equals(String("Closed")));

if (isNew || isCapClosed) {
    var oLicenseYear = expression.getValue("ASI::BASIC INFORMATION::License Year");
    var sYear = oLicenseYear.value;
    var isExit = (sYear != null && sYear != '') ? isWmuProcessExists(oLicenseYear.value) : false;

    var oAsiForm = expression.getValue("ASI::FORM");
    var msg = "Note: Process will take 2 to 3 minutes to create all records.";
    if (isExit) {
        msg = "Process is already exist for the year " + sYear;
        oAsiForm.blockSubmit = true;
    }

    oAsiForm.message = msg;
    expression.setReturn(oAsiForm);
}
