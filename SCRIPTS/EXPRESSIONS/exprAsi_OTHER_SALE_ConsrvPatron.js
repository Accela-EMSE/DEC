function enabledisableMagazineSubScriber() {
    var oAddr1 = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Address Line 1");
    var oAddr2 = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Address Line 2");
    var oCity = expression.getValue("ASI::MAGAZINE SUBSCRIBER::City");
    var oFirstName = expression.getValue("ASI::MAGAZINE SUBSCRIBER::First Name");
    var oLastName = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Last Name");
    var oMI = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Middle Name");
    var oState = expression.getValue("ASI::MAGAZINE SUBSCRIBER::State");
    var oZip = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Zip");
    var oZip4 = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Zip + 4");

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
}


var isGift = false;
var oConsrvMagz = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
var oConsrvPatron = expression.getValue("ASI::OTHER SALES::Conservation Patron");
var oQtyConsrvPatron = expression.getValue("ASI::OTHER SALES::Quantity Conservation Patron");

var isYesConsrvMagz = ((oConsrvMagz.value != null && (oConsrvMagz.value.equalsIgnoreCase('YES') || oConsrvMagz.value.equalsIgnoreCase('Y') || oConsrvMagz.value.equalsIgnoreCase('CHECKED') || oConsrvMagz.value.equalsIgnoreCase('SELECTED') || oConsrvMagz.value.equalsIgnoreCase('TRUE') || oConsrvMagz.value.equalsIgnoreCase('ON'))));
var isYesConsrvPatron = ((oConsrvPatron.value != null && (oConsrvPatron.value.equalsIgnoreCase('YES') || oConsrvPatron.value.equalsIgnoreCase('Y') || oConsrvPatron.value.equalsIgnoreCase('CHECKED') || oConsrvPatron.value.equalsIgnoreCase('SELECTED') || oConsrvPatron.value.equalsIgnoreCase('TRUE') || oConsrvPatron.value.equalsIgnoreCase('ON'))));

//oQtyConsrvPatron.required = isYesConsrvPatron;
//oQtyConsrvPatron.hidden = !isYesConsrvPatron;
oQtyConsrvPatron.required = false;
oQtyConsrvPatron.hidden = true;
if (!isYesConsrvPatron) {
    oQtyConsrvPatron.value = '';
}
else if (isYesConsrvPatron && oQtyConsrvPatron.value == '') {
    oQtyConsrvPatron.value = '1';
}
expression.setReturn(oQtyConsrvPatron);

isGift = isYesConsrvMagz || isYesConsrvPatron;
enabledisableMagazineSubScriber();
////
