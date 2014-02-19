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

var servProvCode = expression.getValue("$$servProvCode$$").value;
var oAddr1 = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Address Line 1");
var oAddr2 = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Address Line 2");
var oCity = expression.getValue("ASI::MAGAZINE SUBSCRIBER::City");
var oFirstName = expression.getValue("ASI::MAGAZINE SUBSCRIBER::First Name");
var oLastName = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Last Name");
var oMI = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Middle Name");
var oState = expression.getValue("ASI::MAGAZINE SUBSCRIBER::State");
var oZip = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Zip");
var oZip4 = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Zip + 4");
var oIsGift = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Is magzine subscription a gift?");

var isGift = oIsGift.value.equalsIgnoreCase('YES');

oAddr1.hidden = !isGift;
oAddr1.required = isGift;
//oAddr1.readOnly = !isGift;
expression.setReturn(oAddr1);

oAddr2.hidden = !isGift;
//oAddr2.readOnly = !isGift;
expression.setReturn(oAddr2);

oCity.hidden = !isGift;
oCity.required = isGift;
//oCity.readOnly = !isGift;
expression.setReturn(oCity);

oFirstName.hidden = !isGift;
oFirstName.required = isGift;
//oFirstName.readOnly = !isGift;
expression.setReturn(oFirstName);

oLastName.hidden = !isGift;
oLastName.required = isGift;
//oLastName.readOnly = !isGift;
expression.setReturn(oLastName);

oMI.hidden = !isGift;
//oMI.readOnly = !isGift;
expression.setReturn(oMI);

oState.hidden = !isGift;
oState.required = isGift;
//oState.readOnly = !isGift;
expression.setReturn(oState);

oZip.hidden = !isGift;
oZip.required = isGift;
//oZip.readOnly = !isGift;
expression.setReturn(oZip);

oZip4.hidden = !isGift;
//oZip4.readOnly = !isGift;
expression.setReturn(oZip4);
