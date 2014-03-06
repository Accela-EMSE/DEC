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
var vUserID = expression.getValue("$$userID$$");
var aIsMilitaryServiceman = expression.getValue("ASI::INTERNAL USE::A_Military Serviceman");
var aIsLegallyBlind = expression.getValue("ASI::INTERNAL USE::A_Legally Blind");
var aPermanentDisability = expression.getValue("ASI::INTERNAL USE::A_Permanent Disability");
var sUserIdEB = vUserID.getValue();
var oRecordType=expression.getValue("CAP::capType");


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
f.IsPermanentDisabled = aPermanentDisability.value;
f.SetActiveHoldingsInfo(aActiveHoldings.value);
f.DriverLicenseState = aDriverLicenseState.value;
f.DriverLicenseNumber = aDriverLicenseNumber.value;
f.NonDriverLicenseNumber = aNonDriverLicenseNumber.value;
f.SetEnforcementAttrib(aSuspended.value, aRevokedHunting.value, aRevokedTrapping.value, aRevokedFishing.value);
f.SetFulfillmentAttrib(aAgedIn.value, aNeedHuntEd.value);
f.FromACA = aIsFromACA.value;
f.UserIdEB = sUserIdEB;
f.IsMilitaryServiceman = aIsMilitaryServiceman.value;
f.IsLegallyBlind = aIsLegallyBlind.value;
f.RecordType = oRecordType.getValue();
//
//calling Hunt Sale
f.SetHuntSaleExcludes();

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
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Bowhunting Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Deer Management Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Hunting License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Muzzleloading Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::Turkey Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Hunting License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Hunting License");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Bowhunting Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Bowhunting Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Muzzleloading Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Muzzleloading Privilege");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::3 Year Turkey Permit");
myLicObj[myLicObj.length] = expression.getValue("ASI::HUNTING LICENSE::5 Year Turkey Permit");
