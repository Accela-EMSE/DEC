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

function diffDate(iDate1, iDate2) {
    return expression.diffDate(iDate1, iDate2);
}

//Read Qualifier variables : Assumtion variables are loaded using contact page flow onsubmit 
var aYear = expression.getValue("ASI::GENERAL INFORMATION::License Year");
var aemail = expression.getValue("ASI::INTERNAL USE::A_email");
var abirthDate = expression.getValue("ASI::INTERNAL USE::A_birthDate");
var aIsNYResident = expression.getValue("ASI::INTERNAL USE::A_IsNYResident");
var aPreferencePoints = expression.getValue("ASI::INTERNAL USE::A_Preference_Points");
var aIsMilitaryServiceman = expression.getValue("ASI::INTERNAL USE::A_Military Serviceman");
var aIsLegallyBlind = expression.getValue("ASI::INTERNAL USE::A_Legally Blind");
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
var aPermanentDisability = expression.getValue("ASI::INTERNAL USE::A_Permanent Disability");
var aDriverLicenseState = expression.getValue("ASI::INTERNAL USE::A_Driver_License_State");
var aDriverLicenseNumber = expression.getValue("ASI::INTERNAL USE::A_Driver_License_Number");
var aNonDriverLicenseNumber = expression.getValue("ASI::INTERNAL USE::A_Non_Driver_License_Number");
var vUserID = expression.getValue("$$userID$$");
var sUserIdEB = vUserID.getValue();
var oRecordType=expression.getValue("CAP::capType");


//Init 
var f = new form_OBJECT(GS2_EXPR, OPTZ_TYPE_ALLFEES);

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
f.DriverLicenseState = aDriverLicenseState.value;
f.DriverLicenseNumber = aDriverLicenseNumber.value;
f.NonDriverLicenseNumber = aNonDriverLicenseNumber.value;
f.SetEnforcementAttrib(aSuspended.value, aRevokedHunting.value, aRevokedTrapping.value, aRevokedFishing.value);
f.SetFulfillmentAttrib(aAgedIn.value, aNeedHuntEd.value);
f.FromACA = aIsFromACA.value;
f.UserIdEB = sUserIdEB;
f.RecordType = oRecordType.getValue();
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

////Set Lic availablity using lic array from app object
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
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Add Lifetime to Driver License");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Add Lifetime to Driver License Re-Issue Immediately");
myLicObj[myLicObj.length] = expression.getValue("ASI::LIFETIME LICENSES::Add Lifetime to Driver License on Renewal");
////

//
var oHuntDmpApp = expression.getValue("ASI::HUNTING LICENSE::Deer Management Permit");
var isHuntDmpApp = ((oHuntDmpApp.value != null && (oHuntDmpApp.value.equalsIgnoreCase('YES') || oHuntDmpApp.value.equalsIgnoreCase('Y') || oHuntDmpApp.value.equalsIgnoreCase('CHECKED') || oHuntDmpApp.value.equalsIgnoreCase('SELECTED') || oHuntDmpApp.value.equalsIgnoreCase('TRUE') || oHuntDmpApp.value.equalsIgnoreCase('ON'))));

var vPreferencePoints = expression.getValue("ASI::HUNTING LICENSE::Preference Points");
var oHWmuChoice1 = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 1");
var oHWmuChoice2 = expression.getValue("ASI::HUNTING LICENSE::WMU Choice 2");
var oApplyLO1 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice1");
var oApplyLO2 = expression.getValue("ASI::HUNTING LICENSE::Apply Land Owner for Choice2");

vPreferencePoints.readOnly = true;
vPreferencePoints.hidden = !isHuntDmpApp;
expression.setReturn(vPreferencePoints);

oHWmuChoice1.required = isHuntDmpApp;
//oHWmuChoice1.readOnly = !isHuntDmpApp;
oHWmuChoice1.hidden = !isHuntDmpApp;
expression.setReturn(oHWmuChoice1);

oHWmuChoice2.required = isHuntDmpApp;
//oHWmuChoice2.readOnly = !isHuntDmpApp;
oHWmuChoice2.hidden = !isHuntDmpApp;
expression.setReturn(oHWmuChoice2);

