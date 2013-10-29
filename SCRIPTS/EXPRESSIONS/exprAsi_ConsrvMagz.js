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
}

var oConsrvMagz = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
var oQtyConsrvMagz = expression.getValue("ASI::OTHER SALES::Quantity Conservationist Magazine");
var oConsrvPatron = expression.getValue("ASI::OTHER SALES::Conservation Patron");
var oIsGiftOuter = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Is magzine subscription a gift?");

var isYesConsrvMagz = ((oConsrvMagz.value != null && (oConsrvMagz.value.equalsIgnoreCase('YES') || oConsrvMagz.value.equalsIgnoreCase('Y') || oConsrvMagz.value.equalsIgnoreCase('CHECKED') || oConsrvMagz.value.equalsIgnoreCase('SELECTED') || oConsrvMagz.value.equalsIgnoreCase('TRUE') || oConsrvMagz.value.equalsIgnoreCase('ON'))));
var isYesConsrvPatron = ((oConsrvPatron.value != null && (oConsrvPatron.value.equalsIgnoreCase('YES') || oConsrvPatron.value.equalsIgnoreCase('Y') || oConsrvPatron.value.equalsIgnoreCase('CHECKED') || oConsrvPatron.value.equalsIgnoreCase('SELECTED') || oConsrvPatron.value.equalsIgnoreCase('TRUE') || oConsrvPatron.value.equalsIgnoreCase('ON'))));

oQtyConsrvMagz.required = false; //isYesConsrvMagz;
//oQtyConsrvMagz.readOnly = !isYesConsrvMagz;
oQtyConsrvMagz.hidden = true; //!isYesConsrvMagz;
if (!isYesConsrvMagz) {
    oQtyConsrvMagz.value = '';
}
else if (isYesConsrvMagz && oQtyConsrvMagz.value == '') {
    oQtyConsrvMagz.value = '1';
}
expression.setReturn(oQtyConsrvMagz);

if (!isYesConsrvMagz && !isYesConsrvPatron) {
    oIsGiftOuter.value = null;
} else if (oIsGiftOuter.value == null) {
    oIsGiftOuter.value = "No";
}
//oIsGiftOuter.readOnly = (!isYesConsrvMagz && !isYesConsrvPatron);
//oIsGiftOuter.hidden = (!isYesConsrvMagz && !isYesConsrvPatron);
oIsGiftOuter.hidden = (!isYesConsrvMagz);
expression.setReturn(oIsGiftOuter);

enabledisableMagazineSubScriber();
////

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

//Read Qualifier variables : Assumtion variables are loaded using contact page flow onsubmit 
var aYear = expression.getValue("ASI::GENERAL INFORMATION::License Year");
var aemail = expression.getValue("ASI::INTERNAL USE::A_email");
var abirthDate = expression.getValue("ASI::INTERNAL USE::A_birthDate");
var aIsNYResident = expression.getValue("ASI::INTERNAL USE::A_IsNYResident");
var aPreferencePoints = expression.getValue("ASI::INTERNAL USE::A_Preference_Points");
var aIsMilitaryServiceman = expression.getValue("ASI::MILITARY ACTIVE SERVICE STATUS::Military Serviceman");
var aIsLegallyBlind = expression.getValue("ASI::APPEARANCE::Legally Blind");
var aPreviousLicense = expression.getValue("ASI::INTERNAL USE::A_Previous_License");
var aSportsmanEducation = expression.getValue("ASI::INTERNAL USE::A_Sportsman_Education");
var aLandOwnerInformation = expression.getValue("ASI::INTERNAL USE::A_Land_Owner_Information");
var aAnnualDisability = expression.getValue("ASI::INTERNAL USE::A_Annual_Disability");
var aIsNativeAmerican = expression.getValue("ASI::INTERNAL USE::A_IsNativeAmerican");
var aIsFromACA = expression.getValue("ASI::INTERNAL USE::A_FromACA");
var aQuantity_Trail_Supporter_Patch = expression.getValue("ASI::OTHER SALES::Quantity Trail Supporter Patch");
var aQuantity_Venison_Donation = expression.getValue("ASI::OTHER SALES::Quantity Venison Donation");
var aQuantity_Conservation_Patron = expression.getValue("ASI::OTHER SALES::Quantity Conservation Patron");
var aQuantity_Conservation_Fund = expression.getValue("ASI::OTHER SALES::Quantity Conservation Fund");
var aQuantity_Conservationist_Magazine = expression.getValue("ASI::OTHER SALES::Quantity Conservationist Magazine");
var aQuantity_Habitat_Stamp = expression.getValue("ASI::OTHER SALES::Quantity Habitat/Access Stamp");
var aActiveHoldings = expression.getValue("ASI::INTERNAL USE::A_ActiveHoldings");
var aSuspended = expression.getValue("ASI::INTERNAL USE::A_Suspended");
var aAgedIn = expression.getValue("ASI::INTERNAL USE::A_AgedIn");
var aNeedHuntEd = expression.getValue("ASI::INTERNAL USE::A_NeedHuntEd");
var aRevokedHunting = expression.getValue("ASI::INTERNAL USE::A_Revoked_Hunting");
var aRevokedTrapping = expression.getValue("ASI::INTERNAL USE::A_Revoked_Trapping");
var aRevokedFishing = expression.getValue("ASI::INTERNAL USE::A_Revoked_Fishing");
var aPermanentDisability = expression.getValue("ASI::APPEARANCE::Permanent Disability");
var vUserID = expression.getValue("$$userID$$");
var sUserIdEB = vUserID.getValue();

