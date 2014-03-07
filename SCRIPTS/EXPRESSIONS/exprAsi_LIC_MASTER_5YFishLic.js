var servProvCode = expression.getValue("$$servProvCode$$").value;
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

////
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

////Set Lic availablity using lic array from app object
for (var idx = 0; idx < f.licObjARRAY.length; idx++) {
    //var oTemp = new License_OBJ();
    var oLic = f.licObjARRAY[idx];

    if (f.licObjARRAY[idx].IsSelectable == false || f.licObjARRAY[idx].IsActive == false) {
        //(exprControlArray[idx]).readOnly = true;
        (exprControlArray[idx]).value = false;
        (exprControlArray[idx]).hidden = true;
    } else {
        (exprControlArray[idx]).readOnly = f.licObjARRAY[idx].IsDisabled;
        (exprControlArray[idx]).hidden = false;
    }
    expression.setReturn((exprControlArray[idx]));
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
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Hunting License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Hunting License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Bowhunting Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Bowhunting Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Muzzleloading Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Muzzleloading Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Trapping License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Trapping License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Turkey Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Turkey Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::3 Year Freshwater Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::5 Year Freshwater Fishing");
////

//
var oFreshWtrFishLic = expression.getValue("ASI::FISHING LICENSES::Freshwater Fishing");
var o3YFishLic = expression.getValue("ASI::FISHING LICENSES::3 Year Freshwater Fishing");
var o5YFishLic = expression.getValue("ASI::FISHING LICENSES::5 Year Freshwater Fishing");
var oNonFreshWtrFishLic = expression.getValue("ASI::FISHING LICENSES::NonRes Freshwater Fishing");
var oFish1Day = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
var oNonresFish1Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");
var oFish7Day = expression.getValue("ASI::FISHING LICENSES::Seven Day Fishing License");
var oNonResFish7Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 7 Day Fishing");

var isFreshWtrFishLic = ((oFreshWtrFishLic.value != null && (oFreshWtrFishLic.value.equalsIgnoreCase('YES') || oFreshWtrFishLic.value.equalsIgnoreCase('Y') || oFreshWtrFishLic.value.equalsIgnoreCase('CHECKED') || oFreshWtrFishLic.value.equalsIgnoreCase('SELECTED') || oFreshWtrFishLic.value.equalsIgnoreCase('TRUE') || oFreshWtrFishLic.value.equalsIgnoreCase('ON'))));
var isNonFreshWtrFishLic = ((oNonFreshWtrFishLic.value != null && (oNonFreshWtrFishLic.value.equalsIgnoreCase('YES') || oNonFreshWtrFishLic.value.equalsIgnoreCase('Y') || oNonFreshWtrFishLic.value.equalsIgnoreCase('CHECKED') || oNonFreshWtrFishLic.value.equalsIgnoreCase('SELECTED') || oNonFreshWtrFishLic.value.equalsIgnoreCase('TRUE') || oNonFreshWtrFishLic.value.equalsIgnoreCase('ON'))));
var is3YFishLic = ((o3YFishLic.value != null && (o3YFishLic.value.equalsIgnoreCase('YES') || o3YFishLic.value.equalsIgnoreCase('Y') || o3YFishLic.value.equalsIgnoreCase('CHECKED') || o3YFishLic.value.equalsIgnoreCase('SELECTED') || o3YFishLic.value.equalsIgnoreCase('TRUE') || o3YFishLic.value.equalsIgnoreCase('ON'))));
var is5YFishLic = ((o5YFishLic.value != null && (o5YFishLic.value.equalsIgnoreCase('YES') || o5YFishLic.value.equalsIgnoreCase('Y') || o5YFishLic.value.equalsIgnoreCase('CHECKED') || o5YFishLic.value.equalsIgnoreCase('SELECTED') || o5YFishLic.value.equalsIgnoreCase('TRUE') || o5YFishLic.value.equalsIgnoreCase('ON'))));

var oFishEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date Fishing");

if (f.isAfterSwitchDate()) {
    oFishEffDt.required = !(!isFreshWtrFishLic && !isNonFreshWtrFishLic && !is3YFishLic && !is5YFishLic);
    //oFishEffDt.readOnly = !isFreshWtrFishLic && !isNonFreshWtrFishLic && !is3YFishLic && !is5YFishLic;
    oFishEffDt.hidden = !isFreshWtrFishLic && !isNonFreshWtrFishLic && !is3YFishLic && !is5YFishLic;
}
else {
    //oFishEffDt.value = expression.getValue("$$today$$").value;
	oFishEffDt.value = '';
	oFishEffDt.hidden = true;
}
if (!isFreshWtrFishLic && !isNonFreshWtrFishLic && !is3YFishLic && !is5YFishLic) {
	oFishEffDt.value = '';
}
expression.setReturn(oFishEffDt);
////

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