//oApplyLO1.readOnly = !isHuntDmpApp;
oApplyLO1.hidden = !isHuntDmpApp && f.currDrawType != DRAW_FCFS;
expression.setReturn(oApplyLO1);

//oApplyLO2.readOnly = !isHuntDmpApp;
oApplyLO2.hidden = !isHuntDmpApp && f.currDrawType != DRAW_FCFS;
expression.setReturn(oApplyLO2);
////

//
var oHExplanation = expression.getValue("ASI::HUNTING LICENSE::Explanation");
oHExplanation.value = f.MessageHunter;
oHExplanation.readOnly = true;
if (f.MessageHunter == "") {
    oHExplanation.hidden = true;
}
if (f.ContactMsgLink_Hunt != "") {
    oHExplanation.message = f.ContactMsgLink_Hunt;
}
expression.setReturn(oHExplanation);

var oFExplanation = expression.getValue("ASI::FISHING LICENSES::Explanation");
oFExplanation.value = f.MessageFish;
oFExplanation.readOnly = true;
if (f.MessageFish == "") {
    oFExplanation.hidden = true;
}
if (f.ContactMsgLink_Fish != "") {
    oHExplanation.message = f.ContactMsgLink_Fish;
}
expression.setReturn(oFExplanation);

var oLExplanation = expression.getValue("ASI::LIFETIME LICENSES::Explanation");
oLExplanation.value = String(f.MessageLifeTime);
oLExplanation.readOnly = true;
if (f.MessageLifeTime == "") {
    oLExplanation.hidden = true;
}
if (f.ContactMsgLink_Lifetime != "") {
    oHExplanation.message = f.ContactMsgLink_Lifetime;
}
expression.setReturn(oLExplanation);
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

//
var oFreshWtrFishLic = expression.getValue("ASI::FISHING LICENSES::Freshwater Fishing");
var oNonFreshWtrFishLic = expression.getValue("ASI::FISHING LICENSES::NonRes Freshwater Fishing");
var oFish1Day = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
var oNonresFish1Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");
var oFish7Day = expression.getValue("ASI::FISHING LICENSES::Seven Day Fishing License");
var oNonResFish7Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 7 Day Fishing");

var isFreshWtrFishLic = ((oFreshWtrFishLic.value != null && (oFreshWtrFishLic.value.equalsIgnoreCase('YES') || oFreshWtrFishLic.value.equalsIgnoreCase('Y') || oFreshWtrFishLic.value.equalsIgnoreCase('CHECKED') || oFreshWtrFishLic.value.equalsIgnoreCase('SELECTED') || oFreshWtrFishLic.value.equalsIgnoreCase('TRUE') || oFreshWtrFishLic.value.equalsIgnoreCase('ON'))));
var isNonFreshWtrFishLic = ((oNonFreshWtrFishLic.value != null && (oNonFreshWtrFishLic.value.equalsIgnoreCase('YES') || oNonFreshWtrFishLic.value.equalsIgnoreCase('Y') || oNonFreshWtrFishLic.value.equalsIgnoreCase('CHECKED') || oNonFreshWtrFishLic.value.equalsIgnoreCase('SELECTED') || oNonFreshWtrFishLic.value.equalsIgnoreCase('TRUE') || oNonFreshWtrFishLic.value.equalsIgnoreCase('ON'))));

var oFishEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date Fishing");

if (f.isAfterSwitchDate()) {
	oFishEffDt.hidden = !isFreshWtrFishLic && !isNonFreshWtrFishLic;
	oFishEffDt.required = !(!isFreshWtrFishLic && !isNonFreshWtrFishLic);
} else {
	oFishEffDt.hidden = true;
}
if (!isFreshWtrFishLic && !isNonFreshWtrFishLic) {
    oFishEffDt.value = '';
}
expression.setReturn(oFishEffDt);
////
var oToday = expression.getValue("$$today$$");
var isDD7 = true; 
var isDD1 = true; 

