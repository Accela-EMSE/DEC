var servProvCode = expression.getValue("$$servProvCode$$").value;

var oFish1Day = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
var oNonresFish1Day = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");

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
var vUserID = expression.getValue("$$userID$$");
var sUserIdEB = vUserID.getValue();

//Init 
var f = new form_OBJECT(GS2_EXPR);
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
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Marine Registry");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::One Day Fishing License");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Freshwater Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Nonresident 1 Day Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Nonresident 7 Day Fishing");
myLicObj[myLicObj.length] = expression.getValue("ASI::FISHING LICENSES::Seven Day Fishing License");
////
