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
    var fvProcessYear = getProcessYear(ipEffDate);
    var fvSeason =  getSeasonDates(fvProcessYear);
    var fvStartDate = fvSeason.StartDate;
    var fvExpDate = fvSeason.EndDate;
    var fvAge = getRefContactAgeAsOnDate(ipRefContact,ipEffDate);
    var fvSpEd = getSpEd(ipRefContact);
    var fvLifeLic = getLifetimeLicenses(ipRefContact);
    var fvEligibleTags = calculateEligTags(fvLifeLic,fvSpEd,fvAge);
    var fvExistTags = getExistingTags(ipRefContact,fvExpDate,fvEligibleTags);
    var opErrors = createNewTags(ipRefContact,fvStartDate,fvExpDate,fvExistTags);
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
    if (fvEndDt.getTime() < fvStartDt.getTime())
    {
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
 
    var fvCaps = fvCcb.getCapContactsByRefContactModel(fvPeople).toArray();

    for (var fvCounter in fvCaps) {
        var fvCapID = aa.cap.getCapID(fvCaps[fvCounter].getCapID().getID1(), fvCaps[fvCounter].getCapID().getID2(), fvCaps[fvCounter].getCapID().getID3()).getOutput();
        var fvCapM = aa.cap.getCap(fvCapID).getOutput();
        var fvCapType = fvCapM.getCapType();

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

function calculateEligTags(ipLifeLic,ipSpEd,ipAge) {
    var fvLLs = ipLifeLic.entrySet().toArray();
    for (var fvCounter in fvLLs) {
        var fvLL = fvLLs[fvCounter];
         
        var fvLicType = fvLL.getKey();
        var fvTags = "";
        if (fvLicType == "Bowhunting" && ipSpEd.containsKey("Hunter Ed") && ipSpEd.containsKey("Bowhunter Ed (IBEP)")) {
            if (ipAge >= 12 && ipAge < 16)
                fvTags = "Privilege Panel,Back,Either Sex,DMP Deer";
            else if (ipAge >= 16)
                fvTags = "Privilege Panel,Either Sex";
        }
        if (fvLicType == "Muzzleloading" && ipSpEd.containsKey("Hunter Ed")) {
            if (ipAge >= 14)
                fvTags = "Privilege Panel,Either Sex";
        }
        if (fvLicType == "Small & Big Game" && ipSpEd.containsKey("Hunter Ed")) {
            if (ipAge >= 12 && ipAge < 14)
                fvTags = "Privilege Panel,Back";
            else if (ipAge >= 14)
                fvTags = "Privilege Panel,Back,Deer,Bear,DMP Deer";
        }
        if (fvLicType == "Sportsman" && ipSpEd.containsKey("Hunter Ed")) {
            if (ipAge >= 12 && ipAge < 14)
                fvTags = "Privilege Panel,Back,Turkey";
            else if (ipAge >= 14)
                fvTags = "Privilege Panel,Back,Turkey,Deer,Bear,DMP Deer";
        }
        if (fvLicType == "Trapping License" && ipSpEd.containsKey("Trapper Ed")) {
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
            if (fvTag == "Turkey") {
                if (!opAllTags.containsKey("Fall Turkey")) {
                    opAllTags.put("Fall Turkey",2);
                    fvTotalTags = fvTotalTags + 2;
                }
                if (!opAllTags.containsKey("Spring Turkey")) {
                    opAllTags.put("Spring Turkey",2);
                    fvTotalTags = fvTotalTags + 2;
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
    var fvPeopleQry = aa.people.getPeople(ipRefContact);
    if (!fvPeopleQry.getSuccess())
        return ipEligibleTags;
    var fvPeople = fvPeopleQry.getOutput();
    var fvPeopleScript = new com.accela.aa.emse.dom.PeopleScriptModel(fvPeople);
    var fvCapsQry = aa.people.getCapIDsByRefContact(fvPeopleScript);
    if (!fvCapsQry.getSuccess())
        return ipEligibleTags;
    var fvCaps = fvCapsQry.getOutput();
    for (var fvCounter in fvCaps) {
        var fvCap = fvCaps[fvCounter];
        var fvCapID = aa.cap.getCapID(fvCap.ID1,fvCap.ID2,fvCap.ID3).getOutput();
        var fvCapM = aa.cap.getCap(fvCapID).getOutput();
        var fvCapType = fvCapM.getCapType();
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
        var fvExpDtStr = fvExp.getExpDateString();
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
    if (fvTotalTags == 0)
        return;
    var fvParentApp = createParentTagApp(ipRefContact,ipStartDate,ipExpDate);
    if (fvParentApp)
    {
        logDebug("New Application Created: " + fvParentApp.getCustomID());
        var fvTagArray = ipEligibleTags.entrySet().toArray();
        for (var fvCounter in fvTagArray) {
            var fvTagObj = fvTagArray[fvCounter];
            var fvTag = fvTagObj.getKey();
            if (fvTag == "TOTAL")
                continue;
            logDebug("Tag: " + fvTag);
            var fvTagQty = parseInt(fvTagObj.getValue(), 10);
            for (var fvTagCounter = 0; fvTagCounter < fvTagQty; fvTagCounter++) {
                createNewTag(fvParentApp,ipStartDate,ipExpDate,fvTag,fvTagCounter);
            }
        }
    }
    return opErrors;
}

function createParentTagApp(ipRefContact,ipStartDate,ipExpDate) {
    var fvGroup = "Licenses";
    var fvType = "Annual";
    var fvSubType = "Application";
    var fvCategory = "NA";
    var fvDesc = "Buy Sporting License(s)";
    var fvAppCreateResult = aa.cap.createApp(fvGroup, fvType, fvSubType, fvCategory, fvDesc);
    if (fvAppCreateResult.getSuccess()) {
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
        aa.people.createCapContactWithRefPeopleModel(newId,fvPeople);
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
    if (fvCategory == "DMP Deer")
        fvTagType = "4";
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
    if (newLicId)
    {
        logDebug("New Tag Created: " + newLicId.getCustomID());
        editAppName(fvAppName, newLicId);
        editFileDate(newLicId, ipStartDate);
        setLicExpirationDate(newLicId, "", ipExpDate);
        editAppSpecific("Tag Type",fvTagType,newLicId);
        editAppSpecific("Year",ipStartDate.getFullYear().toString(),newLicId);
        fvYearDesc = lookupDesc("LICENSE_FILING_YEAR_Desc",ipStartDate.getFullYear().toString());
        editAppSpecific("Year Description",fvYearDesc,newLicId);
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
