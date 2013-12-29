/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_REBUILD_TAGS.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be
|           available to all master scripts
|
| Notes   : 10/15/2013,     Laxmikant Bondre (LBONDRE).
|                           Logic to Rebuild All tags for a Reference Contact.
|                           This routine should analyze given Reference Contact, Look at his / her age on given EffDate, Education,
|                           what Lifetime Licenses he / she has for the Year for which the give Efective Date is in Season.
|                           So what tags he / she should have and what tags he / she has.
|                           Create the Tags which are not there and Create an parent application for these tags.
|                           The Status of the Application should be "Approved" and put the Condition "Auto-Generated Applications" on this application.
/------------------------------------------------------------------------------------------------------*/

function rebuildAllTagsforaRefContact(ipRefContact,ipEffDate) {
    opErrors = null;
    logDebug("Ref Contact: " + ipRefContact);
    var fvContactQry = aa.people.getPeople(ipRefContact);
    if (!fvContactQry || !fvContactQry.getSuccess()) {
        opErrors = createError(opErrors,"Contact not Found: " + ipRefContact);
        return opErrors;
    }
    var fvContact = fvContactQry.getOutput();
    if (!fvContact) {
        opErrors = createError(opErrors,"Contact not Found: " + ipRefContact);
        return opErrors;
    }
    if (fvContact.contactType != "Individual") {
        opErrors = createError(opErrors,"Contact " + ipRefContact + " is not an Individual.");
        return opErrors;
    }
    if (fvContact.getDeceasedDate()) {
        opErrors = createError(opErrors,"Contact " + ipRefContact + " has Deceased Date.");
        return opErrors;
    }
    var fvEnforcements = getEnforcements(ipRefContact);
    if (fvEnforcements.suspension) {
        opErrors = createError(opErrors,"Contact " + ipRefContact + " has Suspension of Privileges.");
        return opErrors;
	}
    var fvProcessYear = getProcessYear(ipEffDate);
    var fvSeason =  getSeasonDates(fvProcessYear);
    var fvStartDate = fvSeason.StartDate;
    var fvExpDate = fvSeason.EndDate;
    var fvAge = getRefContactAgeAsOnDate(ipRefContact,ipEffDate);
    var fvSpEd = getSpEd(ipRefContact);
    logDebug("Education: " + fvSpEd);
    var fvLifeLic = getLifetimeLicenses(ipRefContact);
    logDebug("Lifetime Licenses: " + fvLifeLic);
    var fvEligibleTags = calculateEligTags(fvLifeLic,fvSpEd,fvAge,fvEnforcements,fvProcessYear);
    logDebug("Eligible Tags: " + fvEligibleTags);
    var fvExistTags = getExistingTags(ipRefContact,fvExpDate,fvEligibleTags);
    logDebug("Existing Tags: " + fvExistTags);
    var opErrors = createNewTags(ipRefContact,fvStartDate,fvExpDate,fvEligibleTags);
    return opErrors;
}

function getProcessYear(ipEffDate) {
    var fvDateRange = lookup("DEC_CONFIG", "LICENSE_SEASON");
    var fvDateArr = fvDateRange.split("-");
    opYear = ipEffDate.getFullYear();
    var fvStartStr = fvDateArr[0] + "/" + opYear.toString();
    var fvStartDt = new Date(fvStartStr);
    if (ipEffDate.getTime() < fvStartDt.getTime())
        opYear--;
    return opYear;
}

function getSeasonDates(ipProcessYear) {
    var fvDateRange = lookup("DEC_CONFIG", "LICENSE_SEASON");
    var fvDateArr = fvDateRange.split("-");
    var fvStartStr = fvDateArr[0] + "/" + ipProcessYear;
    var fvStartDt = new Date(fvStartStr);
    var fvEndStr = fvDateArr[1] + "/" + ipProcessYear;
    var fvEndDt = new Date(fvEndStr);
    if (fvEndDt.getTime() < fvStartDt.getTime()) {
        ipProcessYear++;
        var fvEndStr = fvDateArr[1] + "/" + ipProcessYear;
        var fvEndDt = new Date(fvEndStr);
    }
    var opSeason = new Array();
    opSeason["StartDate"] = fvStartDt;
    opSeason["EndDate"] = fvEndDt;
    return opSeason;
}