if(oFishEffDt.getValue() != null && oFishEffDt.getValue() != '') {
	var dd =  diffDate(oToday.getValue(), oFishEffDt.getValue());
	isDD7 = (dd >= 7); 
	isDD1 = (dd > 0); 
}

oFish1Day.hidden = !isDD1;
if(!isDD1){
	oFish1Day.value = false;
}
expression.setReturn(oFish1Day);

oNonresFish1Day.hidden = !isDD1;
if(!isDD1){
	oNonresFish1Day.value = false;
}
expression.setReturn(oNonresFish1Day);

oFish7Day.hidden = !isDD7;
if(!isDD7){
	oFish7Day.value = false;
}
expression.setReturn(oFish7Day);

oNonResFish7Day.hidden = !isDD7;
if(!isDD7){
	oNonResFish7Day.value = false;
}
expression.setReturn(oNonResFish7Day);

//
var isFish1Day = ((oFish1Day.value != null && (oFish1Day.value.equalsIgnoreCase('YES') || oFish1Day.value.equalsIgnoreCase('Y') || oFish1Day.value.equalsIgnoreCase('CHECKED') || oFish1Day.value.equalsIgnoreCase('SELECTED') || oFish1Day.value.equalsIgnoreCase('TRUE') || oFish1Day.value.equalsIgnoreCase('ON'))));
var isNonResFish1Day = ((oNonresFish1Day.value != null && (oNonresFish1Day.value.equalsIgnoreCase('YES') || oNonresFish1Day.value.equalsIgnoreCase('Y') || oNonresFish1Day.value.equalsIgnoreCase('CHECKED') || oNonresFish1Day.value.equalsIgnoreCase('SELECTED') || oNonresFish1Day.value.equalsIgnoreCase('TRUE') || oNonresFish1Day.value.equalsIgnoreCase('ON'))));
var o1DayEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date One Day Fishing");

o1DayEffDt.required = !(!isFish1Day && !isNonResFish1Day);
//o1DayEffDt.readOnly = !isFish1Day && !isNonResFish1Day;
o1DayEffDt.hidden = !isFish1Day && !isNonResFish1Day;
if (!isFish1Day && !isNonResFish1Day) {
    o1DayEffDt.value = '';
}
expression.setReturn(o1DayEffDt);
////

//
var isFish7Day = ((oFish7Day.value != null && (oFish7Day.value.equalsIgnoreCase('YES') || oFish7Day.value.equalsIgnoreCase('Y') || oFish7Day.value.equalsIgnoreCase('CHECKED') || oFish7Day.value.equalsIgnoreCase('SELECTED') || oFish7Day.value.equalsIgnoreCase('TRUE') || oFish7Day.value.equalsIgnoreCase('ON'))));
var isNonResFish7Day = ((oNonResFish7Day.value != null && (oNonResFish7Day.value.equalsIgnoreCase('YES') || oNonResFish7Day.value.equalsIgnoreCase('Y') || oNonResFish7Day.value.equalsIgnoreCase('CHECKED') || oNonResFish7Day.value.equalsIgnoreCase('SELECTED') || oNonResFish7Day.value.equalsIgnoreCase('TRUE') || oNonResFish7Day.value.equalsIgnoreCase('ON'))));
var o7DayEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date Seven Day Fishing");

o7DayEffDt.required = !(!isFish7Day && !isNonResFish7Day);
//o7DayEffDt.readOnly = !isFish7Day && !isNonResFish7Day;
o7DayEffDt.hidden = !isFish7Day && !isNonResFish7Day;
if (!isFish7Day && !isNonResFish7Day) {
    o7DayEffDt.value = '';
}
expression.setReturn(o7DayEffDt);
////

//
var oMarineReg = expression.getValue("ASI::FISHING LICENSES::Marine Registry");
var oMarineEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date Marine");
var isMarineReg = ((oMarineReg.value != null && (oMarineReg.value.equalsIgnoreCase('YES') || oMarineReg.value.equalsIgnoreCase('Y') || oMarineReg.value.equalsIgnoreCase('CHECKED') || oMarineReg.value.equalsIgnoreCase('SELECTED') || oMarineReg.value.equalsIgnoreCase('TRUE') || oMarineReg.value.equalsIgnoreCase('ON'))));


if (f.isAfterSwitchDate()) {
	oMarineEffDt.hidden = !isMarineReg;
	oMarineEffDt.required = isMarineReg;
} else {
	oMarineEffDt.hidden = true;
}
if (!isMarineReg) {
	oMarineEffDt.value = '';
}
expression.setReturn(oMarineEffDt);
////

//
var oConsrvMagz = expression.getValue("ASI::OTHER SALES::Conservationist Magazine");
var oQtyConsrvMagz = expression.getValue("ASI::OTHER SALES::Quantity Conservationist Magazine");
var oConsrvPatron = expression.getValue("ASI::OTHER SALES::Conservation Patron");
var oQtyConsrvPatron = expression.getValue("ASI::OTHER SALES::Quantity Conservation Patron");
var oIsGiftOuter = expression.getValue("ASI::MAGAZINE SUBSCRIBER::Is magzine subscription a gift?");

var isYesConsrvMagz = ((oConsrvMagz.value != null && (oConsrvMagz.value.equalsIgnoreCase('YES') || oConsrvMagz.value.equalsIgnoreCase('Y') || oConsrvMagz.value.equalsIgnoreCase('CHECKED') || oConsrvMagz.value.equalsIgnoreCase('SELECTED') || oConsrvMagz.value.equalsIgnoreCase('TRUE') || oConsrvMagz.value.equalsIgnoreCase('ON'))));
var isYesConsrvPatron = ((oConsrvPatron.value != null && (oConsrvPatron.value.equalsIgnoreCase('YES') || oConsrvPatron.value.equalsIgnoreCase('Y') || oConsrvPatron.value.equalsIgnoreCase('CHECKED') || oConsrvPatron.value.equalsIgnoreCase('SELECTED') || oConsrvPatron.value.equalsIgnoreCase('TRUE') || oConsrvPatron.value.equalsIgnoreCase('ON'))));

oQtyConsrvMagz.required = false; // isYesConsrvMagz;
//oQtyConsrvMagz.readOnly = !isYesConsrvMagz;
oQtyConsrvMagz.hidden = true; //!isYesConsrvMagz;
if (!isYesConsrvMagz) {
    oQtyConsrvMagz.value = '';
}
else if (isYesConsrvMagz && oQtyConsrvMagz.value == '') {
    oQtyConsrvMagz.value = '1';
}
expression.setReturn(oQtyConsrvMagz);

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

if (!isYesConsrvMagz && !isYesConsrvPatron) {
    oIsGiftOuter.value = null;
} else if (oIsGiftOuter.value == null) {
    oIsGiftOuter.value = "No";
}
//oIsGiftOuter.readOnly = (!isYesConsrvMagz && !isYesConsrvPatron);
oIsGiftOuter.hidden = (!isYesConsrvMagz && !isYesConsrvPatron);
expression.setReturn(oIsGiftOuter);

enabledisableMagazineSubScriber();
////

var oLtIncription = expression.getValue("ASI::LIFETIME LICENSES::Lifetime Inscription");
var oLtIncriptionText = expression.getValue("ASI::LIFETIME LICENSES::Inscription");

var isLtIncription = ((oLtIncription.value != null && (oLtIncription.value.equalsIgnoreCase('YES') || oLtIncription.value.equalsIgnoreCase('Y') || oLtIncription.value.equalsIgnoreCase('CHECKED') || oLtIncription.value.equalsIgnoreCase('SELECTED') || oLtIncription.value.equalsIgnoreCase('TRUE') || oLtIncription.value.equalsIgnoreCase('ON'))));

//oLtIncriptionText.readOnly = !isLtIncription;
oLtIncriptionText.hidden = !isLtIncription;
oLtIncriptionText.required = isLtIncription;
if (!isLtIncription) {
    oLtIncriptionText.value = '';
}
expression.setReturn(oLtIncriptionText);
////