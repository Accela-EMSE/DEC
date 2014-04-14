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
var aPreviousLicense = expression.getValue("ASI::INTERNAL USE::A_Previous_License");
var aSportsmanEducation = expression.getValue("ASI::INTERNAL USE::A_Sportsman_Education");
var aLandOwnerInformation = expression.getValue("ASI::INTERNAL USE::A_Land_Owner_Information");
var aAnnualDisability = expression.getValue("ASI::INTERNAL USE::A_Annual_Disability");
var aIsNativeAmerican = expression.getValue("ASI::INTERNAL USE::A_IsNativeAmerican");
var aIsFromACA = expression.getValue("ASI::INTERNAL USE::A_FromACA");
var aActiveHoldings = expression.getValue("ASI::INTERNAL USE::A_ActiveHoldings");
var aSuspended = expression.getValue("ASI::INTERNAL USE::A_Suspended");
var aAgedIn = expression.getValue("ASI::INTERNAL USE::A_AgedIn");
var aNeedHuntEd = expression.getValue("ASI::INTERNAL USE::A_NeedHuntEd");
var aRevokedHunting = expression.getValue("ASI::INTERNAL USE::A_Revoked_Hunting");
var aRevokedTrapping = expression.getValue("ASI::INTERNAL USE::A_Revoked_Trapping");
var aRevokedFishing = expression.getValue("ASI::INTERNAL USE::A_Revoked_Fishing");
var aDriverLicenseState = expression.getValue("ASI::INTERNAL USE::A_Driver_License_State");
var aDriverLicenseNumber = expression.getValue("ASI::INTERNAL USE::A_Driver_License_Number");
var aNonDriverLicenseNumber = expression.getValue("ASI::INTERNAL USE::A_Non_Driver_License_Number");
var aIsMilitaryServiceman = expression.getValue("ASI::INTERNAL USE::A_Military Serviceman");
var aIsLegallyBlind = expression.getValue("ASI::INTERNAL USE::A_Legally Blind");
var aPermanentDisability = expression.getValue("ASI::INTERNAL USE::A_Permanent Disability");
var vUserID = expression.getValue("$$userID$$");
var sUserIdEB = vUserID.getValue();
var oRecordType = expression.getValue("CAP::capType");


//Init 
var f = new form_OBJECT(GS2_EXPR, OPTZ_TYPE_ALLFEES);

f.Year = aYear.value;
f.DOB = abirthDate.value;
f.Email = aemail.value;
f.IsNyResiDent = aIsNYResident.value;
f.IsNativeAmerican = (aIsNativeAmerican.value);
f.PreferencePoints = aPreferencePoints.value;
f.SetAnnualDisability(aAnnualDisability.value);
f.SetPriorLicense(aPreviousLicense.value);
f.SetSportsmanEducation(aSportsmanEducation.value);
f.SetLandOwnerInfo(aLandOwnerInformation.value);
f.SetActiveHoldingsInfo(aActiveHoldings.value);
f.DriverLicenseState = aDriverLicenseState.value;
f.DriverLicenseNumber = aDriverLicenseNumber.value;
f.NonDriverLicenseNumber = aNonDriverLicenseNumber.value;
f.SetEnforcementAttrib(aSuspended.value, aRevokedHunting.value, aRevokedTrapping.value, aRevokedFishing.value);
f.SetFulfillmentAttrib(aAgedIn.value, aNeedHuntEd.value);
f.IsMilitaryServiceman = aIsMilitaryServiceman.value;
f.IsLegallyBlind = aIsLegallyBlind.value;
f.IsPermanentDisabled = aPermanentDisability.value;
f.FromACA = aIsFromACA.value;
f.UserIdEB = sUserIdEB;
f.RecordType = oRecordType.getValue();
//
//Set Fish lience Exclude sale
f.SetFishSaleExcludes();

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
        //if ((exprControlArray[idx]) != "") {
        expression.setReturn((exprControlArray[idx]));
        //}
    }
}
////

//conrol Refeshment to commit applied settings
var myLicObj = new Array();
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Marine Registry");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Freshwater Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Nonresident 7 Day Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Seven Day Fishing License");
////
//
var oFExplanation = expression.getValue("ASI::FISHING LICENSES::Explanation");
oFExplanation.value = f.MessageFish;
oFExplanation.readOnly = true;
if (f.MessageFish == "") {
    oFExplanation.hidden = true;
}
if (f.ContactMsgLink_Fish != "") {
    oFExplanation.message = f.ContactMsgLink_Fish;
}
expression.setReturn(oFExplanation);
////
//

var oFreshWtrFishLic = expression.getValue("ASI::FISHING LICENSES::Freshwater Fishing");
var oFish1Day = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
var oNonresFish1Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");
var oFish7Day = expression.getValue("ASI::FISHING LICENSES::Seven Day Fishing License");
var oNonResFish7Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 7 Day Fishing");

var isFreshWtrFishLic = ((oFreshWtrFishLic.value != null && (oFreshWtrFishLic.value.equalsIgnoreCase('YES') || oFreshWtrFishLic.value.equalsIgnoreCase('Y') || oFreshWtrFishLic.value.equalsIgnoreCase('CHECKED') || oFreshWtrFishLic.value.equalsIgnoreCase('SELECTED') || oFreshWtrFishLic.value.equalsIgnoreCase('TRUE') || oFreshWtrFishLic.value.equalsIgnoreCase('ON'))));
var oFishEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date Fishing");

////
//
if (f.isAfterSwitchDate()) {
    oFishEffDt.hidden = !isFreshWtrFishLic;
    oFishEffDt.required = !(!isFreshWtrFishLic);
} else {
    oFishEffDt.hidden = true;
}
if (!isFreshWtrFishLic) {
    oFishEffDt.value = '';
}
expression.setReturn(oFishEffDt);

var oToday = expression.getValue("$$today$$");
var isDD7 = true;
var isDD1 = true;

if (oFishEffDt.getValue() != null && oFishEffDt.getValue() != '') {
    var dd = diffDate(oToday.getValue(), oFishEffDt.getValue());
    isDD7 = (dd >= 7);
    isDD1 = (dd > 0);
}

if (f.licObjARRAY[f.licensesNameArray[LIC03_ONE_DAY_FISHING_LICENSE]].IsSelectable) {
    oFish1Day.hidden = !isDD1;
    if (!isDD1) {
        oFish1Day.value = false;
    }
    expression.setReturn(oFish1Day);
}
if (f.licObjARRAY[f.licensesNameArray[LIC24_NONRESIDENT_1_DAY_FISHING]].IsSelectable) {
    oNonresFish1Day.hidden = !isDD1;
    if (!isDD1) {
        oNonresFish1Day.value = false;
    }
    expression.setReturn(oNonresFish1Day);
}
if (f.licObjARRAY[f.licensesNameArray[LIC26_SEVEN_DAY_FISHING_LICENSE]].IsSelectable) {
    oFish7Day.hidden = !isDD7;
    if (!isDD7) {
        oFish7Day.value = false;
    }
    expression.setReturn(oFish7Day);
}
if (f.licObjARRAY[f.licensesNameArray[LIC25_NONRESIDENT_7_DAY_FISHING]].IsSelectable) {
    oNonResFish7Day.hidden = !isDD7;
    if (!isDD7) {
        oNonResFish7Day.value = false;
    }
    expression.setReturn(oNonResFish7Day);
}

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