function getRefContactAgeAsOnDate(ipRefContact,ipEffDate) {
    var opAge = 0;
    var fvContactQry = aa.people.getPeople(ipRefContact);
    if (fvContactQry.getSuccess()) {
        var fvContact = fvContactQry.getOutput();
        if (fvContact.getBirthDate()) {
            var fvBDtStr = fvContact.getBirthDate().toString();
            var fvBDtArr = fvBDtStr.split(" ");
            fvBDtStr = fvBDtArr[0];
            fvBDtArr = fvBDtStr.split("-");
            fvBDtStr = fvBDtArr[1].toString() + "/" + fvBDtArr[2].toString() + "/" + fvBDtArr[0].toString();
            var fvBirthDate = new Date(fvBDtStr);
            opAge = getCompletedAge(fvBirthDate,ipEffDate);
        }
    }
    return opAge;
}

function getCompletedAge(ipBirthDate,ipEffDate) {
    var opAge = ipEffDate.getFullYear() - ipBirthDate.getFullYear();
    ipBirthDate.setHours(0);
    ipBirthDate.setMinutes(0);
    ipBirthDate.setSeconds(0);
    ipEffDate.setHours(0);
    ipEffDate.setMinutes(0);
    ipEffDate.setSeconds(0);

    var fvEffBirthDate = ipBirthDate;
    fvEffBirthDate.setFullYear(ipEffDate.getFullYear());
    if (fvEffBirthDate.getTime() > ipEffDate.getTime())
        opAge--;
    return opAge;
}

