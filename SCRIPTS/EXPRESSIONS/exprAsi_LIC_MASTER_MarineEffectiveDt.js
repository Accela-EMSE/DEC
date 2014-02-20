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

var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var oEffDt = expression.getValue("ASI::FISHING LICENSES::Effective Date Marine");
var oToday = expression.getValue("$$today$$");

var totalRowCount = expression.getTotalRowCount();
var msg = diffDate(oToday.getValue(), oEffDt.getValue()) < 0 ? "Effective Date cannot be prior to today's date" : "";
dd =  diffDate(oToday.getValue(), oEffDt.getValue());
if (dd > 60) {
	msg =  "Effective Date cannot be more than 60 days into the future" ;
	oEffDt.value = "";
}
oEffDt.message = msg;
expression.setReturn(oEffDt);

//If date is greater than today
if (msg == '') {
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

    if (isNull(aActiveHoldings.value, '') != '') {
        //Init 
        var f = new form_OBJECT(GS2_EXPR, OPTZ_TYPE_CTRC);

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

        //Call rules
        //f.ExecuteBoRuleEngine();
        ////

        msg = f.isActiveMarine(oEffDt.getValue(), '')
        oEffDt.message = msg;
        expression.setReturn(oEffDt);
    }
}