//Init 
var f = new form_OBJECT(GS2_EXPR);
f.Year = aYear.value;
f.DOB = abirthDate.value;
f.Email = aemail.value;
f.IsNyResiDent = aIsNYResident.value;
f.IsMilitaryServiceman = aIsMilitaryServiceman.value;
f.IsLegallyBlind = aIsLegallyBlind.value;
f.IsNativeAmerican = (aIsNativeAmerican.value);
f.PreferencePoints = aPreferencePoints.value;
f.SetAnnualDisability(aAnnualDisability.value);
f.SetPriorLicense(aPreviousLicense.value);
f.SetSportsmanEducation(aSportsmanEducation.value);
f.SetLandOwnerInfo(aLandOwnerInformation.value);
f.Quantity_Trail_Supporter_Patch = aQuantity_Trail_Supporter_Patch.value
f.Quantity_Venison_Donation = aQuantity_Venison_Donation.value
f.Quantity_Conservation_Patron = aQuantity_Conservation_Patron.value
f.Quantity_Conservation_Fund = aQuantity_Conservation_Fund.value
f.Quantity_Conservationist_Magazine = aQuantity_Conservationist_Magazine.value
f.Quantity_Habitat_Stamp = aQuantity_Habitat_Stamp.value
f.IsPermanentDisabled = aPermanentDisability.value;
f.SetActiveHoldingsInfo(aActiveHoldings.value);
f.SetEnforcementAttrib(aSuspended.value, aRevokedHunting.value, aRevokedTrapping.value, aRevokedFishing.value);
f.SetFulfillmentAttrib(aAgedIn.value, aNeedHuntEd.value);
f.FromACA = aIsFromACA.value;
f.UserIdEB = sUserIdEB;
//

//Set control array and set values for lic
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

//Call rules
f.ExecuteBoRuleEngine();
////

//conrol Refeshment to commit applied settings
var myLicObj = new Array();
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Junior Hunting Tags");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Marine Registry");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Bowhunting Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Deer Management Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Hunting License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Muzzleloading Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Turkey Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Bowhunting");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Muzzleloading");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Small & Big Game");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Sportsman");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Trapping");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Trapping License");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Habitat/Access Stamp");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Venison Donation");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Conservation Fund");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Trail Supporter Patch");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Conservation Patron");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Freshwater Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::NonRes Freshwater Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Nonresident 7 Day Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Seven Day Fishing License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Conservation Legacy");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Junior Bowhunting");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Junior Hunting");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::NonRes Muzzleloading");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::NonRes Super Sportsman");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Nonresident Bear Tag");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Nonresident Big Game");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Nonresident Bowhunting");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Nonresident Small Game");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Nonresident Turkey");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Small and Big Game");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Small Game");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Sportsman");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Super Sportsman");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Nonresident Trapping");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Trapper Super Sportsman");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Lifetime Card Replace");
myLicObj[myLicObj.length] = expression.getValue("ASI::OTHER SALES::Sportsman Ed Certification");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Inscription");
////