function getSpEd(ipRefContact) {
    var fvSubGroupName = "SPORTSMAN EDUCATION";
    var fvFieldNameType = "Sportsman Education Type";
    var fvFieldNameRevoked = "Revoked";

    var fvPeopleModel = aa.people.getPeople(ipRefContact).getOutput();

    var fvSpEdArray = aa.util.newHashMap();
    if (fvPeopleModel) {
        var fvTemplate = fvPeopleModel.getTemplate();
        if (fvTemplate) {
            var fvTemplateGroups = fvTemplate.getTemplateTables();
            if (fvTemplateGroups && fvTemplateGroups.size() > 0) {
                var fvSubGroups = fvTemplateGroups.get(0).getSubgroups();
                for (var fvSubGroupIndex = 0; fvSubGroupIndex < fvSubGroups.size(); fvSubGroupIndex++) {
                    var fvSubGroup = fvSubGroups.get(fvSubGroupIndex);
                    if (fvSubGroupName != fvSubGroup.getSubgroupName())
                        continue;

                    var fvFields = fvSubGroup.getFields();
                    if (fvFields) {
                        var fvFieldPosType = -1;
                        var fvFieldPosRevoked = -1;
                        for (var fvCounter = 0; fvCounter < fvFields.size(); fvCounter++) {
                            var fvField = fvFields.get(fvCounter);
                            if (fvField.fieldName == fvFieldNameType)
                                fvFieldPosType = fvCounter;
                            if (fvField.fieldName == fvFieldNameRevoked)
                                fvFieldPosRevoked = fvCounter;
                        }

                        var fvRows = fvSubGroup.getRows();
                        if (fvRows) {
                            for (var fvCounter = 0; fvCounter < fvRows.size(); fvCounter++) {
                                var fvRow = fvRows.get(fvCounter);
                                var fvRowValues = fvRow.getValues();
                                var fvValueRevoked = fvRowValues.get(fvFieldPosRevoked);
                                if (fvValueRevoked.value == "CHECKED" )
                                    continue;
                                var fvValueType = fvRowValues.get(fvFieldPosType);
                                fvSpEdArray.put(fvValueType.value,fvValueType.value);
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    return fvSpEdArray;
}

function getLifetimeLicenses(ipRefContact) {
    var opLL = aa.util.newHashMap();
    var fvPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
    var fvCcb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
    fvPeople.setServiceProviderCode(aa.getServiceProviderCode());
    fvPeople.setContactSeqNumber(ipRefContact);

    var fvCapsQry = fvCcb.getCapContactsByRefContactModel(fvPeople);
    if (!fvCapsQry)
        return opLL;
    var fvCaps = fvCapsQry.toArray();
    if (!fvCaps)
        return opLL;

    for (var fvCounter in fvCaps) {
        var fvCap = fvCaps[fvCounter];
        if (!fvCap)
            continue;
        var fvCapIDTmp = fvCap.getCapID();
        if (!fvCapIDTmp)
            continue;
        var fvCapIDQry = aa.cap.getCapID(fvCapIDTmp.getID1(), fvCapIDTmp.getID2(), fvCapIDTmp.getID3());
        if (!fvCapIDQry || !fvCapIDQry.getSuccess())
            continue;
        var fvCapID = fvCapIDQry.getOutput();
        if(!fvCapID)
            continue;
        var fvCapMQry = aa.cap.getCap(fvCapID);
        if (!fvCapMQry || !fvCapMQry.getSuccess())
            continue;
        var fvCapM = fvCapMQry.getOutput();
        if (!fvCapM)
            continue;
        var fvCapType = fvCapM.getCapType();
        if (!fvCapType)
            continue;

        if (fvCapType.getGroup() != "Licenses" || fvCapType.getType() != "Lifetime")
           continue;
        if (fvCapType.getSubType() == "Other" || fvCapType.getSubType() == "Fishing")
           continue;
        if (fvCapM.getCapStatus() != "Active" && fvCapM.getCapStatus() != "Approved")
           continue;
        opLL.put(fvCapType.getCategory(),"");
    }
    return opLL;
}

function calculateEligTags(ipLifeLic,ipSpEd,ipAge,ipEnforcements,spProcessYear) {
    var fvLLs = ipLifeLic.entrySet().toArray();
    for (var fvCounter in fvLLs) {
        var fvLL = fvLLs[fvCounter];

        var fvLicType = fvLL.getKey();
        var fvTags = "";
        if (fvLicType == "Bowhunting" && ipSpEd.containsKey("Hunter Ed") && ipSpEd.containsKey("Bowhunter Ed (IBEP)") && !ipEnforcements.revocationHunting) {
            if (ipAge >= 12 && ipAge < 16)
                fvTags = "Privilege Panel,Back,Either Sex";
            else if (ipAge >= 16)
                fvTags = "Privilege Panel,Either Sex";
        }
        if (fvLicType == "Muzzleloading" && ipSpEd.containsKey("Hunter Ed") && !ipEnforcements.revocationHunting) {
            if (ipAge >= 14)
                fvTags = "Privilege Panel,Either Sex";
        }
        if (fvLicType == "Small & Big Game" && ipSpEd.containsKey("Hunter Ed") && !ipEnforcements.revocationHunting) {
            if (ipAge >= 12 && ipAge < 14)
                fvTags = "Privilege Panel,Back";
            else if (ipAge >= 14)
                fvTags = "Privilege Panel,Back,Deer,Bear";
        }
        if (fvLicType == "Sportsman" && ipSpEd.containsKey("Hunter Ed") && !ipEnforcements.revocationHunting) {
            if (ipAge >= 12 && ipAge < 14)
                fvTags = "Privilege Panel,Back,Turkey";
            else if (ipAge >= 14)
                fvTags = "Privilege Panel,Back,Turkey,Deer,Bear";
        }
        if (fvLicType == "Trapping License" && ipSpEd.containsKey("Trapper Ed") && !ipEnforcements.revocationTrapping) {
            fvTags = "Privilege Panel";
        }
        ipLifeLic.put(fvLicType,fvTags);
    }
    var opAllTags = aa.util.newHashMap();
    fvLLs = ipLifeLic.entrySet().toArray();
    var fvTotalTags = 0;
    for (var fvCounter in fvLLs) {
        var fvLL = fvLLs[fvCounter];
        var fvLicType = fvLL.getKey();
        var fvTags = fvLL.getValue();
        var fvTagsArr = fvTags.split(",");
        for (var fvTagCounter in fvTagsArr) {
            var fvTag = fvTagsArr[fvTagCounter];
            if (fvTag == null || fvTag == "")
                continue;
            if (fvTag == "Turkey") {
				if (isFallTurkeySeasonOver(spProcessYear)) {
					if (!opAllTags.containsKey("Fall Turkey")) {
						opAllTags.put("Fall Turkey",2);
						fvTotalTags = fvTotalTags + 2;
					}
				}
				if (isSpringTurkeySeasonOver(spProcessYear)) {
					if (!opAllTags.containsKey("Spring Turkey")) {
						opAllTags.put("Spring Turkey",2);
						fvTotalTags = fvTotalTags + 2;
					}
				}
            }
            else
            if (fvTag == "Either Sex") {
               if (!opAllTags.containsKey("Either Sex")) {
                   opAllTags.put("Either Sex",1);
                   fvTotalTags++;
               }
               else
               if (!opAllTags.containsKey("Antlerless")) {
                   opAllTags.put("Antlerless",1);
                   fvTotalTags++;
               }
            }
            else
            if (!opAllTags.containsKey(fvTag)) {
                opAllTags.put(fvTag,1);
                fvTotalTags++;
            }
        }
    }
    opAllTags.put("TOTAL",fvTotalTags);
    return opAllTags;
}

function getExistingTags(ipRefContact,ipExpDate,ipEligibleTags) {
    var fvTotalTags = parseInt(ipEligibleTags.get("TOTAL"), 10);
    if (fvTotalTags == 0)
        return ipEligibleTags;

    var fvPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
    var fvCcb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
    fvPeople.setServiceProviderCode(aa.getServiceProviderCode());
    fvPeople.setContactSeqNumber(ipRefContact);

    var fvCapsQry = fvCcb.getCapContactsByRefContactModel(fvPeople);
    if (!fvCapsQry)
        return ipEligibleTags;
    var fvCaps = fvCapsQry.toArray();
    if (!fvCaps)
        return ipEligibleTags;
    for (var fvCounter in fvCaps) {
        var fvCap = fvCaps[fvCounter];
        if (!fvCap)
            continue;
        var fvCapIDTmp = fvCap.getCapID();
        if (!fvCapIDTmp)
            continue;
        var fvCapIDQry = aa.cap.getCapID(fvCapIDTmp.getID1(), fvCapIDTmp.getID2(), fvCapIDTmp.getID3());
        if (!fvCapIDQry || !fvCapIDQry.getSuccess())
            continue;
        var fvCapID = fvCapIDQry.getOutput();
        if(!fvCapID)
            continue;
        var fvCapMQry = aa.cap.getCap(fvCapID);
        if (!fvCapMQry || !fvCapMQry.getSuccess())
            continue;
        var fvCapM = fvCapMQry.getOutput();
        if (!fvCapM)
            continue;
        var fvCapType = fvCapM.getCapType();
        if (!fvCapType)
            continue;
        if (fvCapType.getGroup() != "Licenses" || fvCapType.getType() != "Tag" || (fvCapType.getSubType() != "Hunting" && fvCapType.getSubType() != "Document"))
           continue;
        if (fvCapM.getCapStatus() != "Active")
           continue;
        var fvExpQry = aa.expiration.getLicensesByCapID(fvCapID);
        if (!fvExpQry || !fvExpQry.getSuccess())
            continue;
        var fvExp = fvExpQry.getOutput();
        if (!fvExp)
            continue;
        var fvExpDtStr = "";
        var fvTryError = null;
        try {
            fvExpDtStr = fvExp.getExpDateString();
        }
        catch (fvTryError) {
            fvExpDtStr = "09-30-2014";
        }
        var fvExpDtArr = fvExpDtStr.split("-");
        fvExpDtStr = fvExpDtArr[1] + "/" + fvExpDtArr[2] + "/" + fvExpDtArr[0];
        var fvExpDt = new Date(fvExpDtStr);
        if (fvExpDt.getTime() != ipExpDate.getTime())
            continue;
        var fvCategory = fvCapType.getCategory();
        if (ipEligibleTags.containsKey(fvCategory)) {
           var fvNoOfTags = parseInt(ipEligibleTags.get(fvCategory), 10);
           if (fvNoOfTags != 0) {
               fvNoOfTags--;
               fvTotalTags--;
           }
           ipEligibleTags.put(fvCategory,fvNoOfTags);
        }
    }
    ipEligibleTags.put("TOTAL",fvTotalTags);
    return ipEligibleTags;
}

function createNewTags(ipRefContact,ipStartDate,ipExpDate,ipEligibleTags) {
    var opErrors = null;
    var fvTotalTags = parseInt(ipEligibleTags.get("TOTAL"), 10);
    logDebug("No. of Tags to be created: " + fvTotalTags);
    if (fvTotalTags == 0)
        return opErrors;
    var fvParentApp = null;

    var fvTagArray = ipEligibleTags.entrySet().toArray();
    for (var fvCounter in fvTagArray) {
        var fvTagObj = fvTagArray[fvCounter];
        var fvTag = fvTagObj.getKey();
        if (fvTag == "TOTAL")
            continue;
        logDebug("Tag: " + fvTag);
        var fvTagQty = parseInt(fvTagObj.getValue(), 10);
        if (fvTagQty > 0) {
            if (!fvParentApp) {
                fvParentApp = createParentTagApp(ipRefContact,ipStartDate,ipExpDate);
                if (fvParentApp)
                    logDebug("New Application Created: " + fvParentApp.getCustomID());
            }
            if (fvParentApp) {
                for (var fvTagCounter = 0; fvTagCounter < fvTagQty; fvTagCounter++) {
                    createNewTag(fvParentApp,ipStartDate,ipExpDate,fvTag,fvTagCounter);
                }
            }
        }
    }

    return opErrors;
}

function createParentTagApp(ipRefContact,ipStartDate,ipExpDate) {
	logDebug("In createParentTagApp " +ipRefContact + ", " + ipStartDate + ", " + ipExpDate);
    var fvGroup = "Licenses";
    var fvType = "Annual";
    var fvSubType = "Application";
    var fvCategory = "NA";
    var fvDesc = "Buy Sporting License(s)";
    var fvAppCreateResult = aa.cap.createApp(fvGroup, fvType, fvSubType, fvCategory, fvDesc);
    if (fvAppCreateResult.getSuccess()) {
		logDebug("created record " + fvGroup + ", " + fvType+ ", " + fvSubType+ ", " + fvCategory+ ", " + fvDesc);
        var newId = fvAppCreateResult.getOutput();
        // create Detail Record
        capModel = aa.cap.newCapScriptModel().getOutput();
        capDetailModel = capModel.getCapModel().getCapDetailModel();
        capDetailModel.setCapID(newId);
        aa.cap.createCapDetail(capDetailModel);

        var newObj = aa.cap.getCap(newId).getOutput(); //Cap object
        editAppName(fvDesc, newId);
        editFileDate(newId, ipStartDate);
        setLicExpirationDate(newId, "", ipExpDate);

        var fvPeople = aa.people.getPeople(ipRefContact).getOutput();

        // Set the contact address
        var fvCASearchModel = aa.address.createContactAddressModel().getOutput();
        fvCASearchModel.setEntityID(parseInt(ipRefContact,10));
        fvCASearchModel.setEntityType("CONTACT");
        var fvCAResult = aa.address.getContactAddressList(fvCASearchModel.getContactAddressModel());
		var fvCAOutput = fvCAResult.getOutput();
		logDebug("getContactAddressList success? " + fvCAResult.getSuccess() + ", error: " + fvCAResult.getErrorMessage());
		
        if (fvCAOutput != null)	{
            var fvCAList = aa.util.newArrayList();
            for(var fvCnt in fvCAOutput) {
				logDebug("copying contact address #" + fvCnt);
                fvCAList.add(fvCAOutput[fvCnt].getContactAddressModel());
            }
            fvPeople.setContactAddressList(fvCAList);
        }
		else {
				logDebug("NO CONTACT ADDRESS ON REF CONTACT");
		}

        var createResult = aa.people.createCapContactWithRefPeopleModel(newId,fvPeople);
		logDebug("create capcontact successful? " + createResult.getSuccess() + " error : " + createResult.getErrorMessage());
        updateAppStatus("Approved","Auto-Gen",newId);

        var fvCondFulfill = new COND_FULLFILLMENT();
        addFullfillmentCondition(newId, fvCondFulfill.Condition_AutoGenAppl);
        return newId;
    }
}

function createNewTag(ipParentApp,ipStartDate,ipExpDate,ipTag,ipTagCntr) {
    var fvGroup = "Licenses";
    var fvType = "Tag";
    var fvSubType = "Hunting";
    var fvCategory = ipTag;
    if (fvCategory == "Privilege Panel")
        fvSubType = "Document";
    var fvTagType = "";
    if (fvCategory == "Back")
        fvTagType = "1";
    if (fvCategory == "Antlerless")
        fvTagType = "20";
    if (fvCategory == "Either Sex")
        fvTagType = "19";
    if (fvCategory == "Deer")
        fvTagType = "3";
    if (fvCategory == "Bear")
        fvTagType = "2";
    if (fvCategory == "Privilege Panel")
        fvTagType = "24";
    if (fvCategory == "Fall Turkey") {
        if (ipTagCntr == 0)
            fvTagType = "13";
        else
            fvTagType ="14";
    }
    if (fvCategory == "Spring Turkey") {
        if (ipTagCntr == 0)
            fvTagType = "15";
        else
            fvTagType ="16";
    }
    fvAppName = lookup("TAG_TYPE",fvTagType);
    var newLicId = issueSubLicense(fvGroup, fvType, fvSubType, fvCategory, "Active", ipParentApp);
    if (newLicId) {
        logDebug("New Tag Created: " + newLicId.getCustomID());
		var newDecDocId = GenerateDocumentNumber(newLicId.getCustomID(),"9998");
        updateDocumentNumber(newDecDocId, newLicId);
        editAppName(fvAppName, newLicId);
        editFileDate(newLicId, ipStartDate);
        setLicExpirationDate(newLicId, "", ipExpDate);
        editAppSpecific("Tag Type",fvTagType,newLicId);
        editAppSpecific("Year",ipStartDate.getFullYear().toString(),newLicId);
        fvYearDesc = lookupDesc("LICENSE_FILING_YEAR_Desc",ipStartDate.getFullYear().toString());
        editAppSpecific("Year Description",fvYearDesc,newLicId);

		return newLicId;
    }
}

function lookupDesc(ipStdChoice,ipDesc) {
    var fvBizDomScriptResult = aa.bizDomain.getBizDomain(ipStdChoice);

    if (fvBizDomScriptResult.getSuccess()) {
        var fvBizDomScriptArray = fvBizDomScriptResult.getOutput().toArray();

        for (var fvCntr in fvBizDomScriptArray) {
            if (fvBizDomScriptArray[fvCntr].getDescription() == ipDesc)
                return fvBizDomScriptArray[fvCntr].getBizdomainValue();
        }
    }
    return null;
}

function createError(ipErrors,ipErrMsg) {
    opErrors = ipErrors;
    if (!opErrors)
        opErrors = new Array();
    opErrors.push(ipErrMsg);
    return opErrors;
}

function getEnforcements(ipRefContact) {
	var opEnforcements = new Array();
	opEnforcements["suspension"] = false;
	opEnforcements["revocationHunting"] = false;
	opEnforcements["revocationTrapping"] = false;

	var fvContactConditionsQry = aa.commonCondition.getCommonConditions("CONTACT",parseInt(ipRefContact,10));
	if (fvContactConditionsQry) {
		var fvContactConditions = fvContactConditionsQry.getOutput();
		if (fvContactConditions) {
			for (fvCounter in fvContactConditions) {
				var fvContactCondition = fvContactConditions[fvCounter];
				if (fvContactCondition.getConditionGroup() == "Enforcement" && fvContactCondition.getConditionStatusType() == "Applied") {
					if (fvContactCondition.getConditionType() == "Suspension" && fvContactCondition.getConditionDescription() == "Suspension of Privileges")
						opEnforcements["suspension"] = true;
				    if (fvContactCondition.getConditionType() == "Revocation" && fvContactCondition.getConditionDescription() == "Hunting Revocation")
						opEnforcements["revocationHunting"] = true;
					if (fvContactCondition.getConditionType() == "Revocation" && fvContactCondition.getConditionDescription() == "Trapping Revocation")
						opEnforcements["revocationTrapping"] = true;
				}
			}
		}
	}
	return opEnforcements;
}
