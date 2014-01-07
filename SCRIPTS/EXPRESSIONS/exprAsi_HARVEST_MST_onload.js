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

var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();
var vUserID = expression.getValue("$$userID$$");
var asiFormO = expression.getValue("ASI::FORM");


//TAG INFORMATION
var otTagId = expression.getValue("ASI::TAG INFORMATION::Carcass Tag ID");
var otDob = expression.getValue("ASI::TAG INFORMATION::Date Of Birth");
var otDecId = expression.getValue("ASI::TAG INFORMATION::DEC Cust. ID");
var otHarvestType = expression.getValue("ASI::TAG INFORMATION::Harvest Type");

//SELECTED TAG
var osCarcassTagId = expression.getValue("ASI::SELECTED TAG::TAG ID to Report On");
var otIsconsignedDMP = expression.getValue("ASI::TAG INFORMATION::Are you reporting on a consigned DMP tag?");

var isValidUser = isValidUserForGameHarvest(vUserID.getValue());

if (!isValidUser) {
    otHarvestType.message = "Not authorize user to report game harvest.";
    otHarvestType.readOnly = true;
    expression.setReturn(otHarvestType);
    otTagId.readOnly = true;
    expression.setReturn(otTagId);
    otDob.readOnly = true;
    expression.setReturn(otDob);
    otDecId.readOnly = true;
    expression.setReturn(otDecId);
    otIsconsignedDMP.readOnly = true;
    expression.setReturn(otIsconsignedDMP);
} else {
	var isAgent = false;
    if (vUserID.getValue() != 'anonymous') {
        if (!isAuthAgentLogin(vUserID.getValue())) {
            otDecId.value = getDecId(vUserID.getValue());
            otDecId.readOnly = true;
            expression.setReturn(otDecId);
        }else {
			isAgent = true;
		}
    }

    var carcassTagId = osCarcassTagId.value;
    var dob = otDob.value;
    var decCustId = otDecId.value;

    var isConsignedDMP = otIsconsignedDMP.value.equalsIgnoreCase('YES');
    var harvestType = otHarvestType.value;

    var isViz = true;
    var isBear = false;
    var isDeer = false;
    var isFallTurky = false;
    var isSpringTurky = false;

    isBear = harvestType == "Bear Report";
    isDeer = false;
    if (isConsignedDMP) {
        isDeer = true;
    } else {
        isDeer = harvestType == "Deer Report";
    }
    isSpringTurky = harvestType == "Spring Turkey Report";
    isFallTurky = harvestType == "Fall Turkey Report";

    if (carcassTagId != '') {
        var msg = isValidTagForDOB(carcassTagId, decCustId, dob, harvestType, isConsignedDMP);
        osCarcassTagId.message = msg;
        asiFormO.blockSubmit = (msg != '');
        expression.setReturn(asiFormO);
    }
    osCarcassTagId.readOnly = otTagId.value != '';
    expression.setReturn(osCarcassTagId);

    //KILL INFORMATION
    //var okLicenseYear = expression.getValue("ASI::KILL INFORMATION::License Year");
    //var okTagDesc = expression.getValue("ASI::KILL INFORMATION::Tag Description");
    //var okTagDocId = expression.getValue("ASI::KILL INFORMATION::Tag Document Id");
    var okDateOfKill = expression.getValue("ASI::KILL INFORMATION::Date of Kill");
    okDateOfKill.required = isViz;
    if (!isViz) {
        okDateOfKill.value = '';
    }
    expression.setReturn(okDateOfKill);

    //Bear,Deer
    var okSex = expression.getValue("ASI::KILL INFORMATION::Sex");
    if (!(isViz && (isBear || isDeer))) {
        okSex.hidden = !(isViz && (isBear || isDeer));
        okSex.required = (isViz && (isBear || isDeer));
        if (!(isViz && (isBear || isDeer))) {
            okSex.value = '';
        }
        expression.setReturn(okSex);
    }

    //Only Bear
    var okBearSeason = expression.getValue("ASI::KILL INFORMATION::Bear Season");
    if (!(isViz && isBear)) {
        okBearSeason.hidden = true;
        okBearSeason.required = false;
        okBearSeason.value = '';
        expression.setReturn(okBearSeason);
    }

    var okBearTakenWith = expression.getValue("ASI::KILL INFORMATION::Bear Taken With");
    if (!(isViz && isBear)) {
        okBearTakenWith.hidden = true;
        okBearTakenWith.required = false;
        okBearTakenWith.value = '';
        expression.setReturn(okBearTakenWith);
    }

    var okAge = expression.getValue("ASI::KILL INFORMATION::Age");
    if (!(isViz && isBear)) {
        okAge.hidden = true;
        okAge.required = false;
        okAge.value = '';
        expression.setReturn(okAge);
    }

    //Only Deeer
    var okDeerSeason = expression.getValue("ASI::KILL INFORMATION::Deer Season");
    if (!(isViz && isDeer)) {
        okDeerSeason.hidden = true;
        okDeerSeason.required = false;
        okDeerSeason.value = '';
        expression.setReturn(okDeerSeason);
    }

    var okDeerTakenWith = expression.getValue("ASI::KILL INFORMATION::Deer Taken With");
    if (!(isViz && isDeer)) {
        okDeerTakenWith.hidden = true;
        okDeerTakenWith.required = false;
        okDeerTakenWith.value = '';
        expression.setReturn(okDeerTakenWith);
    }

    var okLeftAntlerPoints = expression.getValue("ASI::KILL INFORMATION::Left Antler Points");
    if (!(isViz && isDeer)) {
        okLeftAntlerPoints.hidden = true;
        okLeftAntlerPoints.required = false;
        okLeftAntlerPoints.value = '';
        expression.setReturn(okLeftAntlerPoints);
    }

    var okRighttAntlerPoints = expression.getValue("ASI::KILL INFORMATION::Right Antler Points");
    if (!(isViz && isDeer)) {
        okRighttAntlerPoints.hidden = true;
        okRighttAntlerPoints.required = false;
        okRighttAntlerPoints.value = '';
        expression.setReturn(okRighttAntlerPoints);
    }

    //Onli Turkey
    var okTurkBeardLen = expression.getValue("ASI::KILL INFORMATION::Turkey Beard Length");
    if (!(isViz && (isSpringTurky || isFallTurky))) {
        okTurkBeardLen.hidden = true;
        okTurkBeardLen.required = false;
        okTurkBeardLen.value = '';
        expression.setReturn(okTurkBeardLen);
    }

    var okTurkLegSaved = expression.getValue("ASI::KILL INFORMATION::Turkey Leg Saved?");
    if (!(isViz && (isSpringTurky || isFallTurky))) {
        okTurkLegSaved.hidden = true;
        okTurkLegSaved.required = false;
        okTurkLegSaved.value = '';
        expression.setReturn(okTurkLegSaved);
    }
    else {
        if (isFallTurky) {
            okTurkLegSaved.message = "DEC would like to send you an envelope to mail it back.";
        } else {
            okTurkLegSaved.message = "";
        }
        expression.setReturn(okTurkLegSaved);
    }

    var okTurkSpurLen = expression.getValue("ASI::KILL INFORMATION::Turkey Spur Length");
    if (!(isViz && (isSpringTurky || isFallTurky))) {
        okTurkSpurLen.hidden = true;
        okTurkSpurLen.required = false;
        okTurkSpurLen.value = '';
    }
    expression.setReturn(okTurkSpurLen);

    var okWeight = expression.getValue("ASI::KILL INFORMATION::Weight (to nearest pound)");
    if (!(isViz && (isSpringTurky || isFallTurky))) {
        okWeight.hidden = true;
        okWeight.required = false;
        okWeight.value = '';
        expression.setReturn(okWeight);
    }

    //OTHER INFORMATION
    //Bear
    var ooAddrExam = expression.getValue("ASI::OTHER INFORMATION::Address for Examination");
    if (!(isViz && isBear)) {
        ooAddrExam.hidden = true;
        ooAddrExam.required = false;
        ooAddrExam.value = '';
        expression.setReturn(ooAddrExam);
    }

    var ooContactPhone = expression.getValue("ASI::OTHER INFORMATION::Contact Phone #");
    if (!(isViz && isBear)) {
        ooContactPhone.hidden = true;
        ooContactPhone.required = false;
        ooContactPhone.value = '';
        expression.setReturn(ooContactPhone);
    }

    var ooCountyExam = expression.getValue("ASI::OTHER INFORMATION::County for Examination of Bear");
    if (!(isViz && isBear)) {
        ooCountyExam.hidden = true;
        ooCountyExam.required = false;
        ooCountyExam.value = '';
        expression.setReturn(ooCountyExam);
    }

    ///Turkey
    var ooTurkNumDaysToKill = expression.getValue("ASI::OTHER INFORMATION::Number of days hunted to kill this turkey");
    if (!(isViz && (isSpringTurky || isFallTurky))) {
        ooTurkNumDaysToKill.hidden = true;
        ooTurkNumDaysToKill.required = false;
        ooTurkNumDaysToKill.value = '';
        expression.setReturn(ooTurkNumDaysToKill);
    }

    var ooReportingChannnel = expression.getValue("ASI::OTHER INFORMATION::Reporting Channel");
    //ooReportingChannnel.hidden = !isAgent;
    ooReportingChannnel.readOnly = !isAgent;
    ooReportingChannnel.required = isAgent;
    if (isAgent) {
        ooReportingChannnel.value = '';
    } else if (!isAgent) {
        ooReportingChannnel.value = 'Internet';
    }
    expression.setReturn(ooReportingChannnel);
}