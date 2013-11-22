/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_DEC_HARVEST.js
| Event   : N/A
|
| Usage   : Custom Script Include w.r.t game harvest.  Insert custom EMSE Function 
|
| Notes   : 05/05/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
|         
/------------------------------------------------------------------------------------------------------*/
function loadHarvestInfo() {
    logDebug("ENTER: loadHarvestInfo");
    try {

        editAppSpecific4ACA("TAG ID to Report On", AInfo["Carcass Tag ID"]);

        //If Carcass Tag ID is not entered then show all not reported tags 
        if (isNull(AInfo["Carcass Tag ID"], '') == '') {
            var decCustId = AInfo["DEC Cust. ID"];
            var dob = AInfo["Date Of Birth"];
            var strHarvestType = AInfo["Harvest Type"];
            var isConsignedDMPtag = (AInfo["Are you reporting on a consigned DMP tag?"] == "Yes");
            var isBear = (AInfo["Harvest Type"] == "Bear Report");
            var isDeer = (AInfo["Harvest Type"] == "Deer Report");
            var isFallTurkey = (AInfo["Harvest Type"] == "Fall Turkey Report");
            var isSpringTurkey = (AInfo["Harvest Type"] == "Spring Turkey Report");

            //Get Contact model using DEC ID aka passportnum:
            var peopResult = getPeopleByDecID(decCustId);
            var peopleSequenceNumber = peopResult.getContactSeqNumber();
            if (peopleSequenceNumber != null) {
                var availableTags = GetTagsForHarvestReport(peopleSequenceNumber, isDeer, isBear, isFallTurkey, isSpringTurkey, isConsignedDMPtag);
                var newAsitArray = GetTagAsitTableArray(availableTags);

                asitModel = cap.getAppSpecificTableGroupModel();
                new_asit = addASITable4ACAPageFlow(asitModel, "AVAILABLE TAGS", newAsitArray);
            }
        }
    }
    catch (err) {
        ("**ERROR in loadHarvestInfo:" + err.message);
    }
    logDebug("EXIT: loadHarvestInfo");
    return true;
}
//code started
function isValidDays(inputValue) {
	var isValid = true;
	var retMsg = '';
	if (inputValue != null || inputValue != '') {
		//var DaysPattern = /^([1-9]|[1][0-9]|[2][0-9]|[3][0-9]|[4][0-5])?$|^45$/;
		
		//isValid = DaysPattern.test(inputValue);
		if (parseInt(inputValue) < 45) {
			retMsg += "Please enter a value of 45 or less.";
			retMsg += '<Br />';
			return retMsg;
		}
		/*
		if (isValid) {

			//return retMsg;
		}*/
	}
	return retMsg;
}
//code ended

//Date of Kill code started//
function verifyDate() {
    var retMsg = ''
    var isValid = true;
			certDate = AInfo["Date of Kill"];
            var diff = dateDiff(new Date(), new Date(certDate));
            if (diff > 0) {
                retMsg += ("Date cannot be after today's date.");
                retMsg += '<Br />';
            }
			var asiValDate = new Date(certDate);
			var cDate = new Date();
			cDate .setFullYear(cDate .getFullYear()-1);
			if(asiValDate <= cDate)
			{
			retMsg += ("Date is incorrect.");
			retMsg += '<Br />';
			}
    return retMsg;
}
//code ended

function isValidHarvestinfo(pStep) {
    logDebug("ENTER: isValidHarvestinfo");
    var retMsg = '';
    try {
        var useAppSpecificGroupName = true;
        var dob = AInfo["Date Of Birth"];
        var carcassTagID = AInfo["Carcass Tag ID"];
        var decId = AInfo["DEC Cust. ID"];
        var strHarvestType = AInfo["Harvest Type"];
        var isConsignedDMPtag = (AInfo["Are you reporting on a consigned DMP tag?"] == "Yes");
        var isBear = (AInfo["Harvest Type"] == "Bear Report");
        var isDeer = (AInfo["Harvest Type"] == "Deer Report");
        var isFallTurkey = (AInfo["Harvest Type"] == "Fall Turkey Report");
        var isSpringTurkey = (AInfo["Harvest Type"] == "Spring Turkey Report");

        //Calller ACA ONSUBMIT BEFORE CARCASSTAG
        if (pStep == 'Step1') {
            if (!isValidUserForGameHarvest()) {
                retMsg += 'Not authorize user to report game harvest.';
                retMsg += '<Br />';
            } else {
                if (isNull(strHarvestType, '') == '') {
                    retMsg += 'Please select Harvest Type.';
                    retMsg += '<Br />';
                } else if (!isValidHarvestSeasonByType(strHarvestType)) {
                    retMsg += 'Selected harvest type is not avialble to report.';
                    retMsg += '<Br />';
                } else {
                    if (isNull(dob, '') == '') {
                        retMsg += 'Please enter Date Of Birth.';
                        retMsg += '<Br />';
                    }
                    if (!isConsignedDMPtag && isNull(carcassTagID, '') == '' && isNull(decId, '') == '') {
                        retMsg += 'Please enter Carcass Tag ID or DEC Cust. ID.';
                        retMsg += '<Br />';
                    }
                    else if (isConsignedDMPtag && (isNull(carcassTagID, '') == '' || isNull(decId, '') == '')) {
                        retMsg += 'Please enter Carcass Tag ID and DEC Cust. ID.';
                        retMsg += '<Br />';
                    } else {
                        if (isNull(carcassTagID, '') != '') {
                            //Validate Tag ID with DOB
                            var tagObj = new TAGOBJ(carcassTagID);
                            var msgValid = getValidationMessasge(tagObj, decId, dob, isDeer, isBear, isFallTurkey, isSpringTurkey, isConsignedDMPtag);
                            if (isNull(msgValid, '') != '') {
                                retMsg += msgValid;
                            }
                        }
                        else {
                            //Validate DeC ID with DOB
                            if (!isValidDecIdWithDOB(decId, dob)) {
                                retMsg += 'Customer ID is not valid for the entered date of Birth.';
                                retMsg += '<Br />';
                            }
                        }
                    }
                }
            }
        }

        //Calller ACA ONSUBMIT BEFORE SALESSELECT
        if (pStep == 'Step2') {
            var carcassTagId = AInfo["TAG ID to Report On"];
            var decCustId = AInfo["DEC Cust. ID"];
            dob = AInfo["Date Of Birth"];
            strHarvestType = AInfo["Harvest Type"];
            isConsignedDMPtag = (AInfo["Are you reporting on a consigned DMP tag?"] == "Yes");

            var msg = isValidEnteredTagToReport();
            if (msg != '') {
                retMsg += msg;
                retMsg += '<Br />';
            }
            if (isNull(isNull(AInfo["County of Kill"]), '') == '') {
                retMsg += 'Please select cointy of kill.';
                retMsg += '<Br />';
            }
            if (isNull(isNull(AInfo["Town"]), '') == '') {
                retMsg += 'Please select Town.';
                retMsg += '<Br />';
            }
            if (isNull(isNull(AInfo["WMU"]), '') == '') {
                retMsg += 'Please select WMU.';
                retMsg += '<Br />';
            }
            if (isBear && isNull(isNull(AInfo["Bear Season"]), '') == '') {
                retMsg += 'Please select Bear Season.';
                retMsg += '<Br />';
            }
            if (isBear && isNull(isNull(AInfo["Bear Taken With"]), '') == '') {
                retMsg += 'Please select Bear Taken With.';
                retMsg += '<Br />';
            }
            if (isDeer && isNull(isNull(AInfo["Deer Season"]), '') == '') {
                retMsg += 'Please select Deer Season.';
                retMsg += '<Br />';
            }
            if (isDeer && isNull(isNull(AInfo["Deer Taken With"]), '') == '') {
                retMsg += 'Please select Deer Taken With.';
                retMsg += '<Br />';
            }
        }
    }
    catch (err) {
        logDebug("**ERROR in isValidHarvestinfo:" + err.message);
    }

    logDebug("EXIT: isValidHarvestinfo");
    return retMsg;
}

function isValidEnteredTagToReport() {
    logDebug("ENTER: isValidEnteredTagToReport");
    var retMsg = '';

    var carcassTagID = AInfo["Carcass Tag ID"];
    var tagLast4Digits = AInfo["TAG ID to Report On"];
    var decCustId = AInfo["DEC Cust. ID"];
    var dob = AInfo["Date Of Birth"];
    var strHarvestType = AInfo["Harvest Type"];

    if (isNull(carcassTagID, '') == '') {
        if (tagLast4Digits.length() >= 4) {
            var last4 = tagLast4Digits.substring(tagLast4Digits.length() - 4, tagLast4Digits.length());
            var found = false;
            if ((typeof (AVAILABLETAGS) == "object")) {
                for (y in AVAILABLETAGS) {
                    var tagId = AVAILABLETAGS[y]["Tag Id"];
                    var status = AVAILABLETAGS[y]["Status"];
                    var last4ForTag = tagId.substring(tagId.length() - 4, tagId.length());
                    if (last4ForTag == last4) {
                        var tagObj = new TAGOBJ();
                        tagObj.CapStatus = status;
                        if (!tagObj.isValidStatusToReport(true)) {
                            retMsg += 'Please enter valid Carcass Tag ID. Tag does not have valid status.';
                            retMsg += '<Br />';
                        } else {
                            editAppSpecific4ACA("TAG ID to Report On", tagId);
                            aa.env.setValue("CapModel", cap);
                        }
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                retMsg += 'Invalid tag number.';
                retMsg += '<Br />';
            }
        } else {
            retMsg += 'Please enter last 4 digits of tag.';
            retMsg += '<Br />';
        }
    }
    logDebug("EXIT: isValidEnteredTagToReport");
    return retMsg
}
function isValidDecIdWithDOB(decId, dob) {
    var isValid = false;
    try {
        if (decId != '') {
            var peopMd = getPeopleByDecID(decId);
            var peopleSequenceNumber = peopMd.getContactSeqNumber();
            var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
            if (peopleModel != null) {
                if (peopleModel.getBirthDate() != null) {
                    if (dob != null) {
                        var custDob = new Date((peopleModel.getBirthDate().getMonth() + 1) + "/" + peopleModel.getBirthDate().getDate() + "/" + peopleModel.getBirthDate().getYear());
                        isValid = (dateDiff(new Date(dob), custDob) == 0);
                    } else {
                        isValid = true;
                    }
                }
            }
        }
    }
    catch (err) {
        logDebug("**WARNING in isValidDecIdWithDOB:" + err.message);
    }
    return isValid;
}
function TAGOBJ(tagId) {
    this.tagId = tagId;
    this.tagCapId = null;
    this.tagCap = null;
    this.CapStatus = null;
    this.appTypeString = '';
    this.peopleSequenceNumber = '';
    this.DecId = null;
    this.DOB = null;
    this.toString = function () {
        var result = '';
        var lf = '<br />';

        var sbArray = new Array();
        var scArray = new Array();

        scArray.push("tagId : ");
        sbArray.push(this.tagId);

        scArray.push("tagCapId : ");
        sbArray.push(this.tagCapId);
        scArray.push("tagCap : ");
        sbArray.push(this.tagCap);
        scArray.push("CapStatus : ");
        sbArray.push(this.CapStatus);
        scArray.push("appTypeString : ");
        sbArray.push(this.appTypeString);
        scArray.push("peopleSequenceNumber : ");
        sbArray.push(this.peopleSequenceNumber);
        scArray.push("DecId : ");
        sbArray.push(this.DecId);
        scArray.push("DOB : ");
        sbArray.push(this.DOB);

        for (var c in sbArray) {
            result += scArray[c];
            result += sbArray[c];
            result += lf;
        }

        return result;
    }
    this.getTagInfo = function () {
        try {
            var searchTageId = this.tagId;
            if (arguments.length == 1) searchTageId = arguments[0];
            this.tagCapId = getCapId(searchTageId);
            if (this.tagCapId) {
                this.tagCap = aa.cap.getCap(this.tagCapId).getOutput();
                this.CapStatus = this.tagCap.getCapStatus();
                appTypeResult = this.tagCap.getCapType();
                this.appTypeString = appTypeResult.toString();

                var vContactType = new Array();
                vContactType.push('Individual');
                vContactType.push('Applicant');

                for (var ct in vContactType) {
                    var cont = getContactObj(this.tagCapId, vContactType[ct]);
                    this.peopleSequenceNumber = cont.refSeqNumber;
                    if (this.peopleSequenceNumber != null) {
                        break;
                    }
                }
                var peopleModel = getOutput(aa.people.getPeople(this.peopleSequenceNumber), "");
                this.DecId = peopleModel.getPassportNumber();
                if (peopleModel.getBirthDate() != null) {
                    this.DOB = new Date((peopleModel.getBirthDate().getMonth() + 1) + "/" + peopleModel.getBirthDate().getDate() + "/" + peopleModel.getBirthDate().getYear());
                }
            }
        }
        catch (err) {
            logDebug("Exception in TAGOBJ.getTagInfo:" + err.message);
        }
        return this;
    }
    this.isBearRecordtype = function () {
        return (this.appTypeString == AA47_TAG_BEAR);
    }
    this.isDeerRecordtype = function (isConsignedDMPtagOnly) {
        if (isConsignedDMPtagOnly) {
            return (this.appTypeString == AA53_TAG_DMP_DEER);
        }
        return (this.appTypeString == AA46_TAG_REG_SEASON_DEER || this.appTypeString == AA53_TAG_DMP_DEER);
    }
    this.isFallTurkeyRecordtype = function () {
        return (this.appTypeString == AA51_TAG_FALL_TURKEY_TAG);
    }
    this.isSpringTurkeyRecordtype = function () {
        return (this.appTypeString == AA50_TAG_SPRING_TURKEY_TAG);
    }
    this.isValidStatusToReport = function (isAbouttoReport) {
        var validStatusArray = new Array();
        //validStatusArray.push("Approved");
        validStatusArray.push("Active");
        if (!isAbouttoReport) {
            validStatusArray.push("Reported");
        }

        return exists(this.CapStatus, validStatusArray);
    }
    if (this.tagId) {
        this.getTagInfo();
    }
}
function updateTag() {
    try {
        var tagId = AInfo["TAG ID to Report On"];

        //Get Tage Object
        var tagObj = new TAGOBJ(tagId);
        var isBear = (AInfo["Harvest Type"] == "Bear Report") && tagObj.isBearRecordtype();
        var isDeer = (AInfo["Harvest Type"] == "Deer Report") && tagObj.isDeerRecordtype(false);
        var isFallTurkey = (AInfo["Harvest Type"] == "Fall Turkey Report") && tagObj.isFallTurkeyRecordtype();
        var isSpringTurkey = (AInfo["Harvest Type"] == "Spring Turkey Report") && tagObj.isSpringTurkeyRecordtype();
        var isConsignedDMPtag = (AInfo["Are you reporting on a consigned DMP tag?"] == "Yes");

        //chcek the valid harvest type with tag record type
        if (tagObj.isValidStatusToReport(false) && (isBear || isDeer || isFallTurkey || isSpringTurkey)) {
            //Update ASi filed according to tag types
            var newAInfo = new Array();
            newAInfo.push(new NewLicDef("Date of Kill", AInfo["Date of Kill"]));
            newAInfo.push(new NewLicDef("County of Kill", AInfo["County of Kill"]));
            newAInfo.push(new NewLicDef("Town", AInfo["Town"]));
            newAInfo.push(new NewLicDef("WMU", AInfo["WMU"]));
            newAInfo.push(new NewLicDef("Source", AInfo["Reporting Channel"]));

            if (isBear || isDeer) {
                newAInfo.push(new NewLicDef("Sex", AInfo["Sex"]));
            }
            if (isBear) {
                newAInfo.push(new NewLicDef("Bear Season", AInfo["Bear Season"]));
                newAInfo.push(new NewLicDef("Bear Taken With", AInfo["Bear Taken With"]));
                newAInfo.push(new NewLicDef("Age", AInfo["Age"]));
                newAInfo.push(new NewLicDef("County for Examination of Bear", AInfo["County for Examination of Bear"]));
                newAInfo.push(new NewLicDef("Address for Examination", AInfo["Address for Examination"]));
                newAInfo.push(new NewLicDef("Contact Phone #", AInfo["Contact Phone #"]));
            }
            if (isDeer) {
                newAInfo.push(new NewLicDef("Deer Season", AInfo["Deer Season"]));
                newAInfo.push(new NewLicDef("Deer Taken With", AInfo["Deer Taken With"]));
                newAInfo.push(new NewLicDef("Left Antler Points", AInfo["Left Antler Points"]));
                newAInfo.push(new NewLicDef("Right Antler Points", AInfo["Right Antler Points"]));
                newAInfo.push(new NewLicDef("Consignee DEC Customer ID", AInfo["Consignee DEC Customer ID"]));
                newAInfo.push(new NewLicDef("Are you reporting on a consigned DMP tag?", AInfo["DEC Cust. ID"]));
            }
            if (isFallTurkey || isSpringTurkey) {
                newAInfo.push(new NewLicDef("Weight (to nearest pound)", AInfo["Weight (to nearest pound)"]));
                newAInfo.push(new NewLicDef("Turkey Spur Length", AInfo["Turkey Spur Length"]));
                newAInfo.push(new NewLicDef("Turkey Beard Length", AInfo["Turkey Beard Length"]));
                newAInfo.push(new NewLicDef("Number of days hunted to kill this turkey", AInfo["Number of days hunted to kill this turkey"]));
            }
            copyLicASI(tagObj.tagCapId, newAInfo);

            //Update Status
            updateTagStatus("Reported", "Reported", tagObj.tagCapId);
            //updateTask("Report Game Harvest", "Reported", "", "", "", tagObj.tagCapId);
            closeTaskForRec("Report Game Harvest", "Reported", "", "", "", tagObj.tagCapId);
            closeTaskForRec("Void Document", "", "", "", "", tagObj.tagCapId);
            closeTaskForRec("Revocation", "", "", "", "", tagObj.tagCapId);
            closeTaskForRec("Suspension", "", "", "", "", tagObj.tagCapId);

            //Creates related records for tag; Tag as parent and reporting harvest application as child 
            var result = aa.cap.createAppHierarchy(capId, tagObj.tagCapId);
            if (result.getSuccess()) {
                logDebug("Parent application successfully linked");
            }
            else {
                logDebug("Could not link applications" + result.getErrorMessage());
            }

            if (isConsignedDMPtag) {
                attachedContacts();
            }
            else {
                if (publicUser) {
                    var uObj = new USEROBJ(publicUserID);
                    attachedContacts(uObj.acctType != "CITIZEN" ? tagObj.peopleSequenceNumber : uObj.peopleSequenceNumber);
                } else {
                    attachedContacts(tagObj.peopleSequenceNumber);
                }
            }
        }
    }
    catch (err) {
        logDebug("Exception in updateTag:" + err.message);
    }
}
function updateTagStatus(stat, cmt, tagCapId) {
    var updateStatusResult = aa.cap.updateAppStatus(tagCapId, "TAG", stat, sysDate, cmt, systemUserObj);
    if (updateStatusResult.getSuccess())
        logDebug("Updated document status to " + stat + " successfully.");
    else
        logDebug("**ERROR: document status update to " + stat + " was unsuccessful.  The reason is " + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
}
function AVAILABLE_TAGS_OBJ(sYear, sTagId, sDesc, sStatus) {
    this.LicenseYear = sYear;
    this.TagId = sTagId;
    this.Description = sDesc;
    this.Status = sStatus;
}
function GetTagsForHarvestReport(peopleSequenceNumber, isDeer, isBear, isFallTurkey, isSpringTurkey, isConsignedDMPtag) {
    //Get All Tags which are approved and not reported for last 2 years for a customer
    var validTagTypeArray = new Array();     //   record types

    ats = "Licenses/Tag/Hunting/*";
    if (isConsignedDMPtag) {
        ats = AA53_TAG_DMP_DEER;
        validTagTypeArray.push(ats);
    } else if (isBear) {
        ats = AA47_TAG_BEAR;
        validTagTypeArray.push(ats);
    } else if (isDeer) {
        ats = "Licenses/Tag/Hunting/*";
        validTagTypeArray.push(AA49_TAG_BOW_MUZZ_ANTLERLESS);
        validTagTypeArray.push(AA48_TAG_BOW_MUZZ_EITHER_SEX);
        validTagTypeArray.push(AA46_TAG_REG_SEASON_DEER);
        validTagTypeArray.push(AA53_TAG_DMP_DEER);
    } else if (isFallTurkey) {
        ats = AA51_TAG_FALL_TURKEY_TAG;
        validTagTypeArray.push(ats);
    } else if (isSpringTurkey) {
        ats = AA50_TAG_SPRING_TURKEY_TAG;
        validTagTypeArray.push(ats);
    }
    var CC = new contactObj(null);
    CC.refSeqNumber = peopleSequenceNumber;
    var allContactCaps = CC.getCaps(ats);

    var availableTags = new Array();
    for (var ccp in allContactCaps) {
        var tagCapId = allContactCaps[ccp];
        var tagCap = aa.cap.getCap(tagCapId).getOutput();
        appTypeResult = tagCap.getCapType();
        appTypeString = appTypeResult.toString();
        if (exists(appTypeString, validTagTypeArray)) {
            var tagAltID = tagCapId.getCustomID();
            var tagStatus = tagCap.getCapStatus();
            var tagSpecialText = tagCap.getSpecialText();
            var tagAinfo = new Array();
            loadAppSpecific(tagAinfo, tagCapId);
            var neAvailTag = new AVAILABLE_TAGS_OBJ(tagAinfo["Year"], tagAltID, tagSpecialText, tagStatus);
            availableTags.push(neAvailTag);
        }
    }
    return availableTags;
}
function GetTagAsitTableArray(availableTags) {
    logDebug("ENTER: GetTagAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    for (var tidx in availableTags) {
        var tObj = availableTags[tidx];

        tempObject = new Array();
        var fieldInfo = new asiTableValObj("License Year", isNull(tObj.LicenseYear, ''), "Y");
        tempObject["License Year"] = fieldInfo;
        fieldInfo = new asiTableValObj("Tag Id", isNull(tObj.TagId, ''), "Y");
        tempObject["Tag Id"] = fieldInfo;
        fieldInfo = new asiTableValObj("Description", isNull(tObj.Description, ''), "Y");
        tempObject["Description"] = fieldInfo;
        fieldInfo = new asiTableValObj("Status", isNull(tObj.Status, ''), "Y");
        tempObject["Status"] = fieldInfo;
        tempArray.push(tempObject);  // end of record
    }
    logDebug("EXIT: GetTagAsitTableArray");

    return tempArray;
}
function isValidTagForDOB(carcassTagId, decCustId, dob, harvestType, isConsignedDMPtag) {
    var retMsg = '';
    try {

        var isBear = (harvestType == "Bear Report");
        var isDeer = (harvestType == "Deer Report");
        var isFallTurkey = (harvestType == "Fall Turkey Report");
        var isSpringTurkey = (harvestType == "Spring Turkey Report");

        //Get Preference Order
        var tagObj = new TAGOBJ(carcassTagId);
        var msgValid = getValidationMessasge(tagObj, decCustId, dob, isDeer, isBear, isFallTurkey, isSpringTurkey, isConsignedDMPtag);
        if (isNull(msgValid, '') != '') {
            retMsg += msgValid;
        }

    }
    catch (err) {
        retMsg = err.message;
        logDebug("**WARNING in isValidTagForDOB:" + err.message);
    }
    return retMsg;
}
function isValidLast4Digits(tagLast4Digits, decCustId, dob, harvestType, isConsignedDMPtag) {
    var retMsg = '';
    try {
        var isBear = (harvestType == "Bear Report");
        var isDeer = (harvestType == "Deer Report");
        var isFallTurkey = (harvestType == "Fall Turkey Report");
        var isSpringTurkey = (harvestType == "Spring Turkey Report");

        var peopleModel = getPeopleByDecID(decCustId);
        if (peopleModel != null) {
            var peopleSequenceNumber = peopleModel.getContactSeqNumber();
            if (peopleSequenceNumber != null) {
                var availableTags = GetTagsForHarvestReport(peopleSequenceNumber, isDeer, isBear, isFallTurkey, isSpringTurkey, isConsignedDMPtag);
                if (tagLast4Digits.length() >= 4) {
                    var last4 = tagLast4Digits.substring(tagLast4Digits.length() - 4, tagLast4Digits.length());
                    var found = false;
                    for (y in availableTags) {
                        var tagId = availableTags[y].TagId;
                        var status = availableTags[y].Status;
                        var last4ForTag = tagId.substring(tagId.length() - 4, tagId.length());
                        if (last4ForTag == last4) {
                            var tagObj = new TAGOBJ();
                            tagObj.CapStatus = status;
                            if (!tagObj.isValidStatusToReport(true)) {
                                retMsg += 'Please enter valid Carcass Tag ID. Tag does not have valid status.';
                                retMsg += '<Br />';
                            }
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        retMsg += 'Invalid tag number.';
                        retMsg += '<Br />';
                    }
                } else {
                    retMsg += 'Please enter last 4 digits of tag.';
                    retMsg += '<Br />';
                }
            }
        }
    }
    catch (err) {
        retMsg = err.message;
        logDebug("**WARNING in isValidLast4Digits:" + err.message);
    }
    return retMsg;
}
function getValidationMessasge(tagObj, decCustId, dob, isDeer, isBear, isFallTurkey, isSpringTurkey, isConsignedDMPtag) {
    var retMsg = '';

    if (tagObj.tagCapId == null) {
        retMsg += 'Please enter valid Carcass Tag ID.';
        retMsg += '<Br />';
    } else {
        var tagCapId = tagObj.tagCapId;
        if (!tagObj.isValidStatusToReport(true)) {
            retMsg += 'Please enter valid Carcass Tag ID. Tag does not have valid status.';
            retMsg += '<Br />';
        }
        else if ((isConsignedDMPtag || isDeer) && !tagObj.isDeerRecordtype(isConsignedDMPtag)) {
            retMsg += 'Please enter valid Carcass Tag ID for deer.';
            retMsg += '<Br />';
        }
        else if (isBear && !tagObj.isBearRecordtype()) {
            retMsg += 'Please enter valid Carcass Tag ID for bear.';
            retMsg += '<Br />';
        }
        else if (isFallTurkey && !tagObj.isFallTurkeyRecordtype()) {
            retMsg += 'Please enter valid Carcass Tag ID for fall turkey.';
            retMsg += '<Br />';
        }
        else if (isSpringTurkey && !tagObj.isSpringTurkeyRecordtype()) {
            retMsg += 'Please enter valid Carcass Tag ID for spring turkey.';
            retMsg += '<Br />';
        }
        else if (!isConsignedDMPtag && dateDiff(new Date(dob), tagObj.DOB) != 0) {
            retMsg += 'Please enter valid Carcass Tag ID. Carcass Tag ID is not valid for the entered date of Birth.';
            retMsg += '<Br />';
        }
        if (retMsg != '' && publicUserID != '') {
            if (!isConsignedDMPtag && decCustId == tagObj.DecId && !(publicUserID != 'PUBLICUSER0')) {
                retMsg += 'Please enter valid Carcass Tag ID. Carcass Tag ID is not valid for the DEC customer id.';
                retMsg += '<Br />';
            }
            else if (isConsignedDMPtag && publicUserID != 'PUBLICUSER0' && isValidDecIdWithDOB(isNull(decCustId, ''), null)) {
                retMsg += 'Please enter valid DEC customer id.';
                retMsg += '<Br />';
            }
        }
    }
    return retMsg;
}
function getPeopleByDecID(decId) {
    var peopResult = null;
    var vError = null;
    try {
        var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
        qryPeople.setPassportNumber(decId);

        var r = aa.people.getPeopleByPeopleModel(qryPeople);
        if (r.getSuccess()) {
            peopResult = r.getOutput();
            if (peopResult.length == 0) {
                logDebug("Searched for REF contact, no matches found, returing null");
            } else {
                peopResult = peopResult[0];
            }
        }
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
    }
    return peopResult;
}
function loadTagsToReprint() {
    logDebug("ENTER: loadTagsToReprint");
    try {
        createDocumentReprintTable();
    }
    catch (err) {
        logDebug("**ERROR in loadTagsToReprint:" + err.message);
    }

    logDebug("EXIT: loadTagsToReprint");
    return true;
}
function createDocumentReprintTable() {
    logDebug("ENTER: createDocumentReprintTable");
    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    var year = AInfo["License Year"];
    for (ca in xArray) {
        var thisContact = xArray[ca];
        peopleSequenceNumber = thisContact["refcontactSeqNumber"]
        if (peopleSequenceNumber != null) {
            var asitModel;
            var new_asit;

            if (!(typeof (REPRINTDOCUMENTS) == "object")) {
                var availableActiveItems = GetTagsForHarvestReprint(peopleSequenceNumber, year);
                var newAsitArray = GetActiveDocumentsAsitTableArray(availableActiveItems);

                asitModel = cap.getAppSpecificTableGroupModel();
                new_asit = addASITable4ACAPageFlow(asitModel, "ACTIVE DOCUMENTS", newAsitArray);
            }
        }
        break;
    }
    logDebug("EXIT: createDocumentReprintTable");
}
function GetTagsForHarvestReprint(peopleSequenceNumber, year) {
    logDebug("ENTER: GetTagsForHarvestReprint");
    var availableActiveItems = new Array();
    var validActiveholdingsArray = getReprintFilterArray();

    var CC = new contactObj(null);
    CC.refSeqNumber = peopleSequenceNumber;
    var allContactCaps = CC.getCaps("Licenses/*/*/*");

    for (var ccp in allContactCaps) {
        var itemCapId = allContactCaps[ccp];
        var itemCap = aa.cap.getCap(itemCapId).getOutput();
        appTypeResult = itemCap.getCapType();
        appTypeString = appTypeResult.toString();
        if (exists(appTypeString, validActiveholdingsArray)) {
            var newActiveTag = new ACTIVE_ITEM(itemCapId, itemCap, appTypeString);
            if (newActiveTag.isActive(year)) {
                availableActiveItems.push(newActiveTag);
            }
        }
    }
    logDebug("EXIT: GetTagsForHarvestReprint");

    return availableActiveItems;
}
function GetActiveDocumentsAsitTableArray(availableActiveItems) {
    logDebug("ENTER: GetActiveDocumentsAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    for (var tidx in availableActiveItems) {
        var tObj = availableActiveItems[tidx];

        tempObject = new Array();
        var itemCode = (isNull(tObj.IsTag(), false) ? isNull(tObj.TagType, '') : isNull(tObj.ItemCode, ''));
        var fieldInfo = new asiTableValObj("Description", itemCode + ' ' + isNull(tObj.Description, ''), "Y");
        tempObject["Description"] = fieldInfo;
        fieldInfo = new asiTableValObj("Document ID", isNull(tObj.altId, ''), "Y");
        tempObject["Document ID"] = fieldInfo;
        fieldInfo = new asiTableValObj("License Year", isNull(tObj.LicenseYear, ''), "Y");
        tempObject["License Year"] = fieldInfo;
        fieldInfo = new asiTableValObj("Select", "N", "N");
        tempObject["Select"] = fieldInfo;

        tempArray.push(tempObject);  // end of record
    }
    logDebug("EXIT: GetActiveDocumentsAsitTableArray");

    return tempArray;
}
function ReprintDocuments() {
    logDebug("ENTER: ReprintDocuments");
    try {
        var y;
        var selDocToPrint = new Array();
        if ((typeof (ACTIVEDOCUMENTS) == "object")) {
            for (y in ACTIVEDOCUMENTS) {
                if (ACTIVEDOCUMENTS[y]["Select"] == 'Yes') {
                    selDocToPrint.push(ACTIVEDOCUMENTS[y]["Document ID"]);
                }
            }
        }

        //balanceDue == 0 ^ 
        closeTask("Issuance", "Approved", "", "");

		//Get the current DEC AGENT Public User as object and attach to the new record
        var uObj = new USEROBJ(publicUserID);
        salesAgentInfoArray = getAgentInfo(publicUserID, uObj);
        attachAgent(uObj);

        //Mark Fullfillment
        var fullfillCond = '';
        if (uObj.acctType != 'CITIZEN') {
            var isCallcenter = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
            var isCampsite = (salesAgentInfoArray["Agent Group"] == "Campsite");
            var isMunicipality = (salesAgentInfoArray["Agent Group"] == "Municipality");
            var isNYSDEC_HQ = (salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
            var isNYSDEC_Regional_Office = (salesAgentInfoArray["Agent Group"] == "NYSDEC Regional Office");
            var isNative_American_Agency = (salesAgentInfoArray["Agent Group"] == "Native American Agency");
            var isRetail = (salesAgentInfoArray["Agent Group"] == "Retail");
            if (isCallcenter) {
                var condFulfill = new COND_FULLFILLMENT();
                fullfillCond = condFulfill.Condition_DailyCallCenterSales;
                addFullfillmentCondition(capId, fullfillCond);
            }
        }

        var arryTargetCapAttrib = new Array();
        var arryTag = new Array();
        var arryLic = new Array();

        for (y in selDocToPrint) {
            var itemCapId = getCapId(selDocToPrint[y]);
            var itemcap = aa.cap.getCap(itemCapId).getOutput();
            appTypeString = itemcap.getCapType().toString();
            var ata = appTypeString.split("/");
            var contactTypeToAttach = "Individual"; //Copy the Individual only as the DEC Agent may have changed and needs to be updated with current.

            var newLicId = createChildForDec(ata[0], ata[1], ata[2], ata[3], null, itemCapId, contactTypeToAttach);
            newLicIdString = newLicId.getCustomID();

            //updateTask("Issuance", "Active", "", "", "", newLicId);
            closeTaskForRec("Issuance", "Active", "", "", "", newLicId);
            updateAppStatus("Active", "Active", newLicId);
            activateTaskForRec("Report Game Harvest", "", newLicId);
            activateTaskForRec("Void Document", "", newLicId);
            activateTaskForRec("Revocation", "", newLicId);
            activateTaskForRec("Suspension", "", newLicId);

            //copyAddresses(itemCapId, newLicId);
			
            logDebug("DEBUG: Function Call copyASITables()");
            copyASITables(itemCapId, newLicId);
			logDebug("DEBUG: Function Call copyASIFields()");
            copyASIFields(itemCapId, newLicId);
			logDebug("DEBUG: Function Call copyCalcVal()");
            copyCalcVal(itemCapId, newLicId);
			//logDebug("DEBUG: Function Call copyFees()");
            //copyFees(itemCapId, newLicId); 10/31/2013 - This causes an error in ACA at the point that addFee() is called.
			logDebug("DEBUG: Function Call copyConditions()");
            copyConditions(newLicId, itemCapId);

			//Attach the current DEC AGENT
			attachAgent(uObj, newLicId);
			
            if (!matches(itemcap.getSpecialText(),null,"",undefined))
                editAppName(itemcap.getSpecialText(), newLicId);

            var licExpObj = new licenseObject(itemCapId.getCustomID(),itemCapId);
            if (!matches(licExpObj.b1ExpDate,null,"",undefined))
                setLicExpirationDate(newLicId, "", licExpObj.b1ExpDate);

			logDebug("DEBUG: Generate a new document number ...");
            var newDecDocId = GenerateDocumentNumber(newLicId.getCustomID());
			logDebug("DEBUG: New Document Number Generated: " + newDecDocId);
			
            updateDocumentNumber(newDecDocId, newLicId);

            if (ata[1] == 'Tag') {
                arryTag.push(newLicId);
            } else {
                arryLic.push(newLicId);
            }

            var result = aa.cap.createAppHierarchy(capId, newLicId);
            if (result.getSuccess()) {
                logDebug("Parent application successfully linked");
            }
            else {
                logDebug("Could not link applications" + result.getErrorMessage());
            }

            updateTagStatus("Void", "Void", itemCapId);
            closeTaskForRec("Void Document", "Void", "", "", "", itemCapId);
            closeTaskForRec("Report Game Harvest", "", "", "", "", itemCapId);
            closeTaskForRec("Revocation", "", "", "", "", itemCapId);
            closeTaskForRec("Suspension", "", "", "", "", itemCapId);
        }

        distributeFeesForReprint(capId, arryTag, arryLic, salesAgentInfoArray);
    }
    catch (err) {
        logDebug("**ERROR in ReprintDocuments:" + err.message);
    }
    logDebug("EXIT: ReprintDocuments");
}

function distributeFeesForReprint(sourceCapId, arryTag, arryLic, pSalesAgentInfoArray) {
    logDebug("ENTER: distributeFeesAndPayments");
    //logDebug("Elapsed Time: " + elapsed());

    //
    // Step 0: Make payment before distribution
    //
    //    logDebug("Step 0: Make payment before distribution");

    //    if (feeSeqList.length) {
    //        invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
    //        if (invoiceResult.getSuccess())
    //            logDebug("Invoicing assessed fee items is successful.");
    //        else
    //            logDebug("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
    //    }


    //
    // Step 1: Unapply payments from the Source
    //
    logDebug("Step 1: Unapply payments from the Source");

    var piresult = aa.finance.getPaymentByCapID(capId, null).getOutput()

    var feeSeqArray = new Array();
    var invoiceNbrArray = new Array();
    var feeAllocationArray = new Array();

    for (ik in piresult) {
        var thisPay = piresult[ik];
        var pfResult = aa.finance.getPaymentFeeItems(capId, null);
        if (pfResult.getSuccess()) {
            var pfObj = pfResult.getOutput();
            for (ij in pfObj)
                if (pfObj[ij].getPaymentSeqNbr() == thisPay.getPaymentSeqNbr()) {
                    feeSeqArray.push(pfObj[ij].getFeeSeqNbr());
                    invoiceNbrArray.push(pfObj[ij].getInvoiceNbr());
                    feeAllocationArray.push(pfObj[ij].getFeeAllocation());
                }
        }


        if (feeSeqArray.length > 0) {
            z = aa.finance.applyRefund(capId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "FeeStat", "InvStat", "123");
            if (z.getSuccess())
                logDebug("Refund applied")
            else
                logDebug("Error applying refund " + z.getErrorMessage());
        }
    }

    //
    // Step 2: void from the source
    //
    logDebug("Step 2:  void from the source");

    feeA = loadFees()

    var feeCapMessage = "";
    var amtFeeRplc1 = 0;
    var amtFeeRplc2 = 0;
    var commissionCodeRplc1 = '';
    var commissionCodeRplc2 = '';
    for (x in feeA) {
        thisFee = feeA[x];
        logDebug("status is " + thisFee.status)
        if (thisFee.code == "FEE_RPLC_1") {
            amtFeeRplc1 = thisFee.formula;
            commissionCodeRplc1 = isNull(thisFee.accCodeL3, '');
        }
        if (thisFee.code == "FEE_RPLC_2") {
            amtFeeRplc2 = thisFee.formula;
            commissionCodeRplc2 = isNull(thisFee.accCodeL3, '');
        }
        if (thisFee.status == "INVOICED") {
            voidResult = aa.finance.voidFeeItem(capId, thisFee.sequence);
            if (voidResult.getSuccess()) {
                logDebug("Fee item " + thisFee.code + "(" + thisFee.sequence + ") has been voided")
            }
            else {
                logDebug("**ERROR: voiding fee item " + thisFee.code + "(" + thisFee.sequence + ") " + voidResult.getErrorMessage());
            }

            var feeSeqArray = new Array();
            var paymentPeriodArray = new Array();

            feeSeqArray.push(thisFee.sequence);
            paymentPeriodArray.push(thisFee.period);
            var invoiceResult_L = aa.finance.createInvoice(capId, feeSeqArray, paymentPeriodArray);

            if (!invoiceResult_L.getSuccess())
                logDebug("**ERROR: Invoicing the fee items voided " + feeCapMessage + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
        }
    }

    //
    // Step 3: add the fees to the target and transfer the funds from Source to each Target cap
    //
    logDebug("Step 3: transfer the funds from Source to each Target cap");

    var perTagAmt = 0;
    var perLicAmt = 0;
    if (arryLic.length && amtFeeRplc1 > 0) {
        perLicAmt = (amtFeeRplc1 / arryLic.length)
        perLicAmt = (Math.round(perLicAmt * 100) / 100);
    }
    if (arryTag.length && amtFeeRplc2 > 0) {
        perTagAmt = (amtFeeRplc2 / arryTag.length)
        perTagAmt = (Math.round(perTagAmt * 100) / 100);
    }

    var unapplied = paymentGetNotAppliedTot()

    //Distribution for licenses
    for (var item in arryLic) {
        var targetCapId = arryLic[item];

        var targetfeeSeq_L = new Array();    // invoicing fees
        var targetpaymentPeriod_L = new Array();   // invoicing pay period
        var feeSeqAndPeriodArray = new Array(); //return values for fees and period after added

        var amtAgentCharge = perLicAmt;
        if (item == arryLic.length - 1) {
            amtAgentCharge = amtFeeRplc1 - (perLicAmt * (arryLic.length - 1));
            amtAgentCharge = (Math.round(amtAgentCharge * 100) / 100);
        }
        var cmnsPerc = GetCommissionByUser(commissionCodeRplc1 + "", pSalesAgentInfoArray);

        var amtCommission = cmnsPerc == 0 ? 0 : (cmnsPerc * amtAgentCharge) / 100;
        amtCommission = (Math.round(amtCommission * 100) / 100);
        amtAgentCharge -= amtCommission;

        feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq("AGENT_CHARGE", "FEE_REPRINT_FEE_SCHDL", 1, "FINAL", amtAgentCharge, "Y", targetCapId)
        targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
        targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);
        if (amtCommission > 0) {
            feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq("COMMISSION", "FEE_REPRINT_FEE_SCHDL", 1, "FINAL", amtCommission, "Y", targetCapId)
            targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
            targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);
        }

        createInvoice(targetfeeSeq_L, targetpaymentPeriod_L, targetCapId);

        //No need to check in dec case
        //balanceDue = parseFloat(parseFloat(targetfd.feeUnit) * parseFloat(targetfd.formula));
        //        if (unapplied < balanceDue) {
        //            logDebug("insufficient funds to do transfer from receipt record");
        //            return false;
        //        }

        var xferResult = aa.finance.makeFundTransfer(capId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, balanceDue, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
        if (xferResult.getSuccess())
            logDebug("Successfully did fund transfer to : " + targetCapId.getCustomID());
        else
            logDebug("**ERROR: doing fund transfer to (" + targetCapId.getCustomID() + "): " + xferResult.getErrorMessage());

        //
        // Step 4: On the target, loop through payments then invoices to auto-apply
        //

        var piresult = aa.finance.getPaymentByCapID(targetCapId, null).getOutput()

        for (ik in piresult) {
            var feeSeqArray = new Array();
            var invoiceNbrArray = new Array();
            var feeAllocationArray = new Array();


            var thisPay = piresult[ik];
            var applyAmt = 0;
            var unallocatedAmt = thisPay.getAmountNotAllocated()

            if (unallocatedAmt > 0) {

                var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

                for (var invCount in invArray) {
                    var thisInvoice = invArray[invCount];
                    var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
                    if (balDue > 0) {
                        feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

                        for (targetFeeNum in feeT) {
                            var thisTFee = feeT[targetFeeNum];

                            if (thisTFee.getFee() > unallocatedAmt)
                                applyAmt = unallocatedAmt;
                            else
                                applyAmt = thisTFee.getFee()   // use balance here?

                            unallocatedAmt = unallocatedAmt - applyAmt;

                            feeSeqArray.push(thisTFee.getFeeSeqNbr());
                            invoiceNbrArray.push(thisInvoice.getInvNbr());
                            feeAllocationArray.push(applyAmt);
                        }
                    }
                }

                applyResult = aa.finance.applyPayment(targetCapId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123")

                if (applyResult.getSuccess())
                    logDebug("Successfully applied payment");
                else
                    logDebug("**ERROR: applying payment to fee (" + thisTFee.getFeeDescription() + "): " + applyResult.getErrorMessage());

            }
        }
    }

    //Distribution for Tags
    for (var item in arryTag) {
        var targetCapId = arryTag[item];

        var targetfeeSeq_L = new Array();    // invoicing fees
        var targetpaymentPeriod_L = new Array();   // invoicing pay period
        var feeSeqAndPeriodArray = new Array(); //return values for fees and period after added

        var amtAgentCharge = perTagAmt;
        if (item == arryTag.length - 1) {
            amtAgentCharge = amtFeeRplc2 - (perTagAmt * (arryTag.length - 1));
            amtAgentCharge = (Math.round(amtAgentCharge * 100) / 100);
        }
        var cmnsPerc = GetCommissionByUser(commissionCodeRplc2 + "", pSalesAgentInfoArray);

        var amtCommission = cmnsPerc == 0 ? 0 : (cmnsPerc * amtAgentCharge) / 100;
        amtCommission = (Math.round(amtCommission * 100) / 100);
        amtAgentCharge -= amtCommission;

        feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq("AGENT_CHARGE", "FEE_REPRINT_FEE_SCHDL", 1, "FINAL", amtAgentCharge, "Y", targetCapId)
        targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
        targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);
        if (amtCommission > 0) {
            feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq("COMMISSION", "FEE_REPRINT_FEE_SCHDL", 1, "FINAL", amtCommission, "Y", targetCapId)
            targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
            targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);
        }

        createInvoice(targetfeeSeq_L, targetpaymentPeriod_L, targetCapId);

        //No need to check in dec case
        //balanceDue = parseFloat(parseFloat(targetfd.feeUnit) * parseFloat(targetfd.formula));
        //        if (unapplied < balanceDue) {
        //            logDebug("insufficient funds to do transfer from receipt record");
        //            return false;
        //        }

        var xferResult = aa.finance.makeFundTransfer(capId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, balanceDue, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
        if (xferResult.getSuccess())
            logDebug("Successfully did fund transfer to : " + targetCapId.getCustomID());
        else
            logDebug("**ERROR: doing fund transfer to (" + targetCapId.getCustomID() + "): " + xferResult.getErrorMessage());

        //
        // Step 4: On the target, loop through payments then invoices to auto-apply
        //

        var piresult = aa.finance.getPaymentByCapID(targetCapId, null).getOutput()

        for (ik in piresult) {
            var feeSeqArray = new Array();
            var invoiceNbrArray = new Array();
            var feeAllocationArray = new Array();


            var thisPay = piresult[ik];
            var applyAmt = 0;
            var unallocatedAmt = thisPay.getAmountNotAllocated()

            if (unallocatedAmt > 0) {

                var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

                for (var invCount in invArray) {
                    var thisInvoice = invArray[invCount];
                    var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
                    if (balDue > 0) {
                        feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

                        for (targetFeeNum in feeT) {
                            var thisTFee = feeT[targetFeeNum];

                            if (thisTFee.getFee() > unallocatedAmt)
                                applyAmt = unallocatedAmt;
                            else
                                applyAmt = thisTFee.getFee()   // use balance here?

                            unallocatedAmt = unallocatedAmt - applyAmt;

                            feeSeqArray.push(thisTFee.getFeeSeqNbr());
                            invoiceNbrArray.push(thisInvoice.getInvNbr());
                            feeAllocationArray.push(applyAmt);
                        }
                    }
                }

                applyResult = aa.finance.applyPayment(targetCapId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123")

                if (applyResult.getSuccess())
                    logDebug("Successfully applied payment");
                else
                    logDebug("**ERROR: applying payment to fee (" + thisTFee.getFeeDescription() + "): " + applyResult.getErrorMessage());

            }
        }
    }

    //logDebug("Elapsed Time: " + elapsed());
    logDebug("EXIT: distributeFeesAndPayments");
}

function isValidReprintDocuments(pStep) {
    logDebug("ENTER: isValidReprintDocuments");
    var retMsg = '';
    try {
        if (pStep == 'Step1') {
            if (!isValidUserForReprintDocuments()) {
                retMsg += 'This user is not authorized to upgrade Lifetime Licenses.';
                retMsg += '<Br />';
            }
        }
        if (pStep == 'Step2') {

            var selDocToPrint = new Array();
            if ((typeof (ACTIVEDOCUMENTS) == "object")) {
                for (var y in ACTIVEDOCUMENTS) {
                    if (ACTIVEDOCUMENTS[y]["Select"] == 'Yes') {
                        selDocToPrint.push(ACTIVEDOCUMENTS[y]["Document ID"]);
						break; //Optimization.  If we find a doc, stop looping.  We are only checking that at least one doc is Select[ed].
                    }
                }
            }

            if (selDocToPrint.length == 0) {
                retMsg += 'Please select documents to print.';
                retMsg += '<Br />';
            }
        }
    }
    catch (err) {
        logDebug("**ERROR in isValidReprintDocuments:" + err.message);
    }
    logDebug("EXIT: isValidReprintDocuments");

    return retMsg;
}
function addRepritFees() {
    logDebug("ENTER: addRepritFees");

    removeAllFees(capId);

    var y;
    var selDocToPrint = new Array();
    if ((typeof (ACTIVEDOCUMENTS) == "object")) {
        for (y in ACTIVEDOCUMENTS) {
            if (ACTIVEDOCUMENTS[y]["Select"] == 'Yes') {
                selDocToPrint.push(ACTIVEDOCUMENTS[y]["Document ID"]);
            }
        }
    }
	
	logDebug("INFO: Found " + selDocToPrint.length + " docs to be reprinted.");

    var arryTag = new Array();
    var arryLic = new Array();

	//Variables used to determine if replacement fees should NOT be assessed
	var bReplaceBackTag = false;
	var bReplaceMarineRegistry = false;
	var bBypassReplacementFee = false;
	
    for (y in selDocToPrint) {
        var itemCapId = getCapId(selDocToPrint[y]);
        var itemcap = aa.cap.getCap(itemCapId).getOutput();
        appTypeString = itemcap.getCapType().toString();
        var ata = appTypeString.split("/");

        if (ata[1] == 'Tag') {
            arryTag.push(itemCapId);
			logDebug("doc added to arryTag");
        } else {
            arryLic.push(itemCapId);
			logDebug("doc added to arryLic");
        }
	
		//11/8/2013 - If ONLY one or both of the following Documents types are being replaced, there is no Fee Assessed.
		if(appTypeString == 'Licenses/Tag/Hunting/Back') bReplaceBackTag = true;
		if(appTypeString == 'Licenses/Annual/Fishing/Marine Registry') bReplaceMarineRegistry = true;
    }

	//If there is a single back tag being replaced with a) no other licenses or b) a single marine registry license only
	if(bReplaceBackTag && arryTag.length == 1 && ((!bReplaceMarineRegistry && arryLic.length == 0) ||(bReplaceMarineRegistry && arryLic.length == 1)))
	{
		bBypassReplacementFee = true;
	}
	//If there is a single marine registry license being replaced with a) no other tags or b) a single Back Tag only
	if(bReplaceMarineRegistry && arryLic.length == 1 && ((!bReplaceBackTag && arryTag.length ==0) || (bReplaceBackTag && arryTag.length == 1)))
	{
		bBypassReplacementFee = true;
	}
		
	
	//Bypass Replacement Fees for Back Tag and/or Marine Registry?
	if(!bBypassReplacementFee)
	{
		//Assess Fees		
		if (arryTag.length > 0) 
		{
			logDebug("DEBUG: Assessing the Tag Fee: FEE_RPLC_2");
			addFeeWithVersion("FEE_RPLC_2", "FEE_REPRINT_FEE_SCHDL", 1, "FINAL", 1, "N"); //11/8/2013 - Currently $10.00	
		}
		if (arryLic.length > 0) 
		{        
			logDebug("DEBUG: Assessing the Fee: FEE_RPLC_1");
			addFeeWithVersion("FEE_RPLC_1", "FEE_REPRINT_FEE_SCHDL", 1, "FINAL", 1, "N"); //11/8/2013 - Currently $5.00
		}
	}
	else
		logDebug("Do not assess a Replacement Fee for Back Tag and/or Marine Registry.");
    

    logDebug("EXIT: addRepritFees");
}
function getHarvestPeriod(harvestType) {
    var retArray = new Array();
    if (isNull(harvestType, '') != '') {
        var ssStdChoiceValue = '';
        if (harvestType == "Bear Report") {
            ssStdChoiceValue = "HARVEST_BEAR_PERIOD";
        }
        if (harvestType == "Deer Report") {
            ssStdChoiceValue = "HARVEST_DEER_PERIOD";
        }
        if (harvestType == "Fall Turkey Report") {
            ssStdChoiceValue = "HARVEST_FALL_TURKEY_PERIOD";
        }
        if (harvestType == "Spring Turkey Report") {
            ssStdChoiceValue = "HARVEST_SPRING_TURKEY_PERIOD";
        }

        var now = new Date();
        var year = now.getFullYear()
        retArray = GetDateRange("DEC_CONFIG", ssStdChoiceValue, year)
    }
    return retArray;
}
function isValidHarvestSeasonByType(harvestType) {
    var isvalid = false;

    var rhDateRange = getHarvestPeriod(harvestType);
    var now = new Date();
    if (rhDateRange != null && rhDateRange.length > 0) {
        isvalid = (now >= rhDateRange[0] && now <= rhDateRange[1]);
    }
    return isvalid;
}
/*UPGRADE*/
function loadUpgradeLic() {
    logDebug("ENTER: loadUpgradeLic");
    var retMsg = '';
    try {
        if (!isValidUserForUpgradeLic()) {
            retMsg += 'Not authorize user to do Upgarde Lifetime Licenses.';
            retMsg += '<Br />';
        } else {
            retMsg += copyCntASIToRecASIforReprint();
            if (retMsg == '') {
                createUpgradeLicTable();
            } else {
                retMsg += '<Br />';
            }
        }
    }
    catch (err) {
        logDebug("**ERROR in loadUpgradeLic:" + err.message);
    }

    logDebug("EXIT: loadUpgradeLic");
    return retMsg;
}
function createUpgradeLicTable() {
    logDebug("ENTER: createUpgradeLicTable");
    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    for (ca in xArray) {
        var thisContact = xArray[ca];
        peopleSequenceNumber = thisContact["refcontactSeqNumber"]
        if (peopleSequenceNumber != null) {
            var asitModel;
            var new_asit;

            //if (!(typeof (LICENSESTOUPGRADE) == "object")) {
            var availableItems = GetLicsForUpgrade(peopleSequenceNumber);
            var newAsitArray = GetLicesesToupgradeAsitTableArray(availableItems);

            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "LICENSES TO UPGRADE", newAsitArray);
            //}
        }
        break;
    }
    logDebug("EXIT: createUpgradeLicTable");
}
function GetLicsForUpgrade(peopleSequenceNumber) {
    logDebug("ENTER: GetLicsForUpgrade");
    var availableActiveItems = new Array();
    var validActiveholdingsArray = new Array();
    validActiveholdingsArray.push(AA10_LIFETIME_FISHING);
    validActiveholdingsArray.push(AA13_LIFETIME_SPORTSMAN);
    validActiveholdingsArray.push(AA12_LIFETIME_SMALL_AND_BIG_GAME);

    var CC = new contactObj(null);
    CC.refSeqNumber = peopleSequenceNumber;
    var allContactCaps = CC.getCaps("Licenses/Lifetime/*/*");

    for (var ccp in allContactCaps) {
        var itemCapId = allContactCaps[ccp];
        var itemCap = aa.cap.getCap(itemCapId).getOutput();
        appTypeResult = itemCap.getCapType();
        appTypeString = appTypeResult.toString();
        if (exists(appTypeString, validActiveholdingsArray)) {
            var newActiveTag = new ACTIVE_ITEM(itemCapId, itemCap, appTypeString);
            if (newActiveTag.isActive()) {
                availableActiveItems.push(newActiveTag);
            }
        }
    }
    logDebug("EXIT: GetLicsForUpgrade");

    return availableActiveItems;
}
function GetLicesesToupgradeAsitTableArray(availableItems) {
    logDebug("ENTER: GetLicesesToupgradeAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    for (var tidx in availableItems) {
        var tObj = availableItems[tidx];

        tempObject = new Array();
        var itemCode = (isNull(tObj.IsTag(), false) ? isNull(tObj.TagType, '') : isNull(tObj.ItemCode, ''));
        var fieldInfo = new asiTableValObj("Description", itemCode + ' ' + isNull(tObj.Description, ''), "Y");
        tempObject["Description"] = fieldInfo;
        fieldInfo = new asiTableValObj("Document ID", isNull(tObj.altId, ''), "Y");
        tempObject["Document ID"] = fieldInfo;
        fieldInfo = new asiTableValObj("License Year", isNull(tObj.LicenseYear, ''), "Y");
        tempObject["License Year"] = fieldInfo;
        fieldInfo = new asiTableValObj("Select", "N", (tObj.RecordType == AA13_LIFETIME_SPORTSMAN ? "Y" : "N"));
        tempObject["Select"] = fieldInfo;
        fieldInfo = new asiTableValObj("RecordType", tObj.RecordType, "Y");
        tempObject["RecordType"] = fieldInfo;

        tempArray.push(tempObject);  // end of record
    }
    logDebug("EXIT: GetLicesesToupgradeAsitTableArray");

    return tempArray;
}
function isValidLicesesToupgrad(pStep) {
    var retMsg = '';
    //Calller ACA ONSUBMIT BEFORE UGRDSTEP1
    if (pStep == 'Step1') {
        if (!isValidUserForUpgradeLic()) {
            retMsg += 'Not authorize user to do Upgarde Lifetime Licenses.';
            retMsg += '<Br />';
        } else {

            if ((typeof (LICENSESTOUPGRADE) == "object")) {
                var isSelected = false;
                var isHaveLtSportman = false;
                for (y in LICENSESTOUPGRADE) {
                    isHaveLtSportman = (LICENSESTOUPGRADE[y]["RecordType"] == AA13_LIFETIME_SPORTSMAN);
                    if (isHaveLtSportman) {
                        break;
                    }
                }
                for (y in LICENSESTOUPGRADE) {
                    isSelected = (LICENSESTOUPGRADE[y]["Select"] == 'Yes' || LICENSESTOUPGRADE[y]["Select"] == 'Y');
                    if (isSelected) {
                        break;
                    }
                }
                if (isHaveLtSportman) {
                    retMsg += 'Already have lifetime sportsman. No need to upgrade.';
                    retMsg += '<Br />';
                } else if (!isSelected) {
                    retMsg += 'Please select licenses to upgrade.';
                    retMsg += '<Br />';
                }
            } else {
                retMsg += 'No lifetime licenses to upgrade.';
                retMsg += '<Br />';
            }
        }
    }
    //Calller ACA ONSUBMIT BEFORE UGRDSTEP2
    if (pStep == 'Step2') {
        //No Validation
    }
    return retMsg;
}
function loadTagsForSelectedUpgradeLic() {
    logDebug("ENTER: loadTagsForSelectedUpgradeLic");
    try {
        createTagsForUpgradeLicTable();
    }
    catch (err) {
        logDebug("**ERROR in loadTagsForSelectedUpgradeLic:" + err.message);
    }

    logDebug("EXIT: loadTagsForSelectedUpgradeLic");
    return true;
}

function createTagsForUpgradeLicTable() {
    logDebug("ENTER: createTagsForUpgradeLicTable");
    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    for (ca in xArray) {
        var thisContact = xArray[ca];
        peopleSequenceNumber = thisContact["refcontactSeqNumber"]
        if (peopleSequenceNumber != null) {
            var asitModel;
            var new_asit;

            //if (!(typeof (TAGVERIFICATION) == "object")) {
            var availableItems = GetTagsForUpgradeLic(peopleSequenceNumber);
            var newAsitArray = GetTagsForUpgradeLicAsitTableArray(availableItems);

            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "TAG VERIFICATION", newAsitArray);
            //}
        }
        break;
    }
    logDebug("EXIT: createTagsForUpgradeLicTable");
}
function GetTagsForUpgradeLic(peopleSequenceNumber) {
    logDebug("ENTER: GetTagsForUpgradeLic");
    var availableActiveItems = new Array();

    var validActiveholdingsArray = getActiveholdingsFilterArray();
//    var validActiveholdingsArray = new Array();
 //   for (var t in arryTags_LTSmallAndBigGame) {
  //      validActiveholdingsArray.push(arryTags_LTSmallAndBigGame[t].RecordType);
   // }

    var CC = new contactObj(null);
    CC.refSeqNumber = peopleSequenceNumber;
    var allContactCaps = CC.getCaps("Licenses/Tag/Hunting/*");

    for (var ccp in allContactCaps) {
        var itemCapId = allContactCaps[ccp];
        var itemCap = aa.cap.getCap(itemCapId).getOutput();
        appTypeResult = itemCap.getCapType();
        appTypeString = appTypeResult.toString();
		if (appTypeString.equals(AA52_TAG_BACK)) {
			continue;   // defect 15006
			}
        if (exists(appTypeString, validActiveholdingsArray)) {
            var newActiveTag = new ACTIVE_ITEM(itemCapId, itemCap, appTypeString);
            if (newActiveTag.isActiveForUpgrade()) {
                availableActiveItems.push(newActiveTag);
            }
        }
    }
    logDebug("EXIT: GetTagsForUpgradeLic");

    return availableActiveItems;
}
function isUpgradeRowReadOnly(capStatus) {
    return (capStatus == 'Void' || capStatus == 'Reported');
}
function GetTagsForUpgradeLicAsitTableArray(availableItems) {
    logDebug("ENTER: GetTagsForUpgradeLicAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    for (var tidx in availableItems) {
        var tObj = availableItems[tidx];

        tempObject = new Array();
        var itemCode = (isNull(tObj.IsTag(), false) ? isNull(tObj.TagType, '') : isNull(tObj.ItemCode, ''));
        var fieldInfo = new asiTableValObj("Description", itemCode + ' ' + isNull(tObj.Description, ''), "Y");
        tempObject["Description"] = fieldInfo;
        fieldInfo = new asiTableValObj("Document ID", isNull(tObj.altId, ''), "Y");
        tempObject["Document ID"] = fieldInfo;
        fieldInfo = new asiTableValObj("Status", isNull(tObj.CapStatus, ''), "Y");
        tempObject["Status"] = fieldInfo;
        fieldInfo = new asiTableValObj("Is returning? ", '', (isUpgradeRowReadOnly(tObj.CapStatus) ? 'Y' : 'N'));
        tempObject["Is returning?"] = fieldInfo;
        fieldInfo = new asiTableValObj("Is used?", (isUpgradeRowReadOnly(tObj.CapStatus) ? 'CHECKED' : ''), (isUpgradeRowReadOnly(tObj.CapStatus) ? 'Y' : 'N'));
        tempObject["Is used?"] = fieldInfo;

        tempArray.push(tempObject);  // end of record
    }
    logDebug("EXIT: GetTagsForUpgradeLicAsitTableArray");

    return tempArray;
}

function addFeeForUpgrade() {
    logDebug("ENTER: addFeeForUpgrade");

    try {

        var y;
        var selectionArray = new Array();
        //STEP1: Slelcted licenses to upgrade
        if ((typeof (LICENSESTOUPGRADE) == "object")) {
            var isSelected = false;
            for (y in LICENSESTOUPGRADE) {
                isSelected = (LICENSESTOUPGRADE[y]["Select"] == 'Yes' || LICENSESTOUPGRADE[y]["Select"] == 'Y');
                if (isSelected) {
                    selectionArray.push(LICENSESTOUPGRADE[y]["Document ID"]);
                }
            }
        }

        //STEP2: Collect Paid fees for selected arrays
        var amtPaid = 0;
        for (y in selectionArray) {
            var itemCapId = getCapId(selectionArray[y]);
            var pfResult = aa.finance.getPaymentFeeItems(itemCapId, null);
            if (pfResult.getSuccess()) {
                var pfObj = pfResult.getOutput();
                for (ij in pfObj) {
                    amtPaid += pfObj[ij].getFeeAllocation();
                }
            }

        }

        //STEP3: Get Fee for LifeTime Sportsman by applicant qualification
        var frm = getFormObjectForUpgrade(false);
        var feeArr = frm.getAllFeeToAdd();
        removeAllFees(capId);
        if (feeArr.length > 0) {
            for (item in feeArr) {
                var feeAmount = feeArr[item].formula;
                var amtCharge = parseFloat(parseFloat(feeAmount) - parseFloat(amtPaid));
                addFeeWithVersion("LSP_UPGRADE", feeArr[item].feeschedule, feeArr[item].version, "FINAL", (amtCharge < 0 ? 0 : amtCharge), "N")
                break;
            }
        } else {
            logDebug("**ERROR: Fee configuration issue with Lifetime sportsman");
        }
    }
    catch (err) {
        logDebug("**ERROR in addFeeForUpgrade:" + err.message);
    }
    logDebug("EXIT: addFeeForUpgrade");
}
function copyCntASIToRecASIforReprint() {
    logDebug("ENTER: copyCntASIToRecASIforReprint");
    var retMsg = '';
    var isValidToProceed = true;
    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    for (ca in xArray) {
        var thisContact = xArray[ca];
        //Copy People Tempalte Feilds
        editAppSpecific4ACA("A_FromACA", "Yes");
        editAppSpecific4ACA("A_email", thisContact["email"]);
        editAppSpecific4ACA("A_birthDate", formatMMDDYYYY(thisContact["birthDate"]));

        var strAnnual = null;
        var strPrev = null;
        var strLand = null;
        var strEduc = null;

        peopleSequenceNumber = thisContact["refcontactSeqNumber"]

        if (peopleSequenceNumber != null) {
            var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");

            //Copy All Asi Fields: asumption is identical subgroups are available in cap ASI
            var subGroupArray = getTemplateValueByFormArrays(peopleModel.getTemplate(), null, null);
            GetAllASI(subGroupArray);

            for (var subGroupName in subGroupArray) {
                var fieldArray = subGroupArray[subGroupName];
                if (subGroupName == "ADDITIONAL INFO") {
                    editAppSpecific4ACA("A_IsNYResident", fieldArray["Are You New York Resident?"]);
                    editAppSpecific4ACA("A_Preference_Points", isNull(fieldArray["Preference Points"],'0'));
                    editAppSpecific4ACA("A_Parent_Driver_License_Number", fieldArray["Parent Driver License Number"]);
                    editAppSpecific4ACA("A_NY_Resident_Proof_Document", fieldArray["NY Resident Proof Document"]);
                    continue;
                } else {
                    for (var fld in fieldArray) {
                        editAppSpecific4ACA(fld, fieldArray[fld])
                    }
                }
            }

            //Copy All ASITs : asumption is identical ASITs with subgroups are available in cap ASIT
            subGroupArray = getTemplateValueByTableArrays(peopleModel.getTemplate());
            strAnnual = GetContactASITDelimitedString(subGroupArray["ANNUAL DISABILITY"]);
            strPrev = GetContactASITDelimitedString(subGroupArray["PREVIOUS LICENSE"]);
            strLand = GetContactASITDelimitedString(subGroupArray["LAND OWNER INFORMATION"]);
            strEduc = GetContactASITDelimitedString(subGroupArray["SPORTSMAN EDUCATION"]);
        }

        //----load ASITs
        editAppSpecific4ACA("A_Annual_Disability", strAnnual);
        editAppSpecific4ACA("A_Previous_License", strPrev);
        editAppSpecific4ACA("A_Land_Owner_Information", strLand);
        editAppSpecific4ACA("A_Sportsman_Education", strEduc);

        //Contact Conditions Settings
        var contactCondArray = getContactCondutions(peopleSequenceNumber);
        editAppSpecific4ACA("A_Suspended", (isSuspension(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_Revoked_Hunting", (isRevocationHunting(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_Revoked_Trapping", (isRevocationTrapping(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_Revoked_Fishing", (isRevocationFishing(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_AgedIn", (isMarkForAgedInFulfillment(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_NeedHuntEd", (isMarkForNeedHutEdFulfillment(contactCondArray) ? "Yes" : "No"));

        if (isSuspension(contactCondArray) || isRevocationHunting(contactCondArray) || isRevocationTrapping(contactCondArray) || isRevocationFishing(contactCondArray)) {
            retMsg = 'License to buy privilages are suspended. Please contact DEC Sales.';
            isValidToProceed = false;
        }
        break;
    }

    logDebug("EXIT: copyCntASIToRecASIforReprint");

    return retMsg;
}
function getActiveHoldingsForUpgrade(peopleSequenceNumber, year) {
    var availableActiveItems = new Array();
    var validActiveholdingsArray = getActiveholdingsFilterArray();

    var CC = new contactObj(null);
    CC.refSeqNumber = peopleSequenceNumber;
    var allContactCaps = CC.getCaps("Licenses/*/*/*");

    for (var ccp in allContactCaps) {
        var itemCapId = allContactCaps[ccp];
        var itemCap = aa.cap.getCap(itemCapId).getOutput();
        appTypeResult = itemCap.getCapType();
        appTypeString = appTypeResult.toString();
        if (exists(appTypeString, validActiveholdingsArray)) {
            var newActiveTag = new ACTIVE_ITEM(itemCapId, itemCap, appTypeString);
            if (newActiveTag.isActiveForUpgrade(year)) {
                availableActiveItems.push(newActiveTag);
            }
        }
    }
    return availableActiveItems;
}

function getFormObjectForUpgrade(isGetActiveHoldings) {
    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    var dob;
    var isNyResiDent;

    for (ca in xArray) {
        var thisContact = xArray[ca];
        peopleSequenceNumber = thisContact["refcontactSeqNumber"]
        break;
    }

    var strAllHolding = '';
    if (isGetActiveHoldings) {
        if (peopleSequenceNumber != null) {
            var availableActiveItems = getActiveHoldingsForUpgrade(peopleSequenceNumber, AInfo["License Year"]);
            strAllHolding = GetActiveHoldingsDelimitedString(availableActiveItems);
        }

    }

    var f = new form_OBJECT(GS2_SCRIPT);
    f.Year = AInfo["License Year"];
    f.DOB = AInfo["A_birthDate"];
    f.Email = AInfo["A_email"];
    f.IsNyResiDent = AInfo["A_IsNYResident"];
    f.PreferencePoints = AInfo["A_Preference_Points"];
    f.SetAnnualDisability(AInfo["A_Annual_Disability"]);
    f.SetPriorLicense(AInfo["A_Previous_License"]);
    f.SetSportsmanEducation(AInfo["A_Sportsman_Education"]);
    f.SetLandOwnerInfo(AInfo["A_Land_Owner_Information"]);
    f.SetActiveHoldingsInfo(AInfo["A_ActiveHoldings"]);
    f.IsPermanentDisabled = AInfo["Permanent Disability"];
    f.SetActiveHoldingsInfo(strAllHolding);
    f.IsMilitaryServiceman = AInfo["Military Serviceman"];
    f.IsNativeAmerican = AInfo["A_IsNativeAmerican"];
    f.IsLegallyBlind = AInfo["Legally Blind"];
    f.SetActiveHoldingsInfo(strAllHolding);
    var ruleParams = f.getRulesParam();

    //Get Vesion Items for Year Only
    if (f.Year == null || f.Year == '') {
        f.VersionItems = new Array();
        //DO Nothing
        //var overlapPeriod = GetOverLapPeriod();
        //this.Year = overlapPeriod[0];
        //this.VersionItems = versions.GetVersionItems(this.Year);
    } else {
        f.VersionItems = f.versions.GetVersionItems(f.Year);
    }

    for (var idx = 0; idx < f.licObjARRAY.length; idx++) {
        //1. Availability Rules
        //var lic = new License_OBJ();
        var lic = f.licObjARRAY[idx];
        if (lic.Identity == LIC13_LIFETIME_SPORTSMAN) {
            f.SetSelected(lic.Identity, true,1);
            var isActive = false;
            isActive = f.IsActiveItem(lic.Identity);
            f.SetItemFeeSched(lic.Identity);
            if (isActive) {
                //eval("isSelectable = " + this.licObjARRAY[idx].FNIsSelectableRule + "(ruleParams);");
                var ofd = getFeeCodeByRule(ruleParams, f.licObjARRAY[idx].feeschedule, f.licObjARRAY[idx].feeversion, f.licObjARRAY[idx].FNfeeRule);
                if (ofd != null) {
                    f.licObjARRAY[idx].feecode = ofd.feeCode;
                    f.licObjARRAY[idx].feeDesc = ofd.feeDesc;
                    f.licObjARRAY[idx].comments = ofd.comments;
                    f.licObjARRAY[idx].Code3commission = ofd.Code3commission + "";
                    f.licObjARRAY[idx].DecCode = GetItemCode(f.licObjARRAY[idx].Code3commission + "");
                    f.licObjARRAY[idx].CodeDescription = GetItemCodedesc(f.licObjARRAY[idx].DecCode);
                    f.licObjARRAY[idx].formula = ofd.formula;
                    f.licObjARRAY[idx].feeUnit = f.GetQuantity(lic.Identity);
                }
            }
        }
    }

    return f;
}

function upgradeLifetimeLic() {
    logDebug("ENTER: upgradeLifetimeLic");
    try {
        var syear = AInfo["License Year"];
        var itemCapId;

        var frm = getFormObjectForUpgrade(true);
        //Update Reported;

        //balanceDue == 0 ^ 
        closeTask("Issuance", "Approved", "", "");

        var voidSelectedItems = new Array();
        if ((typeof (LICENSESTOUPGRADE) == "object")) {
            for (y in LICENSESTOUPGRADE) {
                var isSelected = (LICENSESTOUPGRADE[y]["Select"] == 'Yes' || LICENSESTOUPGRADE[y]["Select"] == 'Y');
                if (isSelected) {
                    voidSelectedItems.push(LICENSESTOUPGRADE[y]["Document ID"]);
                }
            }
        }

		// void the privilege panel issue 13656
		var xArray = getApplicantArrayEx();
		var peopleSequenceNumber = null;
		for (ca in xArray) {
			var thisContact = xArray[ca];
			peopleSequenceNumber = thisContact["refcontactSeqNumber"]
			break;
			}
		
		if (peopleSequenceNumber) {
			var CC = new contactObj(null);
			CC.refSeqNumber = peopleSequenceNumber;
			logDebug("upgradeLifetimeLic peopleseqnumber = " + frm.peopleSequenceNumber);
			var ppPanel = CC.getCaps(AA54_TAG_PRIV_PANEL);
					
			for (var y in ppPanel) {
				voidSelectedItems.push(ppPanel[y].getCustomID());
				logDebug("upgradeLifetimeLic found Priv Panel to Void " + ppPanel[y].getCustomID());
				}
			}
			
        //(Void slected Lifetime liceses)
        for (var y in voidSelectedItems) {
            frm.RemoveActiveHoldingsbyDocId(voidSelectedItems[y]);
            itemCapId = getCapId(voidSelectedItems[y]);
			logDebug("upgradeLifetimeLic voiding cap Id " + itemCapId);
            updateAppStatus("Void", "Void", itemCapId);
            closeTaskForRec("Void Document", "Void", "", "", "", itemCapId);
            closeTaskForRec("Report Game Harvest", "", "", "", "", itemCapId);
            closeTaskForRec("Revocation", "", "", "", "", itemCapId);
            closeTaskForRec("Suspension", "", "", "", "", itemCapId);
        }

        var returningDocArray = new Array();
        var notusedDocArray = new Array();
        var y;
        if ((typeof (TAGVERIFICATION) == "object")) {
            for (y in TAGVERIFICATION) {
                //logDebug(TAGVERIFICATION[y]["Is returning?"]);
                //logDebug(TAGVERIFICATION[y]["Is used?"]);

                if (TAGVERIFICATION[y]["Is returning?"] == 'CHECKED') {
                    frm.RemoveActiveHoldingsbyDocId(TAGVERIFICATION[y]["Document ID"]);
                    returningDocArray.push(TAGVERIFICATION[y]["Document ID"]);
                }
                if (TAGVERIFICATION[y]["Is used?"] != 'CHECKED') {
                    notusedDocArray.push(TAGVERIFICATION[y]["Document ID"]);
                }
            }
        }

        //(returning => make it returnable)
        for (y in returningDocArray) {
            itemCapId = getCapId(returningDocArray[y]);
            updateAppStatus("Returnable", "Returnable", itemCapId);
        }


        var uObj = new USEROBJ(publicUserID);
        salesAgentInfoArray = getAgentInfo(publicUserID, uObj);
        attachAgent(uObj);

        //Mark Fullfillment
        var fullfillCond = '';
        if (uObj.acctType != 'CITIZEN') {
            var isCallcenter = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
            var isCampsite = (salesAgentInfoArray["Agent Group"] == "Campsite");
            var isMunicipality = (salesAgentInfoArray["Agent Group"] == "Municipality");
            var isNYSDEC_HQ = (salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
            var isNYSDEC_Regional_Office = (salesAgentInfoArray["Agent Group"] == "NYSDEC Regional Office");
            var isNative_American_Agency = (salesAgentInfoArray["Agent Group"] == "Native American Agency");
            var isRetail = (salesAgentInfoArray["Agent Group"] == "Retail");
            if (isCallcenter) {
                var condFulfill = new COND_FULLFILLMENT();
                fullfillCond = condFulfill.Condition_DailyCallCenterSales;
                addFullfillmentCondition(capId, fullfillCond);
            }
        }

        //Get Fees
        var newfd = new FeeDef();
        var feeArr = frm.getAllFeeToAdd();
        for (item in feeArr) {
            newfd.feeschedule = feeArr[item].feeschedule;
            newfd.version = feeArr[item].version;
            newfd.feeCode = feeArr[item].feeCode;
            newfd.formula = feeArr[item].formula;
            newfd.feeUnit = feeArr[item].feeUnit;
            newfd.feeDesc = feeArr[item].feeDesc;
            newfd.comments = feeArr[item].comments;
            newfd.Code3commission = feeArr[item].Code3commission;
            break;
        }

        var arryTargetCapAttrib = new Array();
        var recArr = frm.licObjARRAY;
        var ruleParams = frm.getRulesParam();
        for (var item in recArr) {
            var oLic = recArr[item];
            if (oLic.IsSelected) {

                var ats = oLic.RecordType;
                var ata = ats.split("/");
                if (ata.length != 4) {
                    logDebug("**ERROR in issueSelectedSalesItems.  The following Application Type String is incorrectly formatted: " + ats);
                } else {
                    var newLicId = issueSubLicense(ata[0], ata[1], ata[2], ata[3], "Active");
                    editAppName(oLic.CodeDescription, newLicId);

                    var effectiveDt;
                    var seasonPeriod = GetDateRange(DEC_CONFIG, LICENSE_SEASON, syear);
                    var diff = dateDiff(new Date(), seasonPeriod[0])
					setLicExpirationDate(newLicId, dateAdd(null,0));	// defect 13656
                    if (diff > 0) {
                        AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(seasonPeriod[0]);
                        editFileDate(newLicId, seasonPeriod[0]);
                    } else {
                        AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(new Date());
                        editFileDate(newLicId, new Date());
                    }

                    setSalesItemASI(newLicId, oLic.RecordType, oLic.DecCode, oLic.feeUnit, null, null);
					
					var TagsArray = null;
                    if (isNull(oLic.FNTagsArray, '') != '') {
						eval("TagsArray = " + oLic.FNTagsArray + "(ruleParams);");
                    }
					
                    oLic.TagsArray = TagsArray;					
					var tagPropArray = new Array()
                    for (var t in oLic.TagsArray) {
						var tagProp = tagsMap.get(oLic.TagsArray[t]);
                        tagPropArray.push(tagProp);
                    }
					
                    CreateTags(tagPropArray, ruleParams, oLic.DecCode, "");
					// added priv panel defect 13656
					createPrivilagePanel(ruleParams);

                    var newDecDocId = GenerateDocumentNumber(newLicId.getCustomID());
                    updateDocumentNumber(newDecDocId, newLicId);

                    //maintain array for later actions
                    arryTargetCapAttrib.push(new TargetCAPAttrib(newLicId, newfd));

                    //connect With main Upgraded
                    for (y in notusedDocArray) {
                        itemCapId = getCapId(notusedDocArray[y]);
                        var result = aa.cap.createAppHierarchy(capId, itemCapId);
                        if (result.getSuccess()) {
                            logDebug("Successfully linked");
                        }
                        else {
                            logDebug("Could not link DMP" + result.getErrorMessage());
                        }

                    }
                }
            }
        }
        distributeFeesAndPayments(capId, arryTargetCapAttrib, salesAgentInfoArray);
    }
    catch (err) {
        logDebug("**ERROR in upgradeLifetimeLic:" + err.message);
    }
    logDebug("EXIT: upgradeLifetimeLic");
}


function isValidVoidSales(pStep) {
    logDebug("ENTER: isValidVoidSales");
    var retMsg = ''
    //ACA ONSUBMIT BEFORE VDSLSTEP1
    if (pStep == 'Step1') {
        if (!isValidUserForVoidSales()) {
            retMsg += 'Not authorize user to void sales.';
            retMsg += '<Br />';
        } else {
            /*
            var decCustId = AInfo["Customer ID"];
            if (!isValidDecIdWithDOB(isNull(decCustId, ''), null)) {
            retMsg += 'Please enter valid customer id.';
            retMsg += '<Br />';
            }
            */
        }
    }

    //ACA ONSUBMIT BEFORE VDSLSTEP2
    if (pStep == 'Step2') {
        var selDocToVoid = new Array();
        if ((typeof (VOIDDOCUMENTS) == "object")) {
            for (var y in VOIDDOCUMENTS) {
                if (VOIDDOCUMENTS[y]["Select"] == 'Yes') {
                    selDocToVoid.push(VOIDDOCUMENTS[y]["Document ID"]);
                }
            }
        }

        if (selDocToVoid.length == 0) {
            retMsg += 'Please select documents to void.';
            retMsg += '<Br />';
        }
    }

    logDebug("EXIT: isValidVoidSales");

    return retMsg;
}
function loadDocumentToVoid() {
    logDebug("ENTER: loadDocumentToVoid");

    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    var decCustId;

    for (ca in xArray) {
        var thisContact = xArray[ca];
        peopleSequenceNumber = thisContact["refcontactSeqNumber"]
        decCustId = thisContact["passportNumber"];
        break;
    }

    editAppSpecific4ACA("Customer ID", decCustId);

    var availableDocsToVoidItems = GetDocsToVoidSale(decCustId);
    var newAsitArray = GetDocsToVoidsAsitTableArray(availableDocsToVoidItems)
    asitModel = cap.getAppSpecificTableGroupModel();
    new_asit = addASITable4ACAPageFlow(asitModel, "VOID DOCUMENTS", newAsitArray);

    logDebug("EXIT: loadDocumentToVoid");
}
function GetDocsToVoidSale(peopleSequenceNumber) {
    logDebug("ENTER: GetDocsToVoidSale");
    var availableDocsToVoidItems = new Array();
    var validVoidableFilterArray = getVoidableFilterArray();

    var CC = new contactObj(null);
    CC.refSeqNumber = peopleSequenceNumber;

    // get the agent's info
    var agentObj = new USEROBJ(publicUserID);
    
    
    var applicationToChechArray = new Array();
    applicationToChechArray.push('Licenses/Annual/Application/NA');
    applicationToChechArray.push('Licenses/Sales/Reprint/Documents');
    applicationToChechArray.push('Licenses/Sales/Upgrade/Lifetime');

    for (var aRec in applicationToChechArray) {
        logDebug(applicationToChechArray[aRec]);
        var allContactCaps = CC.getCaps(applicationToChechArray[aRec]);
        for (var ccp in allContactCaps) {
            var itemCapId = allContactCaps[ccp];
            var itemCap = aa.cap.getCap(itemCapId).getOutput();
            appTypeString = itemCap.getCapType().toString();
            var appRec = new ACTIVE_ITEM(itemCapId, itemCap, appTypeString);
            if (appRec.isOpenToday()) {
                var searchAppTypeString = "Licenses/*/*/*";
                var capArray = getChildren(searchAppTypeString, itemCapId);
                if (capArray != null) {
                    for (y in capArray) {
                        var childCapId = capArray[y];
                        var itemCap = aa.cap.getCap(childCapId).getOutput();
                        appTypeString = itemCap.getCapType().toString();
                        var ata = appTypeString.split("/");

                        if (exists(appTypeString, validVoidableFilterArray)) {
				if (doesRefContactExistOnRecord(agentObj.authAgentPeopleSequenceNumber, childCapId)) {
                            		var newActiveTag = new ACTIVE_ITEM(childCapId, itemCap, appTypeString);
                            		if (newActiveTag.isActive()) {
                                		availableDocsToVoidItems.push(newActiveTag);
					}
				}
                        }
                    }
                }
            }
        }
    }
    logDebug("EXIT: GetDocsToVoidSale");

    return availableDocsToVoidItems;
}	


function doesRefContactExistOnRecord(refSeqNum, itemCap) {

	conArr = getContactObjs(itemCap);
	if (conArr && conArr.length > 0) {
		for (conArrIndex in conArr) {
			thisCon = conArr[conArrIndex];
			if (thisCon.refSeqNumber.equals(refSeqNum)) 
				return true;
		}
	}
	return false;
}

function GetDocsToVoidsAsitTableArray(availableDocsToVoidItems) {
    logDebug("ENTER: GetDocsToVoidsAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    for (var tidx in availableDocsToVoidItems) {
        var tObj = availableDocsToVoidItems[tidx];

        tempObject = new Array();
        var itemCode = (isNull(tObj.IsTag(), false) ? isNull(tObj.TagType, '') : isNull(tObj.ItemCode, ''));
        var fieldInfo = new asiTableValObj("Description", itemCode + ' ' + isNull(tObj.Description, ''), "Y");
        tempObject["Description"] = fieldInfo;
        fieldInfo = new asiTableValObj("Document ID", isNull(tObj.altId, ''), "Y");
        tempObject["Document ID"] = fieldInfo;
        fieldInfo = new asiTableValObj("License Year", isNull(tObj.LicenseYear, ''), "Y");
        tempObject["License Year"] = fieldInfo;
        fieldInfo = new asiTableValObj("Select", "N", "N");
        tempObject["Select"] = fieldInfo;

        tempArray.push(tempObject);  // end of record
    }
    logDebug("EXIT: GetDocsToVoidsAsitTableArray");

    return tempArray;
}
function VoidsSales() {
    logDebug("ENTER: VoidsSales");

    try {
        var y;
        var selDocToVoid = new Array();
        if ((typeof (VOIDDOCUMENTS) == "object")) {
            for (y in VOIDDOCUMENTS) {
                if (VOIDDOCUMENTS[y]["Select"] == 'Yes') {
                    selDocToVoid.push(VOIDDOCUMENTS[y]["Document ID"]);
                }
            }
        }

        //balanceDue == 0 ^ 
        closeTask("Issuance", "Approved", "", "");

        var uObj = new USEROBJ(publicUserID);
        salesAgentInfoArray = getAgentInfo(publicUserID, uObj);
        attachAgent(uObj);

        for (y in selDocToVoid) {
            var itemCapId = getCapId(selDocToVoid[y]);
            var itemcap = aa.cap.getCap(itemCapId).getOutput();
            appTypeString = itemcap.getCapType().toString();
            var ata = appTypeString.split("/");

            voidRec(itemCapId);

	    
	    // find privilege panel - it is a child of this records parent application
	    logDebug("Marking privilege panel");
	    pId = getParent(itemCapId);
	    if (appMatch("Licenses/Annual/Application/NA", pId) ) {
		    childArr = getChildren("Licenses/Tag/Document/Privilege Panel", pId);
		    if (childArr != null && childArr.length > 0) {
			    ppCapId = childArr[0];
		    	    voidPrivilegePanel(ppCapId, itemCapId);
		    }
	    }
	    var associatedTagArray = getTagsAssociatedToLicense(appTypeString);
	    for (var tIndex in associatedTagArray) {
		tagID = associatedTagArray[tIndex];
		tagCapId = getTagRecordID(tagID);
		if (tagCapId != null) 
			voidRec(tagCapId);
	    }
            var result = aa.cap.createAppHierarchy(capId, itemCapId);
            if (result.getSuccess()) {
                logDebug("Parent application successfully linked");
            }
            else {
                logDebug("Could not link applications" + result.getErrorMessage());
            }
        }
    }
    catch (err) {
        logDebug("Exception in VoidsSales:" + err.message);
    }
    logDebug("EXIT: VoidsSales");
}

function getTagsAssociatedToLicense(licAppType) {
	associatedTagArray = null;
	switch ("" + licAppType) {
		case AA04_BOWHUNTING_PRIVILEGE:
		case AA07_MUZZLELOADING_PRIVILEGE:
		case AA30_NONRES_MUZZLELOADING:
		case AA34_NONRESIDENT_BOWHUNTING:
			associateTagArray = new Array();
 			associatedTagArray.push(TAG_TYPE_1_BACK_TAG);
        		associatedTagArray.push(TAG_TYPE_19_DEER_OF_EITHER_SEX_TAG);
        		associatedTagArray.push(TAG_TYPE_20_ANTLERLESS_DEER_TAG);
			break;
		case AA08_TURKEY_PERMIT:
			associatedTagArray = getTag_ANNUAL_TRKY_2014();
			break;
		case AA27_CONSERVATION_LEGACY:
			associatedTagArray = getTag_CONSERVATION_LEGACY();
			break;
		case AA29_JUNIOR_HUNTING:
			associateTagArray = new Array();
			associatedTagArray.push(TAG_TYPE_1_BACK_TAG);
        		associatedTagArray.push(TAG_TYPE_3_REG_SEASON_DEER);
        		associatedTagArray.push(TAG_TYPE_2_BEAR_TAG);
			break;
		case AA31_NONRES_SUPER_SPORTSMAN:
			associatedTagArray = getTag_NONRES_SUPER_SPORTSMAN();
			break;
		case AA32_NONRESIDENT_BEAR_TAG:
			associatedTagArray = getTag_NONRESIDENT_BEAR_TAG();
			break;
		case AA33_NONRESIDENT_BIG_GAME:
			associatedTagArray = getTag_NONRES_BIG_GAME();
			break;
		case AA35_NONRESIDENT_SMALL_GAME:
			associatedTagArray = getTag_NONRES_SMALL_GAME();
			break;
		case AA36_NONRESIDENT_TURKEY:
			associatedTagArray = getTag_NONRESIDENT_TURKEY();
			break;
		case AA37_SMALL_AND_BIG_GAME:
			associatedTagArray = getTag_SMALL_AND_BIG_GAME();
			break;
		case AA38_SMALL_GAME:
			associatedTagArray = getTag_SMALL_GAME();
			break;
		case AA39_SPORTSMAN:
			associatedTagArray = getTag_SPORTSMAN();
			break;
		case AA40_SUPER_SPORTSMAN:
			associatedTagArray = getTag_SUPER_SPORTSMAN();
			break;
		case AA42_TRAPPER_SUPER_SPORTSMAN:
			associatedTagArray = getTag_TRAPPER_SUPER_SPORTSMAN();
			break;
		default:
			break;
	}
	return associatedTagArray;
}

function getTagRecordID(tagID) {

	tagType = lookup("TAG_TYPE", tagID);
        if ((typeof (VOIDDOCUMENTS) == "object")) {
            for (vdi in VOIDDOCUMENTS) {
		tagDesc = ""  + VOIDDOCUMENTS[vdi]["Description"];
		if (tagDesc.indexOf(tagType) >= 0) {
			tagRecordNumber = VOIDDOCUMENTS[vdi]["Document ID"];
			tagCapId = getCapId(tagRecordNumber);
			return tagCapId;
                }
            }
	}
	return null;
}

function voidRec(itemCapId) {
  	//Update Status
        updateTagStatus("Void", "Void", itemCapId);
        //updateTask("Void Document", "Void", "", "", "", itemCapId);
        closeTaskForRec("Void Document", "Void", "", "", "", itemCapId);
        closeTaskForRec("Report Game Harvest", "", "", "", "", itemCapId);
        closeTaskForRec("Revocation", "", "", "", "", itemCapId);
        closeTaskForRec("Suspension", "", "", "", "", itemCapId);
}


function voidPrivilegePanel(ppCapId, parentCapId) {

	logDebug("ENTER: voidPrivilege Panel " + ppCapId.getCustomID());
	updateAppStatus("Returnable", "Returnable", ppCapId);
	// now create a new one, 
	newPPId = createChildForDec("Licenses", "Tag", "Document", "Privilege Panel", "", parentCapId);
	copyASIFields(ppCapId, newPPId);
	updateAppStatus("Active", "Active", newPPId);
	activateTaskForRec("Report Game Harvest", "", newPPId);
        activateTaskForRec("Void Document", "", newPPId);
        activateTaskForRec("Revocation", "", newPPId);
        activateTaskForRec("Suspension", "", newPPId);	
        copyConditions(ppCapId, newPPId);

	//copy the expiration information
	oldLicObj = new licenseObject(null, ppCapId);
	if (oldLicObj && oldLicObj != null) {
		setLicExpirationStatus(newPPId, "Active");
		oldExpDate = oldLicObj.b1ExpDate;
		setLicExpirationDate(newPPId,null,oldExpDate);
	} 
	var newDecDocId = GenerateDocumentNumber(newPPId.getCustomID());
        updateDocumentNumber(newDecDocId, newPPId);
	logDebug("EXIT: voidPrivilege Panel");
}
