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
var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

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
var aQuantity_Trail_Supporter_Patch = expression.getValue("ASI::OTHER SALES::Quantity Trail Supporter Patch");
var aQuantity_Venison_Donation = expression.getValue("ASI::OTHER SALES::Quantity Venison Donation");
var aQuantity_Conservation_Patron = expression.getValue("ASI::OTHER SALES::Quantity Conservation Patron");
var aQuantity_Conservation_Fund = expression.getValue("ASI::OTHER SALES::Quantity Conservation Fund");
var aQuantity_Conservationist_Magazine = expression.getValue("ASI::OTHER SALES::Quantity Conservationist Magazine");
var aQuantity_Habitat_Stamp = expression.getValue("ASI::OTHER SALES::Quantity Habitat/Access Stamp");
var vUserID = expression.getValue("$$userID$$");
var sUserIdEB = vUserID.getValue();

//Init 
var f = new form_OBJECT(GS2_EXPR, OPTZ_TYPE_ALLFEES);
f.Year = "OTHERSALE";
f.Quantity_Trail_Supporter_Patch = aQuantity_Trail_Supporter_Patch.value
f.Quantity_Venison_Donation = aQuantity_Venison_Donation.value
f.Quantity_Conservation_Patron = aQuantity_Conservation_Patron.value
f.Quantity_Conservation_Fund = aQuantity_Conservation_Fund.value
f.Quantity_Conservationist_Magazine = aQuantity_Conservationist_Magazine.value
f.Quantity_Habitat_Stamp = aQuantity_Habitat_Stamp.value
f.FromACA = "Yes";
f.UserIdEB = sUserIdEB;

f.SetOtherSaleExcludes();

////Set control array and set values for lic
var exprControlArray = new Array();
var exprObj;
var isYesExprObj = false;
for (var idx = 0; idx < f.licObjARRAY.length; idx++) {
    exprObj = expression.getValue(f.licObjARRAY[idx].ExprFieldName);
    isYesExprObj = ((exprObj.value != null && (exprObj.value.equalsIgnoreCase('YES') || exprObj.value.equalsIgnoreCase('Y') || exprObj.value.equalsIgnoreCase('CHECKED') || exprObj.value.equalsIgnoreCase('SELECTED') || exprObj.value.equalsIgnoreCase('TRUE') || exprObj.value.equalsIgnoreCase('ON'))));
    f.SetSelected(f.licObjARRAY[idx].Identity, isYesExprObj);
    exprControlArray[exprControlArray.length] = expression.getValue(f.licObjARRAY[idx].ExprFieldName);
}
////

////Call rules
f.ExecuteBoRuleEngine();
//////

//Set Lic availablity using lic array from app object
for (var idx = 0; idx < f.licObjARRAY.length; idx++) {
    //var oTemp = new License_OBJ();
    var oLic = f.licObjARRAY[idx];
    if (f.licObjARRAY[idx].ExprFieldName != "") {
        if (f.licObjARRAY[idx].Message != "") {
            (exprControlArray[idx]).message = f.licObjARRAY[idx].Message;
        }
        if (f.licObjARRAY[idx].IsSelectable == false || f.licObjARRAY[idx].IsActive == false) {
            //(exprControlArray[idx]).readOnly = true;
            (exprControlArray[idx]).value = false;
            (exprControlArray[idx]).hidden = true;
        } else {
            (exprControlArray[idx]).readOnly = f.licObjARRAY[idx].IsDisabled;
            (exprControlArray[idx]).hidden = false;
        }
        if ((exprControlArray[idx]) != "") {
            expression.setReturn((exprControlArray[idx]));
        }
    }
}
//

//conrol Refeshment to commit applied settings
var myLicObj = new Array();
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Habitat/Access Stamp");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Venison Donation");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Conservation Fund");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Trail Supporter Patch");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Conservation Patron");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Lifetime Card Replace");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Sportsman Ed Certification");
////

//
var oVenison = expression.getValue("ASI::OTHER SALES::Venison Donation");
var oQtyVenison = expression.getValue("ASI::OTHER SALES::Quantity Venison Donation");

var isYesVenison = ((oVenison.value != null && (oVenison.value.equalsIgnoreCase('YES') || oVenison.value.equalsIgnoreCase('Y') || oVenison.value.equalsIgnoreCase('CHECKED') || oVenison.value.equalsIgnoreCase('SELECTED') || oVenison.value.equalsIgnoreCase('TRUE') || oVenison.value.equalsIgnoreCase('ON'))));

oQtyVenison.required = isYesVenison;
//oQtyVenison.readOnly = !isYesVenison;
oQtyVenison.hidden = !isYesVenison;
if (!isYesVenison) {
    oQtyVenison.value = '';
}
else if (isYesVenison && oQtyVenison.value == '') {
    oQtyVenison.value = '1';
}
expression.setReturn(oQtyVenison);
////

var oTrailPatch = expression.getValue("ASI::OTHER SALES::Trail Supporter Patch");
var oQtyTrailPatch = expression.getValue("ASI::OTHER SALES::Quantity Trail Supporter Patch");

var isYesTrailPatch = ((oTrailPatch.value != null && (oTrailPatch.value.equalsIgnoreCase('YES') || oTrailPatch.value.equalsIgnoreCase('Y') || oTrailPatch.value.equalsIgnoreCase('CHECKED') || oTrailPatch.value.equalsIgnoreCase('SELECTED') || oTrailPatch.value.equalsIgnoreCase('TRUE') || oTrailPatch.value.equalsIgnoreCase('ON'))));

oQtyTrailPatch.required = isYesTrailPatch;
//oQtyTrailPatch.readOnly = !isYesTrailPatch;
oQtyTrailPatch.hidden = !isYesTrailPatch;
if (!isYesTrailPatch) {
    oQtyTrailPatch.value = '';
}
else if (isYesTrailPatch && oQtyTrailPatch.value == '') {
    oQtyTrailPatch.value = '1';
}

expression.setReturn(oQtyTrailPatch);
////

//
var oHabitat = expression.getValue("ASI::OTHER SALES::Habitat/Access Stamp");
var oQtyHabitat = expression.getValue("ASI::OTHER SALES::Quantity Habitat/Access Stamp");

var isYesHabitat = ((oHabitat.value != null && (oHabitat.value.equalsIgnoreCase('YES') || oHabitat.value.equalsIgnoreCase('Y') || oHabitat.value.equalsIgnoreCase('CHECKED') || oHabitat.value.equalsIgnoreCase('SELECTED') || oHabitat.value.equalsIgnoreCase('TRUE') || oHabitat.value.equalsIgnoreCase('ON'))));

oQtyHabitat.required = isYesHabitat;
//oQtyHabitat.readOnly = !isYesHabitat;
oQtyHabitat.hidden = !isYesHabitat;
if (!isYesHabitat) {
    oQtyHabitat.value = '';
}
else if (isYesHabitat && oQtyHabitat.value == '') {
    oQtyHabitat.value = '1';
}
expression.setReturn(oQtyHabitat);
////

//
var oConservationFund = expression.getValue("ASI::OTHER SALES::Conservation Fund");
var oQtyConservationFund = expression.getValue("ASI::OTHER SALES::Quantity Conservation Fund");

var isYesConservationFund = ((oConservationFund.value != null && (oConservationFund.value.equalsIgnoreCase('YES') || oConservationFund.value.equalsIgnoreCase('Y') || oConservationFund.value.equalsIgnoreCase('CHECKED') || oConservationFund.value.equalsIgnoreCase('SELECTED') || oConservationFund.value.equalsIgnoreCase('TRUE') || oConservationFund.value.equalsIgnoreCase('ON'))));

oQtyConservationFund.required = isYesConservationFund;
//oQtyConservationFund.readOnly = !isYesConservationFund;
oQtyConservationFund.hidden = !isYesConservationFund;
if (!isYesConservationFund) {
    oQtyConservationFund.value = '';
}
else if (isYesConservationFund && oQtyConservationFund.value == '') {
    oQtyConservationFund.value = '1';
}
expression.setReturn(oQtyConservationFund);
////

//
var oConsrvMagz = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
var oQtyConsrvMagz = expression.getValue("ASI::OTHER SALES::Quantity Conservationist Magazine");
var oConsrvPatron = expression.getValue("ASI::OTHER SALES::Conservation Patron");
var oQtyConsrvPatron = expression.getValue("ASI::OTHER SALES::Quantity Conservation Patron");

var isYesConsrvMagz = ((oConsrvMagz.value != null && (oConsrvMagz.value.equalsIgnoreCase('YES') || oConsrvMagz.value.equalsIgnoreCase('Y') || oConsrvMagz.value.equalsIgnoreCase('CHECKED') || oConsrvMagz.value.equalsIgnoreCase('SELECTED') || oConsrvMagz.value.equalsIgnoreCase('TRUE') || oConsrvMagz.value.equalsIgnoreCase('ON'))));
var isYesConsrvPatron = ((oConsrvPatron.value != null && (oConsrvPatron.value.equalsIgnoreCase('YES') || oConsrvPatron.value.equalsIgnoreCase('Y') || oConsrvPatron.value.equalsIgnoreCase('CHECKED') || oConsrvPatron.value.equalsIgnoreCase('SELECTED') || oConsrvPatron.value.equalsIgnoreCase('TRUE') || oConsrvPatron.value.equalsIgnoreCase('ON'))));

//oQtyConsrvMagz.required = isYesConsrvMagz;
//oQtyConsrvMagz.hidden = !isYesConsrvMagz;
oQtyConsrvMagz.required = false;
oQtyConsrvMagz.hidden = true;
if (!isYesConsrvMagz) {
    oQtyConsrvMagz.value = '';
}
else if (isYesConsrvMagz && oQtyConsrvMagz.value == '') {
    oQtyConsrvMagz.value = '1';
}
expression.setReturn(oQtyConsrvMagz);

oQtyConsrvPatron.required = isYesConsrvPatron;
//oQtyConsrvPatron.readOnly = !isYesConsrvPatron;
oQtyConsrvPatron.hidden = !isYesConsrvPatron;
if (!isYesConsrvPatron) {
    oQtyConsrvPatron.value = '';
}
else if (isYesConsrvPatron && oQtyConsrvPatron.value == '') {
    oQtyConsrvPatron.value = '1';
}
expression.setReturn(oQtyConsrvPatron);

var isGift = false;
isGift = isYesConsrvMagz || isYesConsrvPatron;
enabledisableMagazineSubScriber();
////
