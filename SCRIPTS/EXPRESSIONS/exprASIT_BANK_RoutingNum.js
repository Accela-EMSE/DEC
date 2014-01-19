var toPrecision = function (value) {
    var multiplier = 10000;
    return Math.round(value * multiplier) / multiplier;
}
function addDate(iDate, nDays) {
    if (isNaN(nDays)) {
        throw ("Day is a invalid number!");
    }
    return expression.addDate(iDate, parseInt(nDays));
}

function diffDate(iDate1, iDate2) {
    return expression.diffDate(iDate1, iDate2);
}

function parseDate(dateString) {
    return expression.parseDate(dateString);
}

function formatDate(dateString, pattern) {
    if (dateString == null || dateString == '') {
        return '';
    }
    return expression.formatDate(dateString, pattern);
}

function isValidPositiveNum(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^[0-9]+$/;

        isvalid = (pattern.test(inputvalue));
    }
    return isvalid;
}
var servProvCode = expression.getValue("$$servProvCode$$").value;
var variable0 = expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Routing Transit Number");
var variable1 = expression.getValue("REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::FORM");

var totalRowCount = expression.getTotalRowCount();
for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
    variable1 = expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::FORM");
    variable0 = expression.getValue(rowIndex, "REFCONTACTTPLTABLE::AGNT_TABLES::BANK INFORMATION::Routing Transit Number");

    if (variable0.value != null) {
        var val = variable0.value + "";
        var msg = "";
        if (!(val.length == 9)) {
            msg = "Please enter 9 digit number";
        }
        if (msg == '') {
            if (!isValidPositiveNum(val)) {
                msg = "Please enter non negative integer number";
            }
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
