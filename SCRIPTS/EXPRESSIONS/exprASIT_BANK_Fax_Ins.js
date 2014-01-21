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
var variable0 = expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Fax");
var variable1 = expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::FORM");

var totalRowCount = expression.getTotalRowCount() - 1;
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
    variable1 = expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::FORM");
    variable0 = expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Fax");

    if (variable0.value != null) {
        var val = variable0.value;
        var msg = "";
        if (!isValidPhoneNumber(val)) {
            msg = "Please enter valid fax number";
        }
        if (msg != '') {
            variable0.message = msg;
            expression.setReturn(variable0);
            variable1.message = msg;
            variable1.blockSubmit = true;
            expression.setReturn(variable1);
        } else {
            variable0.message = "";
            expression.setReturn(variable0);
        }
    }
}
