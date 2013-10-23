/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|           available to all master scripts
|
| Notes   : 01/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
|           10/10/2013,     Laxmikant Bondre (LBONDRE), Fixed Defect - 1922.
|                           Active Holdings are not shown because expiry date was wrong.
|                           Fixed Expiry Date.
|           10/10/2013,     Laxmikant Bondre (LBONDRE), Fixed Defect - 1922.
|                           Expiry date is calculated 1 day before.
|           10/18/2013,     Laxmikant Bondre (LBONDRE), 
|                           Add Fulfillment Condition for Education Updated..
/------------------------------------------------------------------------------------------------------*/
var frm;

eval(getScriptText("INCLUDES_RAJ_TEST"));
eval(getScriptText("INCLUDES_ACCELA_CONTACT_ASI"));
eval(getScriptText("INCLUDES_DEC_MANAGE_STD_CHOICE"));
eval(getScriptText("INCLUDES_DEC_RULES"));
eval(getScriptText("INCLUDES_DEC_APP_OBJECT"));
eval(getScriptText("INCLUDES_DEC_DRAW"));
eval(getScriptText("INCLUDES_DEC_HARVEST"));

var dictTags = null;
var peopTemplateAttribute = aa.util.newHashMap();
var salesAgentInfoArray = null;
var hmfulfilmmentCond = aa.util.newHashMap();
var CONTACT_LINK = '<a href="/nyssupp/Report/ReportParameter.aspx?module=Licenses&reportID=3987&reportType=LINK_REPORT_LIST" target=_blank>Print Contact DEC Tag </a>';
var MSG_SUSPENSION = 'License to buy privileges are suspended. Please contact DEC Sales. ' + CONTACT_LINK;
var MSG_NO_AGENT_SALES = 'Sales privileges are suspended. Please contact DEC. ' + CONTACT_LINK;

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
function TargetCAPAttrib(targetCapId, targetFeeInfo) {
    this.targetCapId = targetCapId;
    this.targetFeeInfo = targetFeeInfo;
}
function NewLicDef(fldname, val) {
    this.FieldName = fldname;
    this.Value = val;

    var subgroupname = null;
    if (arguments.length > 2) {
        subgroupname = arguments[2];
    }
    this.SubGroupName = subgroupname;
}
function setSalesItemASI(newCap, recordType, decCode, quantity, wmuResult, wmu2Result) {
    logDebug("ENTER: setSalesItemASI");

    var ats = recordType;
    var ata = ats.split("/");

    var newAInfo = new Array();
    //Common ASI fields respect TAG_INFO
    if (appTypeString == 'Licenses/Other/Sales/Application') {
        var seasonPeriod = GetLicenseSeasonPeriod();
        var sYear = seasonPeriod[0].getFullYear();
        var sYearDesc = GetLicenseYearDescByYear(sYear);

        newAInfo.push(new NewLicDef("Year", sYear));
        newAInfo.push(new NewLicDef("Year Description", sYearDesc));
        newAInfo.push(new NewLicDef("Item Code", decCode));
    } else {
        newAInfo.push(new NewLicDef("Year", AInfo["License Year"]));
        newAInfo.push(new NewLicDef("Year Description", AInfo["License Year Description"]));
        newAInfo.push(new NewLicDef("Item Code", decCode));
    }


    if (ats == AA05_DEER_MANAGEMENT_PERMIT) {
        if (arguments.length > 3) {
            var wmu1Result = wmuResult;
            //Update Resut in asit
            var newAsitArray = GetWmuAsitTableArray(wmu1Result, wmu2Result);
            //asitModel = newCap.getAppSpecificTableGroupModel();
            //new_asit = addASITable4ACAPageFlow(asitModel, "DRAW RESULT", newAsitArray);
            addASITable("DRAW RESULT",newAsitArray)


            //Update Contact Attribute
            peopTemplateAttribute.put("PREFERENCE POINTS", wmu1Result.RemainingPreferencePoints);
        }
    }
    //ser ASI fields respect TAG_INFO
    else if (ata[1] == "Tag") {
        newAInfo.push(new NewLicDef("Tag Type", AInfo["CODE.TAG_TYPE"]));
        //is From DMP Tage
        if (wmuResult != null) {
            newAInfo.push(new NewLicDef("WMU", wmuResult.WMU));
            newAInfo.push(new NewLicDef("Draw Type", wmuResult.DrawType));
            newAInfo.push(new NewLicDef("Choice", wmuResult.ChoiceNum));
            newAInfo.push(new NewLicDef("PreferencePoints", wmuResult.PreferencePoints));
            newAInfo.push(new NewLicDef("Landowner", wmuResult.Landowner));
            newAInfo.push(new NewLicDef("Military Disabled", wmuResult.DisabledVet));
            newAInfo.push(new NewLicDef("Resident", wmuResult.Resident));
        }
        if (ats == AA54_TAG_PRIV_PANEL) {
            newAInfo.push(new NewLicDef("PrintConsignedLines", AInfo["A_PrintConsignedLines"]));
        }
    }
    else if (ats == AA45_LIFETIME_INSCRIPTION) {
        newAInfo.push(new NewLicDef("Quantity", quantity));
        newAInfo.push(new NewLicDef("Effective Date", AInfo["CODE.Effective Date"]));
        newAInfo.push(new NewLicDef("Inscription", AInfo["Inscription"]));

        //Update Contact Attribute
        peopTemplateAttribute.put("LIFETIME INSCRIPTION", AInfo["Inscription"]);
    }
    else if (ats == AA20_CONSERVATIONIST_MAGAZINE) {
        newAInfo.push(new NewLicDef("Quantity", quantity));
        newAInfo.push(new NewLicDef("Effective Date", AInfo["CODE.Effective Date"]));
        newAInfo.push(new NewLicDef("Is magzine subscription a gift?", AInfo["Is magzine subscription a gift?"]));
        newAInfo.push(new NewLicDef("First Name", AInfo["First Name"]));
        newAInfo.push(new NewLicDef("Last Name", AInfo["Last Name"]));
        newAInfo.push(new NewLicDef("Middle Name", AInfo["Middle Name"]));
        newAInfo.push(new NewLicDef("Address Line 1", AInfo["Address Line 1"]));
        newAInfo.push(new NewLicDef("Address Line 2", AInfo["Address Line 2"]));
        newAInfo.push(new NewLicDef("City", AInfo["City"]));
        newAInfo.push(new NewLicDef("State", AInfo["State"]));
        newAInfo.push(new NewLicDef("Zip", AInfo["Zip"]));
        newAInfo.push(new NewLicDef("Zip + 4", AInfo["Zip + 4"]));
    }
    else {
        newAInfo.push(new NewLicDef("Quantity", quantity));
        newAInfo.push(new NewLicDef("Effective Date", AInfo["CODE.Effective Date"]));
    }

    copyLicASI(newCap, newAInfo);

    logDebug("EXIT: setSalesItemASI");
}
function GetWmuAsitTableArray(wmu1Result, wmu2Result) {
    logDebug("ENTER: GetWmuAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    tempObject = new Array();
    //Choice 1 Result
    var fieldInfo = new asiTableValObj("DRAW TYPE", wmu1Result.DrawType, "Y");
    tempObject["DRAW TYPE"] = fieldInfo;
    fieldInfo = new asiTableValObj("WMU", wmu1Result.WMU, "Y");
    tempObject["WMU"] = fieldInfo;
    fieldInfo = new asiTableValObj("Choice Number", "1", "Y");
    tempObject["Choice Number"] = fieldInfo;
    fieldInfo = new asiTableValObj("Result", wmu1Result.Result(), "Y");
    tempObject["Result"] = fieldInfo;
    fieldInfo = new asiTableValObj("Apply Land Owner", wmu1Result.Landowner, "Y");
    tempObject["Apply Land Owner"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points Given", wmu1Result.GivenPreferencePoints, "Y");
    tempObject["Preference Points Given"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points After", wmu1Result.RemainingPreferencePoints, "Y");
    tempObject["Preference Points After"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Bucket", wmu1Result.PreferenceBucket, "Y");
    tempObject["Preference Bucket"] = fieldInfo;
    fieldInfo = new asiTableValObj("Land Owner?", "", "N");
    tempObject["Land Owner?"] = fieldInfo;
    fieldInfo = new asiTableValObj("Correct?", "", "N");
    tempObject["Correct?"] = fieldInfo;
    tempArray.push(tempObject);

    //Choice 2 Result
    fieldInfo = new asiTableValObj("DRAW TYPE", wmu2Result.DrawType, "Y");
    tempObject["DRAW TYPE"] = fieldInfo;
    fieldInfo = new asiTableValObj("WMU", wmu2Result.WMU, "Y");
    tempObject["WMU"] = fieldInfo;
    fieldInfo = new asiTableValObj("Choice Number", "2", "Y");
    tempObject["Choice Number"] = fieldInfo;
    fieldInfo = new asiTableValObj("Result", wmu2Result.Result(), "Y");
    tempObject["Result"] = fieldInfo;
    fieldInfo = new asiTableValObj("Apply Land Owner", wmu2Result.Landowner, "Y");
    tempObject["Apply Land Owner"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points Given", wmu2Result.GivenPreferencePoints, "Y");
    tempObject["Preference Points Given"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points After", wmu2Result.RemainingPreferencePoints, "Y");
    tempObject["Preference Points After"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Bucket", wmu2Result.PreferenceBucket, "Y");
    tempObject["Preference Bucket"] = fieldInfo;
    fieldInfo = new asiTableValObj("Land Owner?", "", "N");
    tempObject["Land Owner?"] = fieldInfo;
    fieldInfo = new asiTableValObj("Correct?", "", "N");
    tempObject["Correct?"] = fieldInfo;
    tempArray.push(tempObject);

    logDebug("EXIT: GetWmuAsitTableArray");

    return tempArray;
}
function copyLicASI(newCap, newAInfo) {
    logDebug("ENTER: copyLicASI");
    var ignoreArr = new Array();
    var limitCopy = false;
    if (arguments.length > 1) {
        ignoreArr = arguments[1];
        limitCopy = true;
    }
    for (var item in newAInfo) {
        //Check list
        if (limitCopy) {
            var ignore = false;
            for (var i = 0; i < ignoreArr.length; i++)
                if (ignoreArr[i] == newAInfo[item].FieldName) {
                    ignore = true;
                    break;
                }
            if (ignore)
                continue;
        }
        editAppSpecific(newAInfo[item].FieldName, newAInfo[item].Value, newCap);
    }
    logDebug("EXIT: copyLicASI");
}
function updateContacts() {
    logDebug("ENTER: updateContacts");
    //logDebug("Elapsed Time: " + elapsed());

    var peopleSequenceNumber = null;
    var contactSeqNumber = null;

    //var capContact = getOutput(aa.people.getCapContactByCapID(capId));
    var xArray = getApplicantArrayEx(capId);
    for (ca in xArray) {
        var thisContact = xArray[ca];
        if (thisContact["contactType"] == "Individual") {
            contactSeqNumber = thisContact["contactSeqNumber"];
            break;
        }
    }

    //xArray = new Array();
    
    // JHS 10/9/2013 added test for null on contactSeqNumber
    var capContactArray = new Array();
    
    if (!contactSeqNumber) {
        logDebug("**WARNING updateContacts could not fund an applicant/individual");
        }
    else {
        capContactArray = getOutput(aa.people.getCapContactByContactID(contactSeqNumber));
        }

    if (capContactArray) {
        for (yy in capContactArray) {
            //First One is always Applicant else check for contact type
            //var aArray = getApplicantInfoArray(capContactArray[yy], capId);
            //xArray.push(aArray);
            peopleSequenceNumber = capContactArray[yy].getCapContactModel().getRefContactNumber();
            break;
        }
    }

    //logDebug(peopleSequenceNumber);
    if (peopleSequenceNumber != null) {
        //Set contact ASI using cap asi
        var newAInfo = new Array();
        var subGroupName = "ADDITIONAL INFO";
        newAInfo.push(new NewTblDef("Parent Driver License Number", AInfo["A_Parent_Driver_License_Number"], subGroupName));
        newAInfo.push(new NewTblDef("NY Resident Proof Document", AInfo["A_NY_Resident_Proof_Document"], subGroupName));
        newAInfo.push(new NewTblDef("Are You New York Resident?", AInfo["A_IsNYResident"], subGroupName));

        subGroupName = "APPEARANCE";
        newAInfo.push(new NewTblDef("Height", AInfo["Height"], subGroupName));
        newAInfo.push(new NewTblDef("Height - inches", AInfo["Height - inches"], subGroupName));
        newAInfo.push(new NewTblDef("Eye Color", AInfo["Eye Color"], subGroupName));
        if (AInfo["Legally Blind"] == "Yes") {
            newAInfo.push(new NewTblDef("Legally Blind", 'Y', subGroupName));
        }
        if (AInfo["Legally Blind"] == "No") {
            newAInfo.push(new NewTblDef("Legally Blind", 'N', subGroupName));
        }
        if (AInfo["Permanent Disability"] == "Yes") {
            newAInfo.push(new NewTblDef("Permanent Disability", 'Y', subGroupName));
        }
        if (AInfo["Permanent Disability"] == "No") {
            newAInfo.push(new NewTblDef("Permanent Disability", 'N', subGroupName));
        }
        newAInfo.push(new NewTblDef("Permanent Disability Number", AInfo["Permanent Disability Number"], subGroupName));
        if (AInfo["Native American?"] == "Yes") {
            newAInfo.push(new NewTblDef("Native American?", 'Y', subGroupName));
        }
        if (AInfo["Native American?"] == "No") {
            newAInfo.push(new NewTblDef("Native American?", 'N', subGroupName));
        }

        subGroupName = "MILITARY ACTIVE SERVICE STATUS";
        if (AInfo["Military Serviceman"] == "Yes") {
            newAInfo.push(new NewTblDef("Military Serviceman", 'Y', subGroupName));
        }
        if (AInfo["Native American?"] == "No") {
            newAInfo.push(new NewTblDef("Military Serviceman", 'N', subGroupName));
        }
        newAInfo.push(new NewTblDef("NY Organized Militia", AInfo["NY Organized Militia"], subGroupName));
        newAInfo.push(new NewTblDef("NY Organized Militia Type", AInfo["NY Organized Militia Type"], subGroupName));
        newAInfo.push(new NewTblDef("U.S. Reserve Member", AInfo["U.S. Reserve Member"], subGroupName));
        newAInfo.push(new NewTblDef("U.S. Reserve Member Type", AInfo["U.S. Reserve Member Type"], subGroupName));
        newAInfo.push(new NewTblDef("Full-time U.S. Armed Service", AInfo["Full-time U.S. Armed Service"], subGroupName));
        newAInfo.push(new NewTblDef("Full-time U.S. Armed Service Type", AInfo["Full-time U.S. Armed Service Type"], subGroupName));
        newAInfo.push(new NewTblDef("Grade / Rank", AInfo["Grade / Rank"], subGroupName));
        newAInfo.push(new NewTblDef("Unit Name", AInfo["Unit Name"], subGroupName));
        newAInfo.push(new NewTblDef("Location", AInfo["Location"], subGroupName));
        newAInfo.push(new NewTblDef("Name of Commanding Officer", AInfo["Name of Commanding Officer"], subGroupName));
        newAInfo.push(new NewTblDef("Phone of Commanding Officer", AInfo["Phone of Commanding Officer"], subGroupName));
        newAInfo.push(new NewTblDef("Affirmation", AInfo["Affirmation"], subGroupName));
        newAInfo.push(new NewTblDef("Affidavit Date", AInfo["Affidavit Date"], subGroupName));

        var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
        setContactASI(peopleModel.getTemplate(), newAInfo);

        createEducUpdCond(peopleModel);

        //Set contact ASIT using cap asit: assumption is both are identical
        var groupName = "ASIT_APPLCNT";
        copyCapASIT(peopleModel, groupName, "LAND OWNER INFORMATION");
        copyCapASIT(peopleModel, groupName, "ANNUAL DISABILITY");
        copyCapASIT(peopleModel, groupName, "SPORTSMAN EDUCATION");
        copyCapASIT(peopleModel, groupName, "PREVIOUS LICENSE");

        //Set DEC ID/passport number
        if (isNull(peopleModel.getPassportNumber(), '') == '') {
            peopleModel.setPassportNumber(peopleSequenceNumber);
        }

        aa.people.editPeople(peopleModel);

        //var subGroupArray = getTemplateValueByFormArrays(peopleModel.getTemplate(), null, null);
        //GetAllASI(subGroupArray);
        //var gArray = getTemplateValueByTableArrays(peopleModel.getTemplate());
        //GetAllASIT(gArray);

        //Set people templateFields 
        if (peopTemplateAttribute != null || peopTemplateAttribute.size() > 0) {
            var aKeys = peopTemplateAttribute.keySet().toArray();
            for (var i = 0; i < aKeys.length; i++) {
                editContactPeopleTemplateAttribute(peopleSequenceNumber, aKeys[i], peopTemplateAttribute[aKeys[i]]);
            }
        }
    }

    //logDebug("Elapsed Time: " + elapsed());
    logDebug("EXIT: updateContacts");
}
function editContactPeopleTemplateAttribute(peopleSequenceNumber, pAttributeName, pNewAttributeValue) {
    var peopAttrResult = aa.people.getPeopleAttributeByPeople(peopleSequenceNumber, "Individual");

    if (!peopAttrResult.getSuccess())
    { logDebug("**WARNING retrieving reference license professional attribute: " + peopAttrResult.getErrorMessage()); return false }

    var peopAttrArray = peopAttrResult.getOutput();
    var attrfound = false;
    for (i in peopAttrArray) {
        if (pAttributeName.equals(peopAttrArray[i].getAttributeName())) {
            var oldValue = peopAttrArray[i].getAttributeValue()
            attrfound = true;
            break;
        }
    }

    if (attrfound) {
        peopAttrArray[i].setAttributeValue(pNewAttributeValue);
    }
    else {
        logDebug("**WARNING attribute: " + pAttributeName + " not found for people seq " + peopleSequenceNumber);
    }

}
function copyCapASIT(peopleModel, groupName, subGroupName) {
    var appSpecificTableScript = aa.appSpecificTableScript.getAppSpecificTableModel(capId, subGroupName).getOutput();
    var appSpecificTable = appSpecificTableScript.getAppSpecificTableModel();
    var tableFields = appSpecificTable.getTableFields();
    //var groupName = appSpecificTable.getGroupName();
    //Contact ASIT subGroupName is equal to cap ASIT subGroupName

    if (tableFields.size() > 0) {
        copyCapASITtoContactASITTableRow(peopleModel.getTemplate(), subGroupName, groupName, tableFields);
    }
}
function CreateTags(tagsArray, ruleParams, decCode, fullfilmentCondition) {
    logDebug("ENTER: CreateTags");

    var itemCap = capId;
    var wmuResult = null;
    if (arguments.length > 4) wmuResult = arguments[4]; // use wmuresult specified in args
    if (arguments.length > 5) itemCap = arguments[5]; // use cap ID specified in args
	
	var seasonPeriod = GetDateRange(DEC_CONFIG, LICENSE_SEASON, ruleParams.Year);
	var diff = dateDiff(new Date(), seasonPeriod[0]);

    if (tagsArray != null) {
        //Maintain Tag creation dictinary.
        if (dictTags == null) {
            dictTags = new DecMapper('Tags');
        }

        for (var item in tagsArray) {
            var tagProp = tagsArray[item];
            if (tagProp != null) {
                logDebug("NOT NULL TAG PROP");
                if (dictTags.Lookup(tagProp.TagType) == null) {
                    var isOkToCreate = checkRuletoCreateTag(ruleParams, tagProp, dictTags); 
                    logDebug("isOkToCreate: " + isOkToCreate);
                    if (isOkToCreate) {
                        var ats = tagProp.RecordType;
                        var ata = ats.split("/");
                        for (var idx = 0; idx < tagProp.issuecount; idx++) {
                            if (ata.length != 4) {
                                logDebug("**ERROR in CreateTags.  The following Application Type String is incorrectly formatted: " + ats);
                            } else {
                                var newLicId = issueSubLicense(ata[0], ata[1], ata[2], ata[3], "Active", itemCap);
                                var tagCodeDescription = GetTagTypedesc(tagProp.TagType);
                                editAppName(tagCodeDescription, newLicId);

                                var effectiveDt;
                                var clacFromDt;
                                if (diff > 0) {
                                    AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(seasonPeriod[0]);
                                    editFileDate(newLicId, seasonPeriod[0]);
                                    clacFromDt = dateAdd(convertDate(seasonPeriod[1]), 0);
                                    setLicExpirationDate(newLicId, "", clacFromDt);
                                } else {
                                    AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(new Date());
                                    editFileDate(newLicId, new Date());
                                    clacFromDt = dateAdd(convertDate(seasonPeriod[1]), 0);
                                    setLicExpirationDate(newLicId, "", clacFromDt);
                                }

                                AInfo["CODE.TAG_TYPE"] = tagProp.TagType;
                                AInfo["CODE.NEW_DOC_CAP_ID"] = newLicId;
                                setSalesItemASI(newLicId, tagProp.RecordType, decCode, 1, wmuResult, null);

                                var newDecDocId = GenerateDocumentNumber(newLicId.getCustomID());
                                updateDocumentNumber(newDecDocId, newLicId);
                                AInfo["CODE.NEW_DEC_DOCID"] = newDecDocId;
                            }
                        }
                        dictTags.Add(tagProp.TagType, tagProp);
                    }
                }
            } else {
                logDebug("NULL TAGPROP");
            }
        }
    }

    logDebug("EXIT: CreateTags");
}
function issueSubLicense(typeLevel1, typeLevel2, typeLevel3, typeLevel4, initStatus) {
    logDebug("ENTER: issueSubLicense");
    //logDebug("Elapsed Time: " + elapsed());

    //typeLevel3 - record status to set the license to initially                        
    //typeLevel4 - copy ASI from Application to License? (true/false)                       
    //createRefLP - create the reference LP (true/false)                        
    //licHolderSwitch - switch the applicant to license holder                      

    var itemCap = capId
    if (arguments.length > 5) itemCap = arguments[5]; // use cap ID specified in args

    var newLic = null;
    var newLicId = null;
    var newLicIdString = null;

    //create the license record                     
    newLicId = createChildForDec(typeLevel1, typeLevel2, typeLevel3, typeLevel4, null, itemCap);
    newLicIdString = newLicId.getCustomID();

    //updateTask("Issuance", "Active", "", "", "", newLicId);
    closeTaskForRec("Issuance", "Active", "", "", "", newLicId);
    updateAppStatus(initStatus, "Active", newLicId);
    activateTaskForRec("Report Game Harvest", "", newLicId);
    activateTaskForRec("Void Document", "", newLicId);
    activateTaskForRec("Revocation", "", newLicId);
    activateTaskForRec("Suspension", "", newLicId);

    //logDebug("Elapsed Time: " + elapsed());
    logDebug("EXIT: issueSubLicense");
    return newLicId;
}

function issueSelectedSalesItems(frm) {
    logDebug("ENTER: issueSelectedSalesItems");
    //logDebug("Elapsed Time: " + elapsed());
    //var feeArr = frm.getAllFeeToAdd();
    //    removeAllFees(capId);
    //    for (item in feeArr) {
    //        logDebug(feeArr[item].feeCode);
    //        addFeeWithVersion(feeArr[item].feeCode, feeArr[item].feeschedule, feeArr[item].version, "FINAL", feeArr[item].feeUnit, "Y");
    //    }

    //balanceDue == 0 ^ 
    closeTask("Issuance", "Approved", "", "");

    var arryTargetCapAttrib = new Array();
    var arryAccumTags = new Array();

    var uObj = new USEROBJ(publicUserID);
    salesAgentInfoArray = getAgentInfo(publicUserID, uObj);
    attachAgent(uObj);
    if (appTypeString == 'Licenses/Other/Sales/Application') {
        attachedContacts();
    }

    //Mark Fullfillment
    var fullfillCond = '';
    var isPublicUser = (uObj.acctType == 'CITIZEN');

    var condFulfill = new COND_FULLFILLMENT();
    if (isPublicUser) {
        fullfillCond = condFulfill.Condition_DailyInternetSales;
    } else {
        var isCallcenter = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
        var isCampsite = (salesAgentInfoArray["Agent Group"] == "Campsite");
        var isMunicipality = (salesAgentInfoArray["Agent Group"] == "Municipality");
        var isNYSDEC_HQ = (salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
        var isNYSDEC_Regional_Office = (salesAgentInfoArray["Agent Group"] == "NYSDEC Regional Office");
        var isNative_American_Agency = (salesAgentInfoArray["Agent Group"] == "Native American Agency");
        var isRetail = (salesAgentInfoArray["Agent Group"] == "Retail");

        if (isCallcenter) {
            fullfillCond = condFulfill.Condition_DailyCallCenterSales;
        }
    }

    //logDebug("Elapsed Time: " + elapsed());

    var allDecCodes = frm.getAllDecCodes();
    var recArr = frm.licObjARRAY;
    var ruleParams = frm.getRulesParam();
	var seasonPeriod = GetDateRange(DEC_CONFIG, LICENSE_SEASON, frm.Year);
    var diff = dateDiff(new Date(), seasonPeriod[0]);
	
    for (var item in recArr) {
        var oLic = recArr[item];
        var wmu1Result;
        var wmu2Result;

        if (oLic.IsSelected) {
            //If DMP Application is selected then Run Lottery
            //Add Conditions for each WMU selection
            var ats = oLic.RecordType;
            if (isNull(oLic.RecordType, '') != '') {
                var ata = ats.split("/");
                if (ata.length != 4) {
                    logDebug("**ERROR in issueSelectedSalesItems.  The following Application Type String is incorrectly formatted: " + ats);
                } else {
                    var newfd = new FeeDef();

                    if (appTypeString == 'Licenses/Other/Sales/ApplicationX') {
                        newfd.feeschedule = oLic.feeschedule;
                        newfd.version = oLic.feeversion;
                        newfd.feeCode = oLic.feecode;
                        newfd.formula = oLic.formula;
                        newfd.feeUnit = oLic.feeUnit;
                        newfd.feeDesc = oLic.feeDesc;
                        newfd.comments = oLic.comments;
                        newfd.Code3commission = oLic.Code3commission;
                    } else {
                        newfd.feeschedule = oLic.feeschedule;
                        newfd.version = oLic.feeversion;
                        //newfd.feeCode = oLic.feecode;
                        //newfd.formula = oLic.formula;
                        //newfd.feeUnit = oLic.feeUnit;
                        //newfd.feeDesc = oLic.feeDesc;
                        //newfd.comments = oLic.comments;
                        //newfd.Code3commission = oLic.Code3commission;

                        if ((typeof (FEESTOTRANSFER) == "object")) {
                            for (var y in FEESTOTRANSFER) {
                                if (FEESTOTRANSFER[y]["feeschedule"] == oLic.feeschedule) {
                                    newfd.feeCode = FEESTOTRANSFER[y]["feecode"];
                                    newfd.formula = FEESTOTRANSFER[y]["formula"];
                                    newfd.feeUnit = FEESTOTRANSFER[y]["feeUnit"];
                                    newfd.feeDesc = FEESTOTRANSFER[y]["feeDesc"];
                                    newfd.comments = FEESTOTRANSFER[y]["comments"];
                                    newfd.Code3commission = FEESTOTRANSFER[y]["Code3commission"];
                                    break;
                                }
                            }
                        }
                    }
                    oLic.DecCode = GetItemCode(newfd.Code3commission + "");
                    oLic.CodeDescription = GetItemCodedesc(oLic.DecCode);


                    //Get Tgs
                    var TagsArray = null;
                    if (isNull(oLic.FNTagsArray, '') != '') {
                        eval("TagsArray = " + oLic.FNTagsArray + "(ruleParams);");
                    }
                    oLic.TagsArray = TagsArray;

                    if (exists(TAG_TYPE_19_DEER_OF_EITHER_SEX_TAG, oLic.TagsArray)) {
                        ruleParams.SetEitherOrAntler(4);
                    }

                    if (exists(TAG_TYPE_20_ANTLERLESS_DEER_TAG, oLic.TagsArray)) {
                        ruleParams.SetEitherOrAntler(8);
                    }					
					
                    var isDMPApp = (oLic.RecordType == AA05_DEER_MANAGEMENT_PERMIT);
                    if (isDMPApp) {
                        var wmu1 = AInfo["WMU Choice 1"];
                        var wmu1ApplyLO = AInfo["Apply Land Owner for Choice1"];
                        var wmu2 = AInfo["WMU Choice 2"];
                        var wmu2ApplyLO = AInfo["Apply Land Owner for Choice2"];
                        var syear = AInfo["License Year"];
                        var activeHoldings = frm.ActiveHoldingsInfo;

                        var tagPropArray = new Array();
                        for (var t in oLic.TagsArray) {
                            //var tagProp = tagsMap.get(arryAccumTags[t]);
                            var tagProp = tagsMap.get(oLic.TagsArray[t]);
                            tagPropArray.push(tagProp);
                        }

                        if (wmu1 != null && wmu1 != 'NA') {
                            wmu1Result = RunDMPLottery(frm, syear, wmu1, 1, wmu1ApplyLO, activeHoldings, frm.PreferencePoints);
                            if (wmu1Result.Selected) {
                                CreateTags(tagPropArray, ruleParams, allDecCodes, "", wmu1Result);

                                addStdConditionWithComments("DMP Application Result", "WMU Choice 1", " - " + wmu1 + ":  SELECTED", AInfo["CODE.NEW_DEC_DOCID"]);
                            } else {
                                addStdConditionWithComments("DMP Application Result", "WMU Choice 1", " - " + wmu1 + ":  NOT SELECTED", "1 Preference Point");
                            }
                        }
                        if (wmu2 != null && wmu1 != 'NA' && (wmu1 != wmu2 || wmu1Result.Selected == true)) {
                            wmu2Result = RunDMPLottery(frm, syear, wmu2, 2, wmu2ApplyLO, activeHoldings, wmu1Result.PreferencePoints);
                            if (wmu2Result.Selected) {
                                CreateTags(tagPropArray, ruleParams, allDecCodes, "", wmu2Result);
                                addStdConditionWithComments("DMP Application Result", "WMU Choice 2", " - " + wmu2 + ":  SELECTED", AInfo["CODE.NEW_DEC_DOCID"]);
                            } else {
                                addStdConditionWithComments("DMP Application Result", "WMU Choice 2", " - " + wmu2 + ":  NOT SELECTED");
                            }
                        }
                    }

                    var newLicId = issueSubLicense(ata[0], ata[1], ata[2], ata[3], "Active");
                    editAppName(oLic.CodeDescription, newLicId);

                    var effectiveDt;
                    var clacFromDt;
                    if (ats == AA24_NONRESIDENT_1_DAY_FISHING || ats == AA03_ONE_DAY_FISHING_LICENSE) {
                        effectiveDt = AInfo["Effective Date One Day Fishing"];
                        editFileDate(newLicId, effectiveDt);
                        AInfo["CODE.Effective Date"] = effectiveDt;
                        clacFromDt = dateAdd(convertDate(effectiveDt), -1);
                        setLicExpirationDate(newLicId, clacFromDt);
                    }
                    else if (ats == AA25_NONRESIDENT_7_DAY_FISHING || ats == AA26_SEVEN_DAY_FISHING_LICENSE) {
                        effectiveDt = AInfo["Effective Date Seven Day Fishing"];
                        editFileDate(newLicId, effectiveDt);
                        AInfo["CODE.Effective Date"] = effectiveDt;
                        clacFromDt = dateAdd(convertDate(effectiveDt), -1);
                        setLicExpirationDate(newLicId, clacFromDt);
                    } else if (ats == AA23_NONRES_FRESHWATER_FISHING || ats == AA22_FRESHWATER_FISHING) {
                        effectiveDt = AInfo["Effective Date Fishing"];
                        editFileDate(newLicId, effectiveDt);
                        AInfo["CODE.Effective Date"] = effectiveDt;
                        clacFromDt = dateAdd(convertDate(effectiveDt), -1);
                        setLicExpirationDate(newLicId, clacFromDt);
                    } else if (ats == AA02_MARINE_REGISTRY) {
                        effectiveDt = AInfo["Effective Date Marine"];
                        if (diff > 0) {
                            AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(seasonPeriod[0]);
                            editFileDate(newLicId, seasonPeriod[0]);
                            clacFromDt = dateAdd(convertDate(seasonPeriod[1]), 0);
                            setLicExpirationDate(newLicId, clacFromDt);
                        } else {
                            AInfo["CODE.Effective Date"] = "01/01/" + frm.Year;
                            editFileDate(newLicId, new Date());
                            clacFromDt = dateAdd(convertDate(seasonPeriod[1]), 0);
                            setLicExpirationDate(newLicId, clacFromDt);
                        }
                    }
                    else if (ata[1] == "Other") {
                        AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(new Date());
                    } else {
                        if (diff > 0) {
                            AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(seasonPeriod[0]);
                            editFileDate(newLicId, seasonPeriod[0]);
                            clacFromDt = dateAdd(convertDate(seasonPeriod[1]), 0);
                            setLicExpirationDate(newLicId, "", clacFromDt);
                        } else {
                            AInfo["CODE.Effective Date"] = jsDateToMMDDYYYY(new Date());
                            editFileDate(newLicId, new Date());
                            clacFromDt = dateAdd(convertDate(seasonPeriod[1]), 0);
                            setLicExpirationDate(newLicId, "", clacFromDt);
                        }
                    }

                    if (ats == AA05_DEER_MANAGEMENT_PERMIT) {
                        //connect tag to DMP record
                        if (AInfo["CODE.NEW_DOC_CAP_ID"] != undefined && isNull(AInfo["CODE.NEW_DOC_CAP_ID"], '') != '') {
                            var result = aa.cap.createAppHierarchy(newLicId, AInfo["CODE.NEW_DOC_CAP_ID"]);
                            if (result.getSuccess()) {
                                logDebug("Parent DMP successfully linked");
                            }
                            else {
                                logDebug("Could not link DMP" + result.getErrorMessage());
                            }
                        }
                    }
                    setSalesItemASI(newLicId, oLic.RecordType, oLic.DecCode, oLic.feeUnit, wmu1Result, wmu2Result);
                    var newDecDocId = GenerateDocumentNumber(newLicId.getCustomID());
                    updateDocumentNumber(newDecDocId, newLicId);

                    //maintain array for later actions
                    arryTargetCapAttrib.push(new TargetCAPAttrib(newLicId, newfd));

                    if (oLic.TagsArray != null) {
                        var arraytmp = arrayUnique(arryAccumTags.concat(oLic.TagsArray));
                        arryAccumTags = arraytmp;
                    }
                }
            }
        }
    }

    //Tag Creation
    var tagPropArray = new Array();
    for (var t in arryAccumTags) {
        var tagProp = tagsMap.get(arryAccumTags[t]);
        tagPropArray.push(tagProp);
    }
    CreateTags(tagPropArray, ruleParams, allDecCodes, fullfillCond);
    createPrivilagePanel(ruleParams);

    distributeFeesAndPayments(capId, arryTargetCapAttrib, salesAgentInfoArray);

    if (appTypeString == 'Licenses/Annual/Application/NA') {
        updateContacts();
        if (!hmfulfilmmentCond.containsKey(fullfillCond)) {
            hmfulfilmmentCond.put(fullfillCond, fullfillCond);
        }
        addFullfillmentCondition(capId, hmfulfilmmentCond.keySet().toArray());
    }

    //logDebug("Elapsed Time: " + elapsed());
    logDebug("EXIT: issueSelectedSalesItems");
}

function createPrivilagePanel(ruleParams) {
    var arryTags_Priv = new Array();
    arryTags_Priv.push(new TagProp(LIC54_TAG_PRIV_PANEL, AA54_TAG_PRIV_PANEL, "", TAG_TYPE_24_PRIV_PANEL, 1));
    CreateTags(arryTags_Priv, ruleParams, null, '');
}
function RunDMPLottery(frm, syear, swmu, schoicenum, isApplyLO, activeHoldings, nPreferencePoints) {
    var currDrawType = getDrawTypeByPeriod(syear);

    var drw = new Draw_Obj(syear, swmu, schoicenum, currDrawType, isApplyLO);
    drw.IsNyResiDent = frm.IsNyResiDent;
    drw.IsDisableForYear = frm.IsDisableForYear;
    drw.IsMilitaryServiceman = frm.IsMilitaryServiceman;
    drw.PreferencePoints = nPreferencePoints;
    drw.Age = frm.Age;
    drw.Gender = frm.Gender;
    drw.IsMinor = frm.IsMinor;
    drw.IsLegallyBlind = frm.IsLegallyBlind;
    drw.HasBowHunt = frm.HasBowHunt;
    drw.HasTrapEd = frm.HasTrapEd;
    drw.HasHuntEd = frm.HasHuntEd;
    drw.havedefinedItems = hasWmuDefinedItems(activeHoldings);

    var drawResult = drw.RunLottery();
    debugObject(drawResult);
    return drawResult;
}
function SetformForSelectedLics(frm) {
    logDebug("ENTER: SetformForSelectedLics");

    //var frm = new form_OBJECT(GS2_SCRIPT);
    frm.Year = AInfo["License Year"];
    frm.DOB = AInfo["A_birthDate"];
    frm.Email = AInfo["A_email"];
    frm.IsNyResiDent = AInfo["A_IsNYResident"];
    frm.IsMilitaryServiceman = AInfo["Military Serviceman"];
    frm.IsNativeAmerican = AInfo["A_IsNativeAmerican"];
    frm.IsLegallyBlind = AInfo["Legally Blind"];
    frm.PreferencePoints = AInfo["A_Preference_Points"];
    frm.SetAnnualDisability(AInfo["A_Annual_Disability"]);
    frm.SetPriorLicense(AInfo["A_Previous_License"]);
    frm.SetSportsmanEducation(AInfo["A_Sportsman_Education"]);
    frm.SetLandOwnerInfo(AInfo["A_Land_Owner_Information"]);
    frm.SetActiveHoldingsInfo(AInfo["A_ActiveHoldings"]);
    frm.Quantity_Trail_Supporter_Patch = AInfo["Quantity Trail Supporter Patch"];
    frm.Quantity_Venison_Donation = AInfo["Quantity Venison Donation"];
    frm.Quantity_Conservation_Patron = AInfo["Quantity Conservation Patron"];
    frm.Quantity_Conservation_Fund = AInfo["Quantity Conservation Fund"];
    frm.Quantity_Conservationist_Magazine = AInfo["Quantity Conservationist Magazine"];
    frm.Quantity_Habitat_Stamp = AInfo["Quantity Habitat/Access Stamp"];
    frm.Inscription = AInfo["Inscription"];
    frm.IsPermanentDisabled = AInfo["Permanent Disability"];

    //ASIT info
    frm.ClearLandOwnerInfo();
    if (typeof (LANDOWNERINFORMATION) == "object") {
        for (y in LANDOWNERINFORMATION) {
            frm.AddLandOwnerInfo(LANDOWNERINFORMATION[y]["License Year"],
                    LANDOWNERINFORMATION[y]["SWIS Code"],
                    LANDOWNERINFORMATION[y]["Tax Map ID/Parcel ID"],
                    LANDOWNERINFORMATION[y]["Check this box to use this landowner parcel for your DMP application"]);
        }
    }

    frm.ClearAnnualDisability();
    if (typeof (ANNUALDISABILITY) == "object") {
        for (y in ANNUALDISABILITY) {
            frm.AddAnnualDisability(ANNUALDISABILITY[y]["Year"],
                    ANNUALDISABILITY[y]["Annual Disability Case Number"],
                    ANNUALDISABILITY[y]["40%+ Military Disabled"]);
        }
    }

    frm.ClearSportsmanEducation();
    if (typeof (SPORTSMANEDUCATION) == "object") {
        for (y in SPORTSMANEDUCATION) {
            frm.AddSportsmanEducation(SPORTSMANEDUCATION[y]["Sportsman Education Type"],
                    SPORTSMANEDUCATION[y]["Certificate Number"],
                    SPORTSMANEDUCATION[y]["State"],
                    SPORTSMANEDUCATION[y]["Country"],
                    SPORTSMANEDUCATION[y]["Other Country"]);
        }
    }

    frm.ClearPriorLicense();
    if (typeof (PREVIOUSLICENSE) == "object") {
        for (y in PREVIOUSLICENSE) {
            frm.AddPriorLicense(PREVIOUSLICENSE[y]["Previous License Type"],
                    PREVIOUSLICENSE[y]["License Date"],
                    PREVIOUSLICENSE[y]["License Number"],
                    PREVIOUSLICENSE[y]["State"],
                    PREVIOUSLICENSE[y]["Country"],
                    PREVIOUSLICENSE[y]["Other Country"],
                    PREVIOUSLICENSE[y]["Verified_By"]);
        }
    }

    frm.SetSelected(LIC01_JUNIOR_HUNTING_TAGS, (AInfo["Junior Hunting Tags"] == "CHECKED"));
    frm.SetSelected(LIC02_MARINE_REGISTRY, (AInfo["Marine Registry"] == "CHECKED"));
    frm.SetSelected(LIC03_ONE_DAY_FISHING_LICENSE, (AInfo["One Day Fishing License"] == "CHECKED"));
    frm.SetSelected(LIC04_BOWHUNTING_PRIVILEGE, (AInfo["Bowhunting Privilege"] == "CHECKED"));
    frm.SetSelected(LIC05_DEER_MANAGEMENT_PERMIT, (AInfo["Deer Management Permit"] == "CHECKED"));
    frm.SetSelected(LIC06_HUNTING_LICENSE, (AInfo["Hunting License"] == "CHECKED"));
    frm.SetSelected(LIC07_MUZZLELOADING_PRIVILEGE, (AInfo["Muzzleloading Privilege"] == "CHECKED"));
    frm.SetSelected(LIC08_TURKEY_PERMIT, (AInfo["Turkey Permit"] == "CHECKED"));
    frm.SetSelected(LIC09_LIFETIME_BOWHUNTING, (AInfo["Lifetime Bowhunting"] == "CHECKED"));
    frm.SetSelected(LIC10_LIFETIME_FISHING, (AInfo["Lifetime Fishing"] == "CHECKED"));
    frm.SetSelected(LIC11_LIFETIME_MUZZLELOADING, (AInfo["Lifetime Muzzleloading"] == "CHECKED"));
    frm.SetSelected(LIC12_LIFETIME_SMALL_AND_BIG_GAME, (AInfo["Lifetime Small & Big Game"] == "CHECKED"));
    frm.SetSelected(LIC13_LIFETIME_SPORTSMAN, (AInfo["Lifetime Sportsman"] == "CHECKED"));
    frm.SetSelected(LIC14_LIFETIME_TRAPPING, (AInfo["Lifetime Trapping"] == "CHECKED"));
    frm.SetSelected(LIC15_TRAPPING_LICENSE, (AInfo["Trapping License"] == "CHECKED"));
    frm.SetSelected(LIC16_HABITAT_ACCESS_STAMP, (AInfo["Habitat/Access Stamp"] == "CHECKED"));
    frm.SetSelected(LIC17_VENISON_DONATION, (AInfo["Venison Donation"] == "CHECKED"));
    frm.SetSelected(LIC18_CONSERVATION_FUND, (AInfo["Conservation Fund"] == "CHECKED"));
    frm.SetSelected(LIC19_TRAIL_SUPPORTER_PATCH, (AInfo["Trail Supporter Patch"] == "CHECKED"));
    frm.SetSelected(LIC20_CONSERVATIONIST_MAGAZINE, (AInfo["Conservationist Magazine"] == "CHECKED"));
    frm.SetSelected(LIC21_CONSERVATION_PATRON, (AInfo["Conservation Patron"] == "CHECKED"));
    frm.SetSelected(LIC18_CONSERVATION_FUND, (AInfo["Conservation Fund"] == "CHECKED"));
    frm.SetSelected(LIC19_TRAIL_SUPPORTER_PATCH, (AInfo["Trail Supporter Patch"] == "CHECKED"));
    frm.SetSelected(LIC20_CONSERVATIONIST_MAGAZINE, (AInfo["Conservationist Magazine"] == "CHECKED"));
    frm.SetSelected(LIC21_CONSERVATION_PATRON, (AInfo["Conservation Patron"] == "CHECKED"));
    frm.SetSelected(LIC22_FRESHWATER_FISHING, (AInfo["Freshwater Fishing"] == "CHECKED"));
    frm.SetSelected(LIC23_NONRES_FRESHWATER_FISHING, (AInfo["NonRes Freshwater Fishing"] == "CHECKED"));
    frm.SetSelected(LIC24_NONRESIDENT_1_DAY_FISHING, (AInfo["Nonresident 1 Day Fishing"] == "CHECKED"));
    frm.SetSelected(LIC25_NONRESIDENT_7_DAY_FISHING, (AInfo["Nonresident 7 Day Fishing"] == "CHECKED"));
    frm.SetSelected(LIC26_SEVEN_DAY_FISHING_LICENSE, (AInfo["Seven Day Fishing License"] == "CHECKED"));
    frm.SetSelected(LIC27_CONSERVATION_LEGACY, (AInfo["Conservation Legacy"] == "CHECKED"));
    frm.SetSelected(LIC28_JUNIOR_BOWHUNTING, (AInfo["Junior Bowhunting"] == "CHECKED"));
    frm.SetSelected(LIC29_JUNIOR_HUNTING, (AInfo["Junior Hunting"] == "CHECKED"));
    frm.SetSelected(LIC30_NONRES_MUZZLELOADING, (AInfo["NonRes Muzzleloading"] == "CHECKED"));
    frm.SetSelected(LIC31_NONRES_SUPER_SPORTSMAN, (AInfo["NonRes Super Sportsman"] == "CHECKED"));
    frm.SetSelected(LIC32_NONRESIDENT_BEAR_TAG, (AInfo["Nonresident Bear Tag"] == "CHECKED"));
    frm.SetSelected(LIC33_NONRESIDENT_BIG_GAME, (AInfo["Nonresident Big Game"] == "CHECKED"));
    frm.SetSelected(LIC34_NONRESIDENT_BOWHUNTING, (AInfo["Nonresident Bowhunting"] == "CHECKED"));
    frm.SetSelected(LIC35_NONRESIDENT_SMALL_GAME, (AInfo["Nonresident Small Game"] == "CHECKED"));
    frm.SetSelected(LIC36_NONRESIDENT_TURKEY, (AInfo["Nonresident Turkey"] == "CHECKED"));
    frm.SetSelected(LIC37_SMALL_AND_BIG_GAME, (AInfo["Small and Big Game"] == "CHECKED"));
    frm.SetSelected(LIC38_SMALL_GAME, (AInfo["Small Game"] == "CHECKED"));
    frm.SetSelected(LIC39_SPORTSMAN, (AInfo["Sportsman"] == "CHECKED"));
    frm.SetSelected(LIC40_SUPER_SPORTSMAN, (AInfo["Super Sportsman"] == "CHECKED"));
    frm.SetSelected(LIC41_NONRESIDENT_TRAPPING, (AInfo["Nonresident Trapping"] == "CHECKED"));
    frm.SetSelected(LIC42_TRAPPER_SUPER_SPORTSMAN, (AInfo["Trapper Super Sportsman"] == "CHECKED"));
    frm.SetSelected(LIC43_LIFETIME_CARD_REPLACE, (AInfo["Lifetime Card Replace"] == "CHECKED"));
    frm.SetSelected(LIC44_SPORTSMAN_ED_CERTIFICATION, (AInfo["Sportsman Ed Certification"] == "CHECKED"));
    frm.SetSelected(LIC45_LIFETIME_INSCRIPTION, (AInfo["Lifetime Inscription"] == "CHECKED"));

    frm.ExecuteBoRuleEngine();

    logDebug("EXIT: SetformForSelectedLics");
}

function SetOtherformForSelectedLics(frm) {
    logDebug("ENTER: SetOtherformForSelectedLics");

    //var frm = new form_OBJECT(GS2_SCRIPT);
    frm.Year = 'OTHERSALE';
    frm.Quantity_Trail_Supporter_Patch = AInfo["Quantity Trail Supporter Patch"];
    frm.Quantity_Venison_Donation = AInfo["Quantity Venison Donation"];
    frm.Quantity_Conservation_Patron = AInfo["Quantity Conservation Patron"];
    frm.Quantity_Conservation_Fund = AInfo["Quantity Conservation Fund"];
    frm.Quantity_Conservationist_Magazine = AInfo["Quantity Conservationist Magazine"];
    frm.Quantity_Habitat_Stamp = AInfo["Quantity Habitat/Access Stamp"];


    frm.SetSelected(LIC16_HABITAT_ACCESS_STAMP, (AInfo["Habitat/Access Stamp"] == "CHECKED"));
    frm.SetSelected(LIC17_VENISON_DONATION, (AInfo["Venison Donation"] == "CHECKED"));
    frm.SetSelected(LIC18_CONSERVATION_FUND, (AInfo["Conservation Fund"] == "CHECKED"));
    frm.SetSelected(LIC19_TRAIL_SUPPORTER_PATCH, (AInfo["Trail Supporter Patch"] == "CHECKED"));
    frm.SetSelected(LIC20_CONSERVATIONIST_MAGAZINE, (AInfo["Conservationist Magazine"] == "CHECKED"));
    frm.SetSelected(LIC21_CONSERVATION_PATRON, (AInfo["Conservation Patron"] == "CHECKED"));
    frm.SetSelected(LIC18_CONSERVATION_FUND, (AInfo["Conservation Fund"] == "CHECKED"));
    frm.SetSelected(LIC19_TRAIL_SUPPORTER_PATCH, (AInfo["Trail Supporter Patch"] == "CHECKED"));
    frm.SetSelected(LIC20_CONSERVATIONIST_MAGAZINE, (AInfo["Conservationist Magazine"] == "CHECKED"));
    frm.SetSelected(LIC21_CONSERVATION_PATRON, (AInfo["Conservation Patron"] == "CHECKED"));
    frm.SetSelected(LIC43_LIFETIME_CARD_REPLACE, (AInfo["Lifetime Card Replace"] == "CHECKED"));
    frm.SetSelected(LIC44_SPORTSMAN_ED_CERTIFICATION, (AInfo["Sportsman Ed Certification"] == "CHECKED"));

    frm.ExecuteBoRuleEngine();

    logDebug("EXIT: SetOtherformForSelectedLics");
}


function addFeeAndSetAsitForFeetxfer(frm) {
    logDebug("ENTER: addFeeAndSetAsitForFeetxfer");

    removeAllFees(capId);

    var feeArr = frm.getAllFeeToAdd();

    var tempObject = new Array();
    var newAsitArray = new Array();
    for (item in feeArr) {
        //logDebug(feeArr[item].feeschedule + " " + feeArr[item].feeCode + " " + feeArr[item].version + " " + feeArr[item].feeUnit);
        addFeeWithVersion(feeArr[item].feeCode, feeArr[item].feeschedule, feeArr[item].version, "FINAL", feeArr[item].feeUnit.toString(), "N");

        tempObject = new Array();
        var fieldInfo = new asiTableValObj("feeschedule", feeArr[item].feeschedule, "Y");
        tempObject["feeschedule"] = fieldInfo;
        fieldInfo = new asiTableValObj("feecode", feeArr[item].feeCode, "Y");
        tempObject["feecode"] = fieldInfo;
        fieldInfo = new asiTableValObj("formula", feeArr[item].formula, "Y");
        tempObject["formula"] = fieldInfo;
        fieldInfo = new asiTableValObj("feeUnit", feeArr[item].feeUnit.toString(), "Y");
        tempObject["feeUnit"] = fieldInfo;
        fieldInfo = new asiTableValObj("comments", feeArr[item].comments, "Y");
        tempObject["comments"] = fieldInfo;
        fieldInfo = new asiTableValObj("feeDesc", feeArr[item].feeDesc, "Y");
        tempObject["feeDesc"] = fieldInfo;
        fieldInfo = new asiTableValObj("feeversion", feeArr[item].version, "Y");
        tempObject["feeversion"] = fieldInfo;
        fieldInfo = new asiTableValObj("Code3commission", feeArr[item].Code3commission, "Y");
        tempObject["Code3commission"] = fieldInfo;
        newAsitArray.push(tempObject);  // end of record
    }
    asitModel = cap.getAppSpecificTableGroupModel();
    new_asit = addASITable4ACAPageFlow(asitModel, "FEES TO TRANSFER", newAsitArray);

    logDebug("EXIT: addFeeAndSetAsitForFeetxfer");
}

function getApplicantArrayEx() {
    logDebug("ENTER: getApplicantArrayEx");

    // Returns an array of associative arrays with applicant attributes.
    // optional capid
    // added check for ApplicationSubmitAfter event since the getApplicantModel array is only on pageflow,
    // on ASA it should still be pulled normal way even though still partial cap
    var thisCap = capId;
    if (arguments.length == 1) thisCap = arguments[0];

    var cArray = new Array();
    var aArray;
    // JHS 10/9/2013 added test for convertToRealCapAfter since this is being run on partial caps
    if (arguments.length == 0 && !cap.isCompleteCap() && controlString != "ApplicationSubmitAfter" && controlString != "ConvertToRealCapAfter") // we are in a page flow script so use the capModel to get applicant
    {
        var capApplicant = cap.getApplicantModel();
        aArray = getApplicantInfoArray(capApplicant);
        cArray.push(aArray);
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(thisCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
            if (capContactArray) {
                for (yy in capContactArray) {
                    //First One is always Applicant else check for contact type
                    aArray = getApplicantInfoArray(capContactArray[yy], thisCap);
                    cArray.push(aArray);
                    
                    //Defects 8970 and 8971 - commenting out this break as you cannot assume the applicant/individual is always first
                    //I think when we turned sync off the DEC Agent started being first.
                    //break;
                }
            }
        }
    }
    logDebug("EXIT: getApplicantArrayEx");
    return cArray;
}

function getApplicantInfoArray(capContactObj) {
    var aArray = new Array();
    aArray["lastName"] = capContactObj.getPeople().lastName;
    aArray["firstName"] = capContactObj.getPeople().firstName;
    aArray["middleName"] = capContactObj.getPeople().middleName;
    aArray["businessName"] = capContactObj.getPeople().businessName;
    aArray["contactSeqNumber"] = capContactObj.getPeople().contactSeqNumber;
    if (capContactObj.getCapContactModel == undefined) {
        aArray["refcontactSeqNumber"] = capContactObj.getRefContactNumber();
    } else {
        aArray["refcontactSeqNumber"] = capContactObj.getCapContactModel().getRefContactNumber();
    }
    aArray["contactType"] = capContactObj.getPeople().contactType;
    aArray["relation"] = capContactObj.getPeople().relation;
    aArray["phone1"] = capContactObj.getPeople().phone1;
    aArray["phone2"] = capContactObj.getPeople().phone2;
    aArray["email"] = capContactObj.getPeople().email;
    aArray["addressLine1"] = capContactObj.getPeople().getCompactAddress().getAddressLine1();
    aArray["addressLine2"] = capContactObj.getPeople().getCompactAddress().getAddressLine2();
    aArray["city"] = capContactObj.getPeople().getCompactAddress().getCity();
    aArray["state"] = capContactObj.getPeople().getCompactAddress().getState();
    aArray["zip"] = capContactObj.getPeople().getCompactAddress().getZip();
    aArray["fax"] = capContactObj.getPeople().fax;
    aArray["notes"] = capContactObj.getPeople().notes;
    aArray["country"] = capContactObj.getPeople().getCompactAddress().getCountry();
    aArray["fullName"] = capContactObj.getPeople().fullName;
    aArray["gender"] = capContactObj.getPeople().gender;
    aArray["birthDate"] = capContactObj.getPeople().birthDate;
    aArray["driverLicenseNbr"] = capContactObj.getPeople().driverLicenseNbr;
    aArray["driverLicenseState"] = capContactObj.getPeople().driverLicenseState;
    aArray["deceasedDate"] = capContactObj.getPeople().deceasedDate;
    aArray["passportNumber"] = capContactObj.getPeople().passportNumber;

    var pa;
    if (arguments.length == 1 && !cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") // using capModel to get contacts
    {
        if (capContactObj.getPeople().getAttributes() != null) {
            pa = capContactObj.getPeople().getAttributes().toArray();
            for (xx1 in pa) {
                aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;
            }
        }
    } else {
        if (capContactObj.getCapContactModel().getPeople().getAttributes() != null) {
            pa = capContactObj.getCapContactModel().getPeople().getAttributes().toArray();
            for (xx1 in pa) {
                aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;
            }
        }
    }

    return aArray;
}
function GetTableValueArrayByDelimitedString(tableName, delimStr) {
    logDebug("ENTER: GetTableValueArrayByDelimitedString");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();
    var colNames = allTableNames[allTableRefLink[tableName]];

    if (delimStr != null && delimStr != "") {
        var rows = delimStr.split("|");
        for (var irow = 0; irow < rows.length; irow++) {
            tempObject = new Array();
            var colval = rows[irow].split("^");
            for (var idx = 0; idx < colval.length; idx++) {
                var fieldInfo = new asiTableValObj(colNames[idx], colval[idx], readOnly);
                tempObject[colNames[idx]] = fieldInfo;
            }
            tempArray.push(tempObject);  // end of record
        }
    }
    logDebug("EXIT: GetTableValueArrayByDelimitedString");

    return tempArray;
}

function GetASITDelimitedString(tableName, tablevalue) {
    logDebug("ENTER: GetASITDelimitedString");

    var aTable = "";
    var copyStr = " aTable = tablevalue;"
    eval(copyStr);
    var delimitedStr = "";
    if (typeof (aTable) == "object") {
        for (y in aTable) {
            if (y != 0) delimitedStr += "|";

            var currrow = "";
            var colNames = allTableNames[allTableRefLink[tableName]];

            for (var idx = 0; idx < colNames.length; idx++) {
                if (idx != 0) { currrow += "^"; }
                currrow += aTable[y][colNames[idx]];
            }
            delimitedStr += currrow;
        }
    }
    logDebug("EXIT: GetASITDelimitedString");

    return delimitedStr;
}

function copyContactAppSpecificToRecordAppSpecific() {
    logDebug("ENTER: copyContactAppSpecificToRecordAppSpecific");

    var isNotValidToProceed = true;

    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    for (ca in xArray) {
        var thisContact = xArray[ca];
        //First One is always Applicant

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
                    editAppSpecific4ACA("A_Preference_Points", fieldArray["Preference Points"]);
                    editAppSpecific4ACA("Preference Points", fieldArray["Preference Points"]);
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
            //strActiveHoldings = GetContactASITDelimitedString(subGroupArray["ACTIVE HOLDINGS"]);
        }

        //----load ASITs
        editAppSpecific4ACA("A_Annual_Disability", strAnnual);
        editAppSpecific4ACA("A_Previous_License", strPrev);
        editAppSpecific4ACA("A_Land_Owner_Information", strLand);
        editAppSpecific4ACA("A_Sportsman_Education", strEduc);
        //editAppSpecific4ACA("A_ActiveHoldings", strActiveHoldings);

        var asitModel;
        var new_asit;

        if (!(typeof (LANDOWNERINFORMATION) == "object")) {
            var newLandOwnerInfo = GetTableValueArrayByDelimitedString("LANDOWNERINFORMATION", strLand)
            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "LAND OWNER INFORMATION", newLandOwnerInfo);
        }
        if (!(typeof (ANNUALDISABILITY) == "object")) {
            var newAnnualDiability = GetTableValueArrayByDelimitedString("ANNUALDISABILITY", strAnnual)
            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "ANNUAL DISABILITY", newAnnualDiability);
        }
        if (!(typeof (SPORTSMANEDUCATION) == "object")) {
            var newSportsmanDucat = GetTableValueArrayByDelimitedString("SPORTSMANEDUCATION", strEduc)
            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "SPORTSMAN EDUCATION", newSportsmanDucat);

        }
        if (!(typeof (PREVIOUSLICENSE) == "object")) {
            var newPreviousLic = GetTableValueArrayByDelimitedString("PREVIOUSLICENSE", strPrev)
            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "PREVIOUS LICENSE", newPreviousLic);
        }

        //Contact Conditions Settings
        var contactCondArray = getContactCondutions(peopleSequenceNumber);
        editAppSpecific4ACA("A_Suspended", (isSuspension(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_Revoked_Hunting", (isRevocationHunting(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_Revoked_Trapping", (isRevocationTrapping(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_Revoked_Fishing", (isRevocationFishing(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_AgedIn", (isMarkForAgedInFulfillment(contactCondArray) ? "Yes" : "No"));
        editAppSpecific4ACA("A_NeedHuntEd", (isMarkForNeedHutEdFulfillment(contactCondArray) ? "Yes" : "No"));

        if (!isSuspension(contactCondArray)) {
            isNotValidToProceed = false;
        }
        break;
    }

    logDebug("EXIT: copyContactAppSpecificToRecordAppSpecific");

    return isNotValidToProceed;
}

function GetContactASITDelimitedString(rowsValueArray) {
    logDebug("ENTER: GetASITDelimitedString");

    var delimitedStr = "";
    for (var vv in rowsValueArray) {
        var tempArray = rowsValueArray[vv];
        if (vv != 0) delimitedStr += "|";
        for (var row in tempArray) {
            var currrow = "";
            var tempObject = tempArray[row];
            for (var val in tempObject) {
                var fieldInfo = tempObject[val];
                if (val != 0) { currrow += "^"; }
                currrow += isNull(fieldInfo.fieldValue, '');
            }
            delimitedStr += currrow;
        }
    }
    logDebug("EXIT: GetASITDelimitedString");

    return delimitedStr;
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms / ONE_DAY)

}

function getDepartmentName(username) {
    var suo = aa.person.getUser(username).getOutput();
    var dpt = aa.people.getDepartmentList(null).getOutput();
    for (var thisdpt in dpt) {
        var m = dpt[thisdpt]
        var n = m.getServiceProviderCode() + "/" + m.getAgencyCode() + "/" + m.getBureauCode() + "/" + m.getDivisionCode() + "/" + m.getSectionCode() + "/" + m.getGroupCode() + "/" + m.getOfficeCode()

        if (n.equals(suo.deptOfUser))
            return (m.getDeptName())
    }
}

function SetTableStringFields() {
    logDebug("ENTER: SetTableStringFields");

    //ASIT info
    var strLand = (typeof (LANDOWNERINFORMATION) == "object") ? GetASITDelimitedString("LANDOWNERINFORMATION", LANDOWNERINFORMATION) : null;
    var strAnnual = (typeof (ANNUALDISABILITY) == "object") ? GetASITDelimitedString("ANNUALDISABILITY", ANNUALDISABILITY) : null;
    var strEduc = (typeof (SPORTSMANEDUCATION) == "object") ? GetASITDelimitedString("SPORTSMANEDUCATION", SPORTSMANEDUCATION) : null;
    var strPrev = (typeof (PREVIOUSLICENSE) == "object") ? GetASITDelimitedString("PREVIOUSLICENSE", PREVIOUSLICENSE) : null;
    //var strAllHolding = (typeof (ACTIVEHOLDINGS) == "object") ? GetASITDelimitedString("ACTIVEHOLDINGS", ACTIVEHOLDINGS) : null;

    //NOT WORKING: Not getting these updates on next page ASI Display
    editAppSpecific4ACA("A_Annual_Disability", strAnnual);
    editAppSpecific4ACA("A_Previous_License", strPrev);
    editAppSpecific4ACA("A_Land_Owner_Information", strLand);
    editAppSpecific4ACA("A_Sportsman_Education", strEduc);
    //editAppSpecific4ACA("A_ActiveHoldings", strAllHolding);
    editAppSpecific4ACA("A_IsNativeAmerican", AInfo["Native American?"]);

    logDebug("EXIT: SetTableStringFields");
}

function logArgs(args) {
    return;
    if (args) {
        if (args.length > 0) {
            for (var irow = 0; irow < args.length; irow++) {
                logDebug("argument = " + irow + " = " + args[0]);
            }
        } else {
            logDebug("Arguments: NONE");
        }
    } else {
        logDebug("Calling Exception: logArgs expects parameter as arguments");
    }
}

function getCAPModel(capIDModel) {
    aa.log("Init: Find out CAP information.");
    var capModel = aa.cap.getCapViewBySingle4ACA(capIDModel);
    if (capModel == null) {
        aa.log("Fail to get CAP model: " + capIDModel.toString());
        return null;
    }
    return capModel;
}

function editAppSpecific4ACA(itemName, itemValue) {
    var i = cap.getAppSpecificInfoGroups().iterator();

    while (i.hasNext()) {
        var group = i.next();
        var fields = group.getFields();
        if (fields != null) {
            var iteFields = fields.iterator();
            while (iteFields.hasNext()) {
                var field = iteFields.next();
                if ((useAppSpecificGroupName && itemName.equals(field.getCheckboxType() + "." + field.getCheckboxDesc())) || itemName.equals(field.getCheckboxDesc())) {
                    field.setChecklistComment(itemValue);
                }
            }
        }
    }
}

function formatMMDDYYYY(pDate) {
    var dDate = new Date(pDate);

    return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}

function debugObject(object) {
    var output = '';
    for (property in object) {
        output += "<font color=red>" + property + "</font>" + ': ' + "<bold>" + object[property] + "</bold>" + '; ' + "<BR>";
    }
    logDebug(output);
}

function setASIFieldGroupinstruction4ACA(gName, instruction, itemCap) {
    //OBSOLETE
    logDebug("ENTER: setASIFieldGroupinstruction4ACA");
    var asiGroups;
    if (itemCap != null) {
        var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
        if (appSpecInfoResult.getSuccess()) {
            //var formGroups = appSpecInfoResult.toArray();
            //aa.print(formGroups);
            var fAppSpecInfoObj = appSpecInfoResult.getOutput();

            for (loopk in fAppSpecInfoObj) {
                if (useAppSpecificGroupName) {
                    aa.print(fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc);
                    aa.print(fAppSpecInfoObj[loopk].checklistComment);
                }
                else {
                    debugObject(fAppSpecInfoObj[loopk]);
                    aa.print(fAppSpecInfoObj[loopk].checkboxDesc);
                    aa.print(fAppSpecInfoObj[loopk].checklistComment);
                }
            }
        }
    } else {
        asiGroups = cap.getAppSpecificInfoGroups()
        for (i = 0; i < asiGroups.size(); i++) {
            logDebug("Lalit");
            debugObject(asiGroups.get(i));
            //logDebug(asiGroups.get(i).getGroupName());
            //logDebug(asiGroups.get(i).getCheckBoxGroup());
            //asiGroups.get(i).getGroupName();
            if (asiGroups.get(i).getGroupName() == gName) {
                //instruction

            }
        }
        //var wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
        //openUrlInNewWindow("www.gcomsoft.com");

    }
    logDebug("EXIT: setASIFieldGroupinstruction4ACA");
    return true;
}
function addFeeWithVersion(fcode, fsched, fversion, fperiod, fqty, finvoice) // Adds a single fee, optional argument: fCap
{
    // Updated Script will return feeSeq number or null if error encountered (SR5112)
    var feeCap = capId;
    var feeCapMessage = "";
    var feeSeq_L = new Array();    // invoicing fee for CAP in args
    var paymentPeriod_L = new Array();   // invoicing pay periods for CAP in args
    var feeSeq = null;
    if (arguments.length > 6) {
        feeCap = arguments[6]; // use cap ID specified in args
        feeCapMessage = " to specified CAP";
    }

    assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fversion, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        feeSeq = assessFeeResult.getOutput();
        logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
        logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

        if (finvoice == "Y" && arguments.length == 6) // use current CAP
        {
            feeSeqList.push(feeSeq);
            paymentPeriodList.push(fperiod);
        }
        if (finvoice == "Y" && arguments.length > 6) // use CAP in args
        {
            feeSeq_L.push(feeSeq);
            paymentPeriod_L.push(fperiod);
            var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
            if (invoiceResult_L.getSuccess())
                logMessage("Invoicing assessed fee items" + feeCapMessage + " is successful.");
            else
                logDebug("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
        }
    }
    else {
        logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
        feeSeq = null;
    }

    return feeSeq;
}

function addFeeWithVersionAndReturnfeeSeq(fcode, fsched, fversion, fperiod, fqty, finvoice) // Adds a single fee, optional argument: fCap
{
    // Updated Script will return feeSeq number or null if error encountered (SR5112)
    var feeCap = capId;
    var feeCapMessage = "";
    var feeSeq_L = new Array();    // invoicing fee for CAP in args
    var paymentPeriod_L = new Array();   // invoicing pay periods for CAP in args
    var feeSeq = null;
    var feeSeqAndPeriodArray = new Array();

    if (arguments.length > 6) {
        feeCap = arguments[6]; // use cap ID specified in args
        feeCapMessage = " to specified CAP";
    }

    assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fversion, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        feeSeq = assessFeeResult.getOutput();
        logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
        logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

        if (finvoice == "Y" && arguments.length == 6) // use current CAP
        {
            feeSeqList.push(feeSeq);
            paymentPeriodList.push(fperiod);
        }
        if (finvoice == "Y" && arguments.length > 6) // use CAP in args
        {
            feeSeq_L.push(feeSeq);
            feeSeqAndPeriodArray.push(feeSeq)

            paymentPeriod_L.push(fperiod);
            feeSeqAndPeriodArray.push(fperiod)
        }
    }
    else {
        logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
        feeSeq = null;
    }

    return feeSeqAndPeriodArray;
}

function createInvoice(feeSeq_L, paymentPeriod_L) {
    var feeCap = capId;
    var feeCapMessage = "";

    if (arguments.length > 2) {
        feeCap = arguments[2]; // use cap ID specified in args
        feeCapMessage = " to specified CAP";
    }

    var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
    if (invoiceResult_L.getSuccess())
        logMessage("Invoicing assessed fee items" + feeCapMessage + " is successful.");
    else
        logDebug("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
}

function updateFeeWithVersion(fcode, fsched, fversion, fperiod, fqty, finvoice, pDuplicate, pFeeSeq) {
    // Updates an assessed fee with a new Qty.  If not found, adds it; else if invoiced fee found, adds another with adjusted qty.
    // optional param pDuplicate -if "N", won't add another if invoiced fee exists (SR5085)
    // Script will return fee sequence number if new fee is added otherwise it will return null (SR5112)
    // Optional param pSeqNumber, Will attempt to update the specified Fee Sequence Number or Add new (SR5112)
    // 12/22/2008 - DQ - Correct Invoice loop to accumulate instead of reset each iteration

    // If optional argument is blank, use default logic (i.e. allow duplicate fee if invoiced fee is found)
    if (pDuplicate == null || pDuplicate.length == 0)
        pDuplicate = "Y";
    else
        pDuplicate = pDuplicate.toUpperCase();

    var invFeeFound = false;
    var adjustedQty = fqty;
    var feeSeq = null;
    feeUpdated = false;

    if (pFeeSeq == null)
        getFeeResult = aa.finance.getFeeItemByFeeCode(capId, fcode, fperiod);
    else
        getFeeResult = aa.finance.getFeeItemByPK(capId, pFeeSeq);


    var feeList;
    if (getFeeResult.getSuccess()) {
        if (pFeeSeq == null)
            feeList = getFeeResult.getOutput();
        else {
            feeList = new Array();
            feeList[0] = getFeeResult.getOutput();
        }
        for (feeNum in feeList)
            if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
                if (pDuplicate == "Y") {
                    logDebug("Invoiced fee " + fcode + " found, subtracting invoiced amount from update qty.");
                    adjustedQty = adjustedQty - feeList[feeNum].getFeeUnit();
                    invFeeFound = true;
                }
                else {
                    invFeeFound = true;
                    logDebug("Invoiced fee " + fcode + " found.  Not updating this fee. Not assessing new fee " + fcode);
                }
            }

        for (feeNum in feeList)
            if (feeList[feeNum].getFeeitemStatus().equals("NEW") && !feeUpdated)  // update this fee item
            {
                feeSeq = feeList[feeNum].getFeeSeqNbr();
                var editResult = aa.finance.editFeeItemUnit(capId, fqty, feeSeq);
                feeUpdated = true;
                if (editResult.getSuccess()) {
                    logDebug("Updated Qty on Existing Fee Item: " + fcode + " to Qty: " + fqty);
                    if (finvoice == "Y") {
                        feeSeqList.push(feeSeq);
                        paymentPeriodList.push(fperiod);
                    }
                }
                else
                { logDebug("**ERROR: updating qty on fee item (" + fcode + "): " + editResult.getErrorMessage()); break }
            }
    }
    else
    { logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage()) }

    // Add fee if no fee has been updated OR invoiced fee already exists and duplicates are allowed
    if (!feeUpdated && adjustedQty != 0 && (!invFeeFound || invFeeFound && pDuplicate == "Y"))
        feeSeq = addFeeWithVersion(fcode, fsched, fversion, fperiod, adjustedQty, finvoice);
    else
        feeSeq = null;

    return feeSeq;
}

function transferReceiptAndApply(receiptCapId, targetCapId) {
    var amtResult = parseFloat(aa.cashier.getSumNotAllocated(receiptCapId).getOutput());

    if (arguments.length == 3) {
        balanceDue = arguments[2];
    }

    if (amtResult < balanceDue) {
        logDebug("insufficient funds to do transfer from receipt record");
        return false;
    }

    var xferResult = aa.finance.makeFundTransfer(receiptCapId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, balanceDue, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
    if (xferResult.getSuccess())
        logDebug("Successfully transferred $" + balanceDue + " from " + receiptCapId + " to " + targetCapId);
    else
        logDebug("Error transferring funds " + xferResult.getErrorMessage());


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

function addStdConditionWithComments(cType, cDesc, cShortComment, cLongComment) // optional cap ID
{
    logDebug("ENTER: addStdConditionWithComments");

    var itemCap = capId;
    if (arguments.length == 5) itemCap = arguments[4]; // use cap ID specified in args

    if (!aa.capCondition.getStandardConditions) {
        logDebug("addStdCondition function is not available in this version of Accela Automation.");
    }
    else {
        standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
        for (i = 0; i < standardConditions.length; i++)
            if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
            {
                standardCondition = standardConditions[i];
                if (cShortComment != null && cShortComment != '') {
                    standardCondition.setConditionComment(cShortComment);
                }
                if (cLongComment != null && cLongComment != '') {
                    standardCondition.setLongDescripton(cLongComment);
                }

                var addCapCondResult = aa.capCondition.createCapConditionFromStdCondition(itemCap, standardCondition);
                if (addCapCondResult.getSuccess()) {
                    logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
                }
                else {
                    logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
                }
            }
    }
    logDebug("EXIT: addStdConditionWithComments");
}

function distributeFeesAndPayments(sourceCapId, arryTargetCapAttrib, pSalesAgentInfoArray) {
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
    for (x in feeA) {
        thisFee = feeA[x];
        logDebug("status is " + thisFee.status)
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

    var unapplied = paymentGetNotAppliedTot()

    for (var item in arryTargetCapAttrib) {
        var targetCapId = arryTargetCapAttrib[item].targetCapId;
        var targetfd = arryTargetCapAttrib[item].targetFeeInfo;

        var targetfeeSeq_L = new Array();    // invoicing fees
        var targetpaymentPeriod_L = new Array();   // invoicing pay period
        var feeSeqAndPeriodArray = new Array(); //return values for fees and period after added

        var amtAgentCharge = parseFloat(parseFloat(targetfd.feeUnit) * parseFloat(targetfd.formula));
        var cmnsPerc = GetCommissionByUser(targetfd.Code3commission + "", pSalesAgentInfoArray);
        if (cmnsPerc > 0) {
            var amtCommission = cmnsPerc == 0 ? 0 : (cmnsPerc * amtAgentCharge) / 100;
            amtCommission = (Math.round(amtCommission * 100) / 100);
            amtAgentCharge -= amtCommission;
            feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq("AGENT_CHARGE", targetfd.feeschedule, targetfd.version, "FINAL", amtAgentCharge, "Y", targetCapId)

            targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
            targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);

            feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq("COMMISSION", targetfd.feeschedule, targetfd.version, "FINAL", amtCommission, "Y", targetCapId)
            targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
            targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);
        } else {
            feeSeqAndPeriodArray = addFeeWithVersionAndReturnfeeSeq(targetfd.feeCode, targetfd.feeschedule, targetfd.version, "FINAL", targetfd.feeUnit, "Y", targetCapId)
            targetfeeSeq_L.push(feeSeqAndPeriodArray[0]);
            targetpaymentPeriod_L.push(feeSeqAndPeriodArray[1]);
        }
        createInvoice(targetfeeSeq_L, targetpaymentPeriod_L, targetCapId);

        balanceDue = parseFloat(parseFloat(targetfd.feeUnit) * parseFloat(targetfd.formula));

        //No need to check in dec case
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
function GenerateDocumentNumber(currentID) {
    logDebug("ENTER: GenerateDocumentNumber");

    var agentId = null;
    if (arguments.length > 1) agentId = arguments[1];

    if (agentId == null) {
        if (salesAgentInfoArray != null) {
            agentId = salesAgentInfoArray["Agent Id"];
        }
    }

    if (agentId == null) {
        agentId = '9999'; //Default for Citizen
    }

    logDebug("EXIT: GenerateDocumentNumber");

    return (agentId + currentID);
}
function updateDocumentNumber(altID) {
    logDebug("ENTER: updateDocumentNumber");
    var itemCap = capId;
    if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

    var uResult = aa.cap.updateCapAltID(itemCap, altID);
    if (uResult.getSuccess()) {
        //Do nothing
    }
    else {
        logDebug("**WARNING: updating cap alt id :  " + uResult.getErrorMessage());
    }

    logDebug("EXIT: updateDocumentNumber to " + altID);
}

function activateTaskForRec(wfstr) // optional process name
{
    var useProcess = false;
    var processName = "";
    if (arguments.length == 2) {
        processName = arguments[1]; // subprocess
        useProcess = true;
    }

    var itemCap = capId;
    if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

    var workflowResult = aa.workflow.getTasks(capId);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

    for (i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();

            if (useProcess)
                aa.workflow.adjustTask(itemCap, stepnumber, processID, "Y", "N", null, null)
            else
                aa.workflow.adjustTask(itemCap, stepnumber, "Y", "N", null, null)

            logMessage("Activating Workflow Task: " + wfstr);
            logDebug("Activating Workflow Task: " + wfstr);
        }
    }
}

function closeTaskForRec(wfstr, wfstat, wfcomment, wfnote) // optional process name, cap id
{
    var useProcess = false;
    var processName = "";
    if (arguments.length > 4) {
        if (arguments[4] != "") {
            processName = arguments[4]; // subprocess
            useProcess = true;
        }
    }
    var itemCap = capId;
    if (arguments.length == 6) itemCap = arguments[5]; // use cap ID specified in args

    var workflowResult = aa.workflow.getTasks(itemCap);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

    if (!wfstat) wfstat = "NA";

    for (i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var dispositionDate = aa.date.getCurrentDate();
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();
            if (useProcess)
                aa.workflow.handleDisposition(itemCap, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");
            else
                aa.workflow.handleDisposition(itemCap, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");
            //logMessage("Closing Workflow Task " + wfstr + " with status " + wfstat);
            logDebug("Closing Workflow Task " + wfstr + " with status " + wfstat);
        }
    }
}


/*------------------------------------------------------------------------------------------------------/
| The FP4 release includes an updated version of the JavaScript interpreter which allow us to use try/catch blocks.   
/------------------------------------------------------------------------------------------------------*/
function doStandardChoiceActions(stdChoiceEntry, doExecution, docIndent) {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    var lastEvalTrue = false;
    stopBranch = false;  // must be global scope

    logDebug("Executing (via override function): " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")

    var pairObjArray = getScriptAction(stdChoiceEntry);
    if (!doExecution) docWrite(stdChoiceEntry, true, docIndent);
    for (xx in pairObjArray) {
        doObj = pairObjArray[xx];
        if (doExecution) {
            if (doObj.enabled) {

                if (stopBranch) {
                    stopBranch = false;
                    break;
                }

                logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Criteria : " + doObj.cri, 2)

                try {

                    if (eval(token(doObj.cri)) || (lastEvalTrue && doObj.continuation)) {
                        logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Action : " + doObj.act, 2)

                        eval(token(doObj.act));
                        lastEvalTrue = true;
                    }
                    else {
                        if (doObj.elseact) {
                            logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Else : " + doObj.elseact, 2)
                            eval(token(doObj.elseact));
                        }
                        lastEvalTrue = false;
                    }
                }
                catch (err) {
                    showDebug = 3;
                    logDebug("**ERROR An error occured in the following standard choice " + stdChoiceEntry + "#" + doObj.ID + "  Error:  " + err.message);
                }
            }
        }
        else // just document
        {
            docWrite("|  ", false, docIndent);
            var disableString = "";
            if (!doObj.enabled) disableString = "<DISABLED>";

            if (doObj.elseact)
                docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act + " ^ " + doObj.elseact, false, docIndent);
            else
                docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act, false, docIndent);

            for (yy in doObj.branch) {
                doStandardChoiceActions(doObj.branch[yy], false, docIndent + 1);
            }
        }
    } // next sAction
    if (!doExecution) docWrite(null, true, docIndent);
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    logDebug("Finished: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")
}

function getCapIDString() {
    if (capID != null) {
        return capID.getCapID().toString();
    }
    else {
        return "";
    }
}

function getOutput(result, object) {
    if (result.getSuccess()) {
        return result.getOutput();
    }
    else {
        logError("ERROR: Failed to get " + object + ": " + result.getErrorMessage());
        return null;
    }
}

function logError(err) {
    logDebug("**" + err);
}

function getCapId(recordNum) {
    var getCapResult = aa.cap.getCapID(recordNum);

    if (getCapResult.getSuccess()) {
        return getCapResult.getOutput();
    } else {
        return null;
    }
}

function getCapIdBycapIDString(capIDString) {
    var capID;
    if (capIDString) {
        var capIDArray = capIDString.split("-");
        if (capIDArray.length == 3) {
            var capIDResult = aa.cap.getCapID(capIDArray[0], capIDArray[1], capIDArray[2]);
            if (capIDResult.getSuccess()) {
                capID = capIDResult.getOutput();
            }
        }
    }
    return capID;
}

function editLookupAuditStatus(stdChoice, stdValue, stdAuditStaus) {
    //check if stdChoice and stdValue already exist; if they do, update;
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
    if (bizDomScriptResult.getSuccess()) {
        bds = bizDomScriptResult.getOutput();

        var bd = bds.getBizDomain()
        bd.setAuditStatus(stdAuditStaus);
        var editResult = aa.bizDomain.editBizDomain(bd)

        if (editResult.getSuccess())
            logDebug("Successfully edited Std Choice Audit Status(" + stdChoice + "," + stdValue + ") = " + stdAuditStaus);
        else
            logDebug("**WARNING editing Std Choice  Audit Statu" + editResult.getErrorMessage());
    }
}
function isRevocationTrapping(contactCondArray) {
    return isRevocation('Trapping Revocation', contactCondArray);
}
function isRevocationHunting(contactCondArray) {
    return isRevocation('Hunting Revocation', contactCondArray);
}
function isRevocationFishing(contactCondArray) {
    return isRevocation('Fishing Revocation', contactCondArray);
}
function isRevocation(RrevocationType, contactCondArray) {
    var isRevoked = false;
    var now = new Date();
    for (var conCond in contactCondArray) {
        var r = contactCondArray[conCond];
        if (r.description == RrevocationType && r.type == 'Revocation') {
            //if (now >= r.effiectDate && now <= r.expireDate) {
            isRevoked = true;
            break;
            //}
        }
    }
    return isRevoked;
}
function isSuspension(contactCondArray) {
    var isSuspension = false;
    var now = new Date();
    for (var conCond in contactCondArray) {
        var r = contactCondArray[conCond];
        if (r.description == "Suspension of Privileges" && r.type == 'Suspension') {
            //if (now >= r.effiectDate && now <= r.expireDate) {
            isSuspension = true;
            break;
            //}
        }
    }
    return isSuspension;
}
function isMarkForAgedInFulfillment(contactCondArray) {
    var cnd = new COND_FULLFILLMENT();
    return isFulfillmentCond(cnd.Condition_VerifyAgedIn, contactCondArray);
}
function isMarkForNeedHutEdFulfillment(contactCondArray) {
    var cnd = new COND_FULLFILLMENT();
    return isFulfillmentCond(cnd.Condition_NeedHuntingEd, contactCondArray);
}
function isFulfillmentCond(FulfillmentType, contactCondArray) {
    var isNeedFulfillment = false;
    var now = new Date();
    for (var conCond in contactCondArray) {
        var r = contactCondArray[conCond];
        if (r.description == FulfillmentType && r.type == 'Revocation') {
            //if (now >= r.effiectDate && now <= r.expireDate) {
            isNeedFulfillment = true;
            break;
            //}
        }
    }
    return isNeedFulfillment;
}
function getContactCondutions(peopleSequenceNumber) {
    var lang = "ar_AE";

    var conCondResult = aa.commonCondition.getCommonConditions("CONTACT", peopleSequenceNumber);
    var resultArray = new Array();

    var conCondArray = new Array();
    if (!conCondResult.getSuccess()) {
        logDebug("**WARNING: getting contact Conditions : " + licCondResult.getErrorMessage());
    }
    else {
        conCondArray = conCondResult.getOutput();
    }

    for (var thisConCond in conCondArray) {
        var thisCond = conCondArray[thisConCond];
        var cType = thisCond.getConditionType();
        var cStatus = thisCond.getConditionStatus();
        var cDesc = thisCond.getConditionDescription();
        var cImpact = thisCond.getImpactCode();
        var cComment = thisCond.getConditionComment();
        if (cType == null)
            cType = " ";
        if (cStatus == null)
            cStatus = " ";
        if (cDesc == null)
            cDesc = " ";
        if (cImpact == null)
            cImpact = " ";

        var r = new condMatchObjEx();
        r.objType = "Contact";
        r.contactObj = null;  //conArray[thisCon];
        r.status = cStatus;
        r.type = cType;
        r.impact = cImpact;
        r.description = cDesc;
        r.comment = cComment;
        if (thisCond.getEffectDate() != null) {
            r.effiectDate = new Date(thisCond.getEffectDate().getYear(), thisCond.getEffectDate().getMonth() - 1, thisCond.getEffectDate().getDayOfMonth());
            r.expireDate = new Date(thisCond.getExpireDate().getYear(), thisCond.getExpireDate().getMonth() - 1, thisCond.getExpireDate().getDayOfMonth());
        }

        var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

        r.arObject = langCond;
        r.arDescription = langCond.getResConditionDescription();
        r.arComment = langCond.getResConditionComment();

        resultArray.push(r);
    }
    return resultArray;
}
function condMatchObjEx() {
    this.objType = null;
    this.object = null;
    this.contactObj = null;
    this.addressObj = null;
    this.licenseObj = null;
    this.parcelObj = null;
    this.status = null;
    this.type = null;
    this.impact = null;
    this.description = null;
    this.comment = null;
    this.arObject = null;
    this.arDescription = null;
    this.arComment = null;
    this.effiectDate = null;
    this.expireDate = null;
}
function attachAgent(uObj) {
    if (uObj.authAgentPeopleSequenceNumber != null) {
        var pmpeople = getOutput(aa.people.getPeople(uObj.authAgentPeopleSequenceNumber), "");

        //Create Cap Contact 
        var result = aa.people.createCapContactWithRefPeopleModel(capId, pmpeople);
        if (result.getSuccess()) {
            logDebug("Contact successfully added to CAP.");
        } else {
            logDebug("**ERROR: Failed to get Contact Nbr: " + result.getErrorMessage());
        }
    }
}
function attachedContacts() {
    var peopleSequenceNumber = null;
    if (arguments.length == 1) peopleSequenceNumber = arguments[0];

    var isForAnonymous = false;
    if (peopleSequenceNumber == null) {
        if (publicUserID == 'PUBLICUSER0') {
            isForAnonymous = true;
        } else {
            var uObj = new USEROBJ(publicUserID);
            peopleSequenceNumber = uObj.peopleSequenceNumber;
            isForAnonymous = uObj.acctType != "CITIZEN";
        }

        if (isForAnonymous) {
            var firstname = 'Anonymous';
            var lastname = 'Anonymous';
            var resultPeopleArray = getPeoplesByFnameLnameDOB(lastname, firstname, null);
            for (var cp in resultPeopleArray) {
                peopleSequenceNumber = resultPeopleArray[cp].getContactSeqNumber();
                break;
            }
        }
    }
    if (peopleSequenceNumber != null) {
        var pmpeople = getOutput(aa.people.getPeople(peopleSequenceNumber), "");

        //Create Cap Contact 
        var result = aa.people.createCapContactWithRefPeopleModel(capId, pmpeople);
        if (result.getSuccess()) {
            logDebug("Contact successfully added to CAP.");
        } else {
            logDebug("**ERROR: Failed to get Contact Nbr: " + result.getErrorMessage());
        }
    }
}

function getPeoplesByFnameLnameDOB(lastname, firstname, birthDate) {
    var peopResult = null;
    var vError = null;
    try {
        var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
        qryPeople.setBirthDate(birthDate)
        qryPeople.setFirstName(firstname)
        qryPeople.setLastName(lastname)

        var r = aa.people.getPeopleByPeopleModel(qryPeople);
        if (r.getSuccess()) {
            peopResult = r.getOutput();
            if (peopResult.length == 0) {
                logDebug("Searched for REF contact, no matches found, returing null");
                peopResult = null
            }
        }
    }
    catch (vError) {
        logDebug("Runtime error occurred: " + vError);
    }
    return peopResult;
}

function isValidBuyRecord(pStep) {
    logDebug("ENTER: isValidBuyRecord");
    var retMsg = '';
    var msg = '';
    //Calller ACA ONSUBMIT BEFORE TBL UPDATE
    if (pStep == 'Step1') {
        msg = verifyMilitaryServiceType();
        if (msg != '') {
            retMsg += msg;
        }
        msg = verifySportsmanEd();
        if (msg != '') {
            retMsg += msg;
        }
        msg = verifyPreviousLicense();
        if (msg != '') {
            retMsg += msg;
        }
        msg = verifyAnnulaDisability();
        if (msg != '') {
            retMsg += msg;
        }
    }

    //Calller ACA ONSUBMIT BEFORE SALESSELECT
    if (pStep == 'Step3') {
        msg = verifyAnySalesSelect();
        retMsg += msg;

        var isValid = true;
        if (!isValidIntegerNumber(AInfo["Quantity Trail Supporter Patch"])) {
            retMsg += 'Please enter valid integer number for Quantity Trail Supporter Patch.';
            retMsg += "<Br />";
        }
        if (!isValidIntegerNumber(AInfo["Quantity Habitat/Access Stamp"])) {
            retMsg += 'Please enter valid integer number for Quantity Habitat/Access Stamp.';
            retMsg += "<Br />";
        }
        if (!isValidIntegerNumber(AInfo["Quantity Venison Donation"])) {
            retMsg += 'Please enter valid integer number for Quantity Venison Donation.';
            retMsg += "<Br />";
        }
        if (!isValidIntegerNumber(AInfo["Quantity Conservation Patron"])) {
            retMsg += 'Please enter valid integer number for Quantity Conservation Patron.';
            retMsg += "<Br />";
        }
        if (!isValidIntegerNumber(AInfo["Quantity Conservation Fund"])) {
            retMsg += 'Please enter valid integer number for Quantity Conservation Fund.';
            retMsg += "<Br />";
        }
        msg = validateFishingdates();
        retMsg += msg;

        msg = verifyDMPinfo();
        if (msg != '') {
            retMsg += msg;
        }

        msg = verifyLandOwnerInfo();
        if (msg != '') {
            retMsg += msg;
        }
    }

    return retMsg;
    logDebug("EXIT: isValidBuyRecord");
}
function validateFishingdates() {
    var retMsg = '';
    var msg = '';

    var f = new form_OBJECT(GS2_EXPR, OPTZ_TYPE_CTRC);
    f.Year = AInfo["License Year"];
    f.SetActiveHoldingsInfo(AInfo["A_ActiveHoldings"]);

    if (isNull(AInfo["Effective Date One Day Fishing"], '') != '') {
        if (dateDiff(AInfo["Effective Date One Day Fishing"], new Date()) >= 1) {
            retMsg += "One Day Fishing Effective Date cannot be prior to today's date.";
            retMsg += "<Br />";
        } else {
            if (f.isAfterSwitchDate()) {
                msg = f.isActiveFishingLic(isNull(AInfo["Effective Date One Day Fishing"], ''), '1 Day');
                if (msg != '') {
                    retMsg += msg;
                    retMsg += "<Br />";
                }
            }
        }
    }
    if (isNull(AInfo["Effective Date Seven Day Fishing"], '') != '') {
        if (dateDiff(AInfo["Effective Date Seven Day Fishing"], new Date()) >= 1) {
            retMsg += "Seven Day Fishing Effective Date cannot be prior to today's date.";
            retMsg += "<Br />";
        } else {
            if (f.isAfterSwitchDate()) {
                msg = f.isActiveFishingLic(isNull(AInfo["Effective Date Seven Day Fishing"], ''), '7 Day');
                if (msg != '') {
                    retMsg += msg;
                    retMsg += "<Br />";
                }
            }
        }
    }
    if (isNull(AInfo["Effective Date Fishing"], '') != '') {
        if (f.isAfterSwitchDate()) {
            if (dateDiff(AInfo["Effective Date Fishing"], new Date()) >= 1) {
                retMsg += "Fishing Effective Date cannot be prior to today's date.";
                retMsg += "<Br />";
            } else {
                if (f.isAfterSwitchDate()) {
                    msg = f.isActiveFishingLic(isNull(AInfo["Effective Date Fishing"], ''), '');
                    if (msg != '') {
                        retMsg += msg;
                        retMsg += "<Br />";
                    }
                }
            }
        }
    }
    if (isNull(AInfo["Effective Date Marine"], '') != '') {
        if (f.isAfterSwitchDate()) {
            if (dateDiff(AInfo["Effective Date Marine"], new Date()) >= 1) {
                retMsg += "Marine Effective Date cannot be prior to today's date.";
                retMsg += "<Br />";
            } else {
                if (f.isAfterSwitchDate()) {
                    msg = f.isActiveFishingLic(isNull(AInfo["Effective Date Marine"], ''), '');
                    if (msg != '') {
                        retMsg += msg;
                        retMsg += "<Br />";
                    }
                }
            }
        }
    }

    return retMsg;

}
function USEROBJ(publicUserID) {
    this.publicUserID = publicUserID;
    this.userId = null;
    this.authAgentID = null;
    this.acctType = null;
    this.userModel = null;
    this.peopleSequenceNumber = null;
    this.authAgentPeopleSequenceNumber = null;

    this.setPublicUserInfo = function () {
        try {
            var pUserID = this.publicUserID;
            if (arguments.length == 1) pUserID = arguments[0];

            if (pUserID != null) {
                this.userId = aa.person.getUser(pUserID).getOutput().getFirstName();
                this.userModel = this.getUserModel();
                this.setUserModelAttributes(this.userModel);
            }
        }
        catch (err) {
            logDebug("Exception in setPublicUserInfo:" + err.message);
        }
    }
    this.setUserModelAttributes = function () {
        var userModel = this.userModel;
        if (arguments.length == 1) userModel = arguments[0];
        if (userModel != null) {
            this.acctType = userModel.getAccountType();
            this.userSeqNum = userModel.getUserSeqNum();
            this.authAgentID = userModel.getAuthAgentID();
            this.peopleSequenceNumber = this.getPeopleSeqNum(this.userSeqNum);
            this.authAgentPeopleSequenceNumber = this.getAuthAgentPeopleSeqNum();
        }
    }
    this.getAuthAgentPeopleSeqNum = function () {
        var peopleSequenceNumber = null;
        try {
            if (this.authAgentID != null) {
                var userModel = this.getUserModel(this.authAgentID);
                if (userModel != null) {
                    peopleSequenceNumber = this.getPeopleSeqNum(userModel.getUserSeqNum());
                }
            } else {
                if (this.acctType != "CITIZEN") {
                    peopleSequenceNumber = this.peopleSequenceNumber;
                }
            }
        }
        catch (err) {
            logDebug("Exception in getAuthAgentPeopleSeqNum:" + err.message);
        }

        return peopleSequenceNumber;
    }

    this.getUserModel = function () {
        var suserId = this.userId;
        if (arguments.length == 1) suserId = arguments[0];

        var userModel = null;
        var getUserResult = aa.publicUser.getPublicUserByUserId(suserId);
        if (getUserResult.getSuccess()) {
            userModel = getUserResult.getOutput();
            if (userModel == null) {
                logDebug("**WARNING: User Id Not fond. " + suserId + " :  " + getUserResult.getErrorMessage());
            }
        }
        else {
            logDebug("**WARNING: User Id Not fond. " + suserId + " :  " + getUserResult.getErrorMessage());
        }
        return userModel;
    }
    this.getPeopleSeqNum = function (userSeqNum) {
        var peopleSequenceNumber = null;
        try {
            var userSeqNumList = aa.util.newArrayList();
            userSeqNumList.add(userSeqNum);

            var ccb = aa.proxyInvoker.newInstance("com.accela.pa.people.ContractorPeopleBusiness").getOutput();
            var t = ccb.getContractorPeopleListByUserSeqNBR(aa.getServiceProviderCode(), userSeqNumList);
            if (t.size() > 0) {
                var aC = t.toArray();
                for (var x in aC) {
                    peopleSequenceNumber = aC[x].getContactSeqNumber();
                }
            }
        }
        catch (err) {
            logDebug("Exception in getPeopleSeqNum:" + err.message);
        }
        return peopleSequenceNumber;
    }
    this.setPublicUserInfo();
}
function getAgentInfo(publicUserID) {
    var returnArray = new Array(); 
    try {
        var uObj;
        if (arguments.length > 1) {
            uObj = arguments[1];
        } else {
            uObj = new USEROBJ(publicUserID);
        }
        if (uObj.authAgentPeopleSequenceNumber != null) {
            returnArray = getAgentInfoByPeopleSeqNum(uObj.authAgentPeopleSequenceNumber);
        }

    }
    catch (err) {
        logDebug("Exception in getAgentInfo:" + err.message);
    }
    return returnArray;
}
function getAgentInfoByPeopleSeqNum(peopleSequenceNumber) {
    var returnArray = new Array(); 

    var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
    var subGroupArray = getTemplateValueByFormArrays(peopleModel.getTemplate(), null, null);
    //GetAllASI(subGroupArray);
    for (var subGroupName in subGroupArray) {
        var fieldArray = subGroupArray[subGroupName];
        for (var fld in fieldArray) {
            returnArray[fld] = fieldArray[fld];
        }
    }
    return returnArray;
}

/*------------------------------------------------------------------------------------------------------/
| ContactObj
/------------------------------------------------------------------------------------------------------*/
function getContactObj(itemCap, typeToLoad) {
    // returning the first match on contact type
    var capContactArray = null;
    var cArray = new Array();

    var capContactArray;
    if (itemCap.getClass() == "com.accela.aa.aamain.cap.CapModel") { // page flow script 
        capContactArray = cap.getContactsGroup().toArray();
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            capContactArray = capContactResult.getOutput();
        }
    }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (capContactArray[yy].getPeople().contactType.toUpperCase().equals(typeToLoad.toUpperCase())) {
                logDebug("getContactObj returned the first contact of type " + typeToLoad + " on record " + itemCap.getCustomID());
                return new contactObj(capContactArray[yy]);
            }
        }
    }

    logDebug("getContactObj could not find a contact of type " + typeToLoad + " on record " + itemCap.getCustomID());
    return false;

}

function getContactObjs(itemCap) // optional typeToLoad, optional return only one instead of Array?
{
    var typesToLoad = false;
    if (arguments.length == 2) typesToLoad = arguments[1];
    var capContactArray = null;
    var cArray = new Array();

    var capContactArray;
    if (itemCap.getClass() == "com.accela.aa.aamain.cap.CapModel") { // page flow script 
        capContactArray = cap.getContactsGroup().toArray();
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            capContactArray = capContactResult.getOutput();
        }
    }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (!typesToLoad || exists(capContactArray[yy].getPeople().contactType, typesToLoad)) {
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }

    logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
    return cArray;

}

function contactObj(ccsm) {

    this.people = null;         // for access to the underlying data
    this.capContact = null;     // for access to the underlying data
    this.capContactScript = null;   // for access to the underlying data
    this.capId = null;
    this.type = null;
    this.seqNumber = null;
    this.refSeqNumber = null;
    this.asiObj = null;
    this.asi = new Array();    // associative array of attributes
    this.primary = null;
    this.relation = null;
    this.addresses = null;  // array of addresses

    this.capContactScript = ccsm;
    if (ccsm) {
        if (ccsm.getCapContactModel == undefined) {  // page flow
            this.people = this.capContactScript.getPeople();
            this.refSeqNumber = this.capContactScript.getRefContactNumber();
        }
        else {
            this.capContact = ccsm.getCapContactModel();
            this.people = this.capContact.getPeople();
            this.refSeqNumber = this.capContact.getRefContactNumber();
        }

        this.asiObj = this.people.getAttributes().toArray();
        for (var xx1 in this.asiObj) this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1].attributeValue;
        //this.primary = this.capContact.getPrimaryFlag().equals("Y");
        this.primary = this.capContact.getPrimaryFlag() && this.capContact.getPrimaryFlag().equals("Y");
        this.relation = this.people.relation;
        this.seqNumber = this.people.contactSeqNumber;
        this.type = this.people.getContactType();
        this.capId = this.capContactScript.getCapID();
        var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);
        if (contactAddressrs.getSuccess()) {
            this.addresses = contactAddressrs.getOutput();
            var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
            this.people.setContactAddressList(contactAddressModelArr);
        }
    }
    this.toString = function () { return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ") #ofAddr=" + this.addresses.length + " primary=" + this.primary; }

    this.getEmailTemplateParams = function (params) {
        addParameter(params, "$$LastName$$", this.people.getLastName());
        addParameter(params, "$$FirstName$$", this.people.getFirstName());
        addParameter(params, "$$MiddleName$$", this.people.getMiddleName());
        addParameter(params, "$$BusinesName$$", this.people.getBusinessName());
        addParameter(params, "$$ContactSeqNumber$$", this.seqNumber);
        addParameter(params, "$$ContactType$$", this.type);
        addParameter(params, "$$Relation$$", this.relation);
        addParameter(params, "$$Phone1$$", this.people.getPhone1());
        addParameter(params, "$$Phone2$$", this.people.getPhone2());
        addParameter(params, "$$Email$$", this.people.getEmail());
        addParameter(params, "$$AddressLine1$$", this.people.getCompactAddress().getAddressLine1());
        addParameter(params, "$$AddressLine2$$", this.people.getCompactAddress().getAddressLine2());
        addParameter(params, "$$City$$", this.people.getCompactAddress().getCity());
        addParameter(params, "$$State$$", this.people.getCompactAddress().getState());
        addParameter(params, "$$Zip$$", this.people.getCompactAddress().getZip());
        addParameter(params, "$$Fax$$", this.people.getFax());
        addParameter(params, "$$Country$$", this.people.getCompactAddress().getCountry());
        addParameter(params, "$$FullName$$", this.people.getFullName());
        return params;
    }

    this.replace = function (targetCapId) { // send to another record, optional new contact type

        var newType = this.type;
        if (arguments.length == 2) newType = arguments[1];
        //2. Get people with target CAPID.
        var targetPeoples = getContactObjs(targetCapId, [String(newType)]);
        //3. Check to see which people is matched in both source and target.
        for (var loopk in targetPeoples) {
            var targetContact = targetPeoples[loopk];
            if (this.equals(targetPeoples[loopk])) {
                targetContact.people.setContactType(newType);
                aa.people.copyCapContactModel(this.capContact, targetContact.capContact);
                targetContact.people.setContactAddressList(this.people.getContactAddressList());
                overwriteResult = aa.people.editCapContactWithAttribute(targetContact.capContact);
                if (overwriteResult.getSuccess())
                    logDebug("overwrite contact " + targetContact + " with " + this);
                else
                    logDebug("error overwriting contact : " + this + " : " + overwriteResult.getErrorMessage());
                return true;
            }
        }

        var tmpCapId = this.capContact.getCapID();
        var tmpType = this.type;
        this.people.setContactType(newType);
        this.capContact.setCapID(targetCapId);
        createResult = aa.people.createCapContactWithAttribute(this.capContact);
        if (createResult.getSuccess())
            logDebug("(contactObj) contact created : " + this);
        else
            logDebug("(contactObj) error creating contact : " + this + " : " + createResult.getErrorMessage());
        this.capContact.setCapID(tmpCapId);
        this.type = tmpType;
        return true;
    }

    this.equals = function (t) {
        if (t == null) return false;
        if (!String(this.people.type).equals(String(t.people.type))) { return false; }
        if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) { return false; }
        if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) { return false; }
        if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) { return false; }
        return true;
    }

    this.saveBase = function () {
        // set the values we store outside of the models.
        this.people.setContactType(this.type);
        this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
        this.people.setRelation(this.relation);
        saveResult = aa.people.editCapContact(this.capContact);
        if (saveResult.getSuccess())
            logDebug("(contactObj) base contact saved : " + this);
        else
            logDebug("(contactObj) error saving base contact : " + this + " : " + saveResult.getErrorMessage());
    }

    this.save = function () {
        // set the values we store outside of the models
        this.people.setContactType(this.type);
        this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
        this.people.setRelation(this.relation);
        saveResult = aa.people.editCapContactWithAttribute(this.capContact);
        if (saveResult.getSuccess())
            logDebug("(contactObj) contact saved : " + this);
        else
            logDebug("(contactObj) error saving contact : " + this + " : " + saveResult.getErrorMessage());
    }

    this.remove = function () {
        var removeResult = aa.people.removeCapContact(this.capId, this.seqNumber)
        if (removeResult.getSuccess())
            logDebug("(contactObj) contact removed : " + this + " from record " + this.capId.getCustomID());
        else
            logDebug("(contactObj) error removing contact : " + this + " : from record " + this.capId.getCustomID() + " : " + removeResult.getErrorMessage());
    }

    this.createPublicUser = function () {

        if (!this.capContact.getEmail())
        { logDebug("(contactObj) Couldn't create public user for : " + this + ", no email address"); return false; }

        if (String(this.people.getContactTypeFlag()).equals("organization"))
        { logDebug("(contactObj) Couldn't create public user for " + this + ", the contact is an organization"); return false; }

        // check to see if public user exists already based on email address
        var getUserResult = aa.publicUser.getPublicUserByEmail(this.capContact.getEmail())
        if (getUserResult.getSuccess() && getUserResult.getOutput()) {
            userModel = getUserResult.getOutput();
            logDebug("(contactObj) createPublicUserFromContact: Found an existing public user: " + userModel.getUserID());
        }

        if (!userModel) // create one
        {
            logDebug("(contactObj) CreatePublicUserFromContact: creating new user based on email address: " + this.capContact.getEmail());
            var publicUser = aa.publicUser.getPublicUserModel();
            publicUser.setFirstName(this.capContact.getFirstName());
            publicUser.setLastName(this.capContact.getLastName());
            publicUser.setEmail(this.capContact.getEmail());
            publicUser.setUserID(this.capContact.getEmail());
            publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
            publicUser.setAuditID("PublicUser");
            publicUser.setAuditStatus("A");
            publicUser.setCellPhone(this.people.getPhone2());

            var result = aa.publicUser.createPublicUser(publicUser);
            if (result.getSuccess()) {

                logDebug("(contactObj) Created public user " + this.capContact.getEmail() + "  sucessfully.");
                var userSeqNum = result.getOutput();
                var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

                // create for agency
                aa.publicUser.createPublicUserForAgency(userModel);

                // activate for agency
                var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
                userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(), userSeqNum, "ADMIN");

                // reset password
                var resetPasswordResult = aa.publicUser.resetPassword(this.capContact.getEmail());
                if (resetPasswordResult.getSuccess()) {
                    var resetPassword = resetPasswordResult.getOutput();
                    userModel.setPassword(resetPassword);
                    logDebug("(contactObj) Reset password for " + this.capContact.getEmail() + "  sucessfully.");
                } else {
                    logDebug("(contactObj **WARNING: Reset password for  " + this.capContact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
                }

                // send Activate email
                aa.publicUser.sendActivateEmail(userModel, true, true);

                // send another email
                aa.publicUser.sendPasswordEmail(userModel);
            }
            else {
                logDebug("(contactObj) **WARNIJNG creating public user " + this.capContact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
            }
        }

        //  Now that we have a public user let's connect to the reference contact       

        if (this.refSeqNumber) {
            logDebug("(contactObj) CreatePublicUserFromContact: Linking this public user with reference contact : " + this.refSeqNumber);
            aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), this.refSeqNumber);
        }


        return userModel; // send back the new or existing public user
    }

    this.getCaps = function () { // option record type filter


        if (this.refSeqNumber) {
            aa.print("ref seq : " + this.refSeqNumber);
            var capTypes = null;
            var resultArray = new Array();
            if (arguments.length == 1) capTypes = arguments[0];

            var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
            var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
            pm.setServiceProviderCode(aa.getServiceProviderCode());
            pm.setContactSeqNumber(this.refSeqNumber);

            var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

            for (var j in cList) {
                var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
                if (capTypes && appMatch(capTypes, thisCapId)) {
                    resultArray.push(thisCapId)
                }
            }
        }

        return resultArray;
    }
}
function convertContactAddressModelArr(contactAddressScriptModelArr) {
    var contactAddressModelArr = null;
    if (contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0) {
        contactAddressModelArr = aa.util.newArrayList();
        for (loopk in contactAddressScriptModelArr) {
            contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());
        }
    }
    return contactAddressModelArr;
}

/*------------------------------------------------------------------------------------------------------/
|  ContactObj (END)
/------------------------------------------------------------------------------------------------------*/
/**
* Create Record Type instance.
*/
function getRecordTypeInstance(group, type, subType, category) {
    var capTypeModelResult = aa.cap.getCapTypeModel();

    var capTypeModel = capTypeModelResult.getOutput();
    capTypeModel.setGroup(group);
    capTypeModel.setType(type);
    capTypeModel.setSubType(subType);
    capTypeModel.setCategory(category);

    return capTypeModel;
}

/*------------------------------------------------------------------------------------------------------/
|   Create set. Last update: 6/18/2013
/------------------------------------------------------------------------------------------------------*/
function createSet(setName, setDescription, setType, setStatus, setComment, setStatusComment) {

    var setScript = aa.set.getSetHeaderScriptModel().getOutput();
    setScript.setSetID(setName);
    setScript.setSetTitle(setDescription);
    setScript.setSetComment(setComment);
    setScript.setSetStatus(setStatus);
    setScript.setSetStatusComment(setStatusComment);
    setScript.setRecordSetType(setType);
    setScript.setServiceProviderCode(aa.getServiceProviderCode());
    setScript.setAuditDate(aa.date.getCurrentDate());
    setScript.setAuditID(currentUserID);

    var setCreateResult = aa.set.createSetHeader(setScript);

    return setCreateResult.getSuccess();
}

/*------------------------------------------------------------------------------------------------------/
|   capSet object. Last update: 10/18/2013
/------------------------------------------------------------------------------------------------------*/

function capSet(desiredSetId)
    {
    this.refresh = function()
        {

        var theSet = aa.set.getSetByPK(this.id).getOutput();
		this.status = theSet.getSetStatus();
        this.setId = theSet.getSetID();
        this.name = theSet.getSetTitle();
        this.comment = theSet.getSetComment();
		this.model = theSet.getSetHeaderModel();
		this.statusComment = theSet.getSetStatusComment();

        var memberResult = aa.set.getCAPSetMembersByPK(this.id);

        if (!memberResult.getSuccess()) { logDebug("**WARNING** error retrieving set members " + memberResult.getErrorMessage()); }
        else
            {
            this.members = memberResult.getOutput().toArray();
            this.size = this.members.length;
            if (this.members.length > 0) this.empty = false;
            logDebug("capSet: loaded set " + this.id + " of status " + this.status + " with " + this.size + " records");
            }
        }
        
    this.add = function(addCapId) 
        {
        var setMemberStatus;
        if (arguments.length == 2)  setMemberStatus = arguments[1]; 
            
        var addResult = aa.set.add(this.id,addCapId);
		
		if (setMemberStatus) this.updateMemberStatus(capId,setMemberStatus);
		
        }
    
	this.updateMemberStatus = function(addCapId,setMemberStatus) {
	
		// Update a SetMember Status for a Record in SetMember List.

        var setUpdateScript = aa.set.getSetDetailsScriptModel().getOutput();
        setUpdateScript.setSetID(this.id);          //Set ID
        setUpdateScript.setID1(addCapId.getID1());
        setUpdateScript.setID2(addCapId.getID2());
        setUpdateScript.setID3(addCapId.getID3());
        setUpdateScript.setSetMemberStatus(setMemberStatus); 
        setUpdateScript.setSetMemberStatusDate(aa.date.getCurrentDate());  
        setUpdateScript.setServiceProviderCode(aa.getServiceProviderCode());

        var addResult = aa.set.updateSetMemberStatus(setUpdateScript);
        
        if (!addResult.getSuccess()) 
            { 
            logDebug("**WARNING** error adding record to set " + this.id + " : " + addResult.getErrorMessage() );
            }
        else 
            { 
            logDebug("capSet: updated record " + addCapId + " to status " + setMemberStatus);
            }
	}			
	
	
    this.remove = function(removeCapId) 
        {
        var removeResult = aa.set.removeSetHeadersListByCap(this.id,removeCapId)
        if (!removeResult.getSuccess()) 
            { 
            logDebug("**WARNING** error removing record from set " + this.id + " : " + removeResult.getErrorMessage() );
            }
        else 
            { 
            logDebug("capSet: removed record " + removeCapId + " from set " + this.id);
            }
        }
    
    this.update = function() 
        {
		var sh = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.SetBusiness").getOutput();
		this.model.setSetStatus(this.status)
        this.model.setSetID(this.setId);
        this.model.setSetTitle(this.name);
		this.model.setSetComment(this.comment);
		this.model.setSetStatusComment(this.statusComment);
		this.model.setRecordSetType(this.type);
		
		logDebug("capSet: updating set header information");
		try {
			updateResult = sh.updateSetBySetID(this.model);
			}
		catch(err) {
            logDebug("**WARNING** error updating set header failed " + err.message);
            }

        }
    
    this.id = desiredSetId;
    this.name = desiredSetId;
    this.type = null;
	this.comment = null;
    
	if (arguments.length > 1 && arguments[1]) this.name = arguments[1];
	if (arguments.length > 2 && arguments[2]) this.type = arguments[2];
    if (arguments.length > 3 && arguments[3]) this.comment = arguments[3];
    
    this.size = 0;
    this.empty = true;
    this.members = new Array();
    this.status = "";
	this.statusComment = "";
	this.model = null;
	
    var theSetResult = aa.set.getSetByPK(this.id);
    
    if (theSetResult.getSuccess())
        {
        this.refresh();
        }
        
    else  // add the set
        {
        theSetResult = aa.set.createSet(this.id,this.name,this.type,this.comment);
        if (!theSetResult.getSuccess()) 
            {
            logDebug("**WARNING** error creating set " + this.id + " : " + theSetResult.getErrorMessage);
            }
        else
            {
            logDebug("capSet: Created new set " + this.id + " of type " + this.type); 
            this.refresh();
            }
        }
    }




function createSetbylogic(recordType, name, setType, setComment, setStatus, setStatusComment) {

    var tDate = sysDateMMDDYYYY;
    var flag;
    var setIDForCompleted;
    var id;
    var setResult;
    var result;

    for (var i = 0; ; i++) {
        id = recordType + "_" + tDate + "_" + (i + 1);
        if (name == null) {
            name = id;
        }
        logDebug("Set ID: " + id);
        setResult = aa.set.getSetByPK(id);
        if (setResult.getSuccess()) {
            setResult = setResult.getOutput();
            logDebug("Set Comment: " + setResult.getSetComment());
            if (setResult.getSetComment() == "Processing") //Set exists, status "Pending"
            {
                flag = "P";
                break;
            }
            else if (setResult.getSetComment() == "Initialized") //Set exists, status "Pending"
            {
                flag = "I";
                break;
            }
            else if (setResult.getSetComment() == "Successfully processed") //Set exists, status "Completed"
            {
                setIDForCompleted = setResult.getSetID();
            }
        }
        else  //set does not exist
        {
            flag = "N";
            break;
        }
    }


    if (flag == "P" || flag == "I") {
        //id
        logDebug("Set Exists: " + id);
    }
    else if (flag == "N" && !setIDForCompleted) {
        logDebug("Create new set");
        result = createSet(id, name, setType, setStatus, setComment, setStatusComment);
        logDebug("createSet Result: " + result);
        if (result) {
            setResult = aa.set.getSetByPK(id);
            if (setResult.getSuccess()) {
                setResult = setResult.getOutput();
                logDebug("Result for new set: " + id);
            }
        }
    }
    else if (setIDForCompleted) {
        var tempStr = recordType + "_" + tDate + "_";
        var setNumber = setIDForCompleted.substr(tempStr.length, setIDForCompleted.length());
        setNumber = parseInt(setNumber);
        setNumber = setNumber + 1;
        var newSetId = recordType + "_" + tDate + "_" + setNumber;

        logDebug("New Set ID: " + newSetId);
        id = newSetId;
        if (name == null) {
            name = id;
        }
        result = createSet(id, name, setType, setStatus, setComment, setStatusComment);
        if (result) {
            setResult = aa.set.getSetByPK(newSetId);
            if (setResult.getSuccess()) {
                setResult = setResult.getOutput();
                logDebug("Result for new set: " + id);
            }
        }
    }
    return setResult;
}

//"Completed", "Successfully processed"
function updateSetStatus(setName, setDescription, comment, setStatus, setStatusComment) {
    try {
        var setTest = new capSet(setName, setDescription);
        setTest.status = setStatus;  // update the set header status
        setTest.comment = comment;   // changed the set comment
        setTest.statusComment = setStatusComment; // change the set status comment
        setTest.update();  // commit changes to the set
    }
    catch (err) {
        logDebug("Exception in updateSetStatus:" + err.message);
    }
}

function addCapSetMember(itemCapId, setResult) {
    try {
        var cID = itemCapId.getCustomID();
        var memberCapID = aa.cap.getCapID(cID).getOutput();
        var addResult = aa.set.addCapSetMember((setResult.getSetID()), memberCapID);
    }
    catch (err) {
        logDebug("Exception in addCapSetMember:" + err.message);
    }
}

function getDateCode(ipDate) {
    var fvYear = ipDate.getFullYear().toString();
    var fvMonth = (ipDate.getMonth() + 1).toString();
    var fvDay = ipDate.getDate().toString();
    if (ipDate.getMonth() < 9) fvMonth = "0" + fvMonth;
    if (ipDate.getDate() < 10) fvDay = "0" + fvDay;

    var fvDateCode = fvYear + fvMonth + fvDay;
    return fvDateCode;
}

function getDateString(ipDate) {
    var fvYear = ipDate.getFullYear().toString();
    var fvMonth = (ipDate.getMonth() + 1).toString();
    var fvDay = ipDate.getDate().toString();
    if (ipDate.getMonth() < 9) fvMonth = "0" + fvMonth;
    if (ipDate.getDate() < 10) fvDay = "0" + fvDay;

    var fvDateString = fvMonth + "/" + fvDay + "/" + fvYear;
    return fvDateString;
}

function getParent() {
    // returns the capId object of the parent.  Assumes only one parent!
    //
    var itemcap = capId;
    if (arguments.length == 1) itemcap = arguments[0];
    var getCapResult = aa.cap.getProjectParents(itemcap, 1);
    if (getCapResult.getSuccess()) {
        parentArray = getCapResult.getOutput();
        if (parentArray.length)
            return parentArray[0].getCapID();
        else {
            logDebug("**WARNING: GetParent found no project parent for this application");
            return false;
        }
    }
    else {
        logDebug("**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
        return false;
    }
}
function setLicExpirationStatus(itemCap, newStatus) {
    try {
        //itemCap - license capId
        var licNum = itemCap.getCustomID();
        thisLic = new licenseObject(licNum, itemCap);

        b1ExpResult = aa.expiration.getLicensesByCapID(itemCap);
        if (newStatus != null) {
            thisLic.setStatus(newStatus);
        } else {
            thisLic.setStatus("Active");
        }

        logDebug("Successfully set the expiration status");
    }
    catch (err) {
        logDebug("**WARNING An error occured in setLicExpirationStatus  Error:  " + err.message);
    }
    return true;
}
function setLicExpirationDate(itemCap) {
    try {

        //itemCap - license capId
        //the following are optional parameters
        //calcDateFrom - MM/DD/YYYY - the from date to use in the date calculation
        //dateOverride - MM/DD/YYYY - override the calculation, this date will be used
        //renewalStatus - if other than active override the status

        var licNum = itemCap.getCustomID();

        if (arguments.length == 1) {
            calcDateFrom = 0;
            dateOverride = null;
            renewalStatus = null;
        }
        if (arguments.length == 2) {
            calcDateFrom = arguments[1];
            dateOverride = null;
            renewalStatus = null;
        }

        if (arguments.length == 3) {
            calcDateFrom = arguments[1];
            dateOverride = arguments[2];
            renewalStatus = null;
        }

        if (arguments.length == 4) {
            calcDateFrom = arguments[1];
            dateOverride = arguments[2];
            renewalStatus = arguments[3];
        }

        thisLic = new licenseObject(licNum, itemCap);

        try {
            var tmpNewDate = "";

            b1ExpResult = aa.expiration.getLicensesByCapID(itemCap);
            if (b1ExpResult.getSuccess()) {
                this.b1Exp = b1ExpResult.getOutput();
                //Get expiration details
                var expUnit = this.b1Exp.getExpUnit();
                var expInterval = this.b1Exp.getExpInterval();
                if (expUnit == null) {
                    logDebug("Could not set the expiration date, no expiration unit defined for expiration code: " + this.b1Exp.getExpCode());
                } else {
                    if (expUnit == "Days") {
                        tmpNewDate = dateAdd(calcDateFrom, expInterval);
                    }

                    if (expUnit == "Months") {
                        tmpNewDate = dateAddMonths(calcDateFrom, expInterval);
                    }

                    if (expUnit == "Years") {
                        tmpNewDate = dateAddMonths(calcDateFrom, expInterval * 12);
                    }
                }
            }
            if (dateOverride == null) {
                if (tmpNewDate != '') {
                    thisLic.setExpiration(dateAdd(tmpNewDate, 0));
                }
            } else {
                thisLic.setExpiration(dateAdd(dateOverride, 0));
            }
        }
        catch (err) {
            logDebug("**WARNING An error occured in setLicExpirationDate  Error1:  " + err.message);
        }

        if (renewalStatus != null) {
            thisLic.setStatus(renewalStatus);
        } else {
            thisLic.setStatus("Active");
        }

        logDebug("Successfully set the expiration date and status");
    }
    catch (err) {
        logDebug("**WARNING An error occured in setLicExpirationDate  Error2:  " + err.message);
    } return true;

}

function editFirstIssuedDate(issuedDate) { // option CapId
    var itemCap = capId

    if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

    var cdScriptObjResult = aa.cap.getCapDetail(itemCap);

    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()); return false;
    }

    var cdScriptObj = cdScriptObjResult.getOutput();

    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object"); return false;
    }

    cd = cdScriptObj.getCapDetailModel();

    var javascriptDate = new Date(issuedDate);

    var vIssuedDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

    cd.setFirstIssuedDate(vIssuedDate);

    cdWrite = aa.cap.editCapDetail(cd);

    if (cdWrite.getSuccess()) {
        logDebug("updated first issued date to " + vIssuedDate); return true;
    }
    else {
        logDebug("**ERROR updating first issued date: " + cdWrite.getErrorMessage()); return false;
    }
}
function verifyMilitaryServiceType() {
    var retMsg = ''
    var MilitaryServiceman = (AInfo["Military Serviceman"] == "Yes");
    var isNYOrganizedMilitia = (AInfo["NY Organized Militia"] == "CHECKED");
    var isUSReserveMember = (AInfo["U.S. Reserve Member"] == "CHECKED");
    var isFulltimeUSArmedService = (AInfo["Full-time U.S. Armed Service"] == "CHECKED");
    if (MilitaryServiceman && !(isNYOrganizedMilitia || isUSReserveMember || isFulltimeUSArmedService)) {
        retMsg += "Please select applicable military service type.";
        retMsg += "<Br />";
    }
    return retMsg;
}

function verifySportsmanEd() {
    var retMsg = ''
    var rowNum = 0;
    if ((typeof (SPORTSMANEDUCATION) == "object")) {
        for (var y in SPORTSMANEDUCATION) {
            rowNum++;
            var certNum = SPORTSMANEDUCATION[y]["Certificate Number"]
            var certState = SPORTSMANEDUCATION[y]["State"]
            if (certState == 'NY') {
                if (!isValidCertificateNum(certNum)) {
                    retMsg += ("Sportsman Education row #" + rowNum + ": Please enter valid certificate number.");
                    retMsg += '<Br />';
                }
            }

            var certDate = SPORTSMANEDUCATION[y]["Certification Date"]
            var diff = dateDiff(new Date(), new Date(certDate));
            if (diff > 0) {
                retMsg += ("Sportsman Education row #" +  rowNum +": Certification Date cannot be after today's date.");
                retMsg += '<Br />';
            }
        }
    }

    return retMsg;
}

function verifyPreviousLicense() {
    var retMsg = ''
    var rowNum = 0;
    if ((typeof (PREVIOUSLICENSE) == "object")) {
        for (var y in PREVIOUSLICENSE) {
            rowNum++;
            var licNum = PREVIOUSLICENSE[y]["License Number"]
            var licState = PREVIOUSLICENSE[y]["State"]
            if (licState == 'NY') {
                if (!isValidPriorLicense(licNum)) {
                    retMsg += ("Previous License row #" + rowNum + ": Please enter valid prior license number.");
                    retMsg += '<Br />';
                }
            }

            var licDate = PREVIOUSLICENSE[y]["License Date"]
            var diff = dateDiff(new Date(), new Date(licDate));
            if (diff > 0) {
                retMsg += ("Previous License row #" + rowNum + ": License Date cannot be after today's date.");
                retMsg += '<Br />';
            }
        }
    }

    return retMsg;
}

function verifyAnnulaDisability() {
    var retMsg = ''
    var rowNum = 0;
    if ((typeof (ANNUALDISABILITY) == "object")) {
        for (var y in ANNUALDISABILITY) {
            rowNum++;
            var caseNum = ANNUALDISABILITY[y]["Annual Disability Case Number"]
            if (!isValidDisabilityNumber(caseNum)) {
                retMsg += ("Annual disablilty row #" + rowNum + ": Please enter valid annual disability case number.");
                retMsg += '<Br />';
            }

            var sYear = ANNUALDISABILITY[y]["Year"]
            if (!isValidYear(sYear)) {
                retMsg += ("Annual disablilty row #" + rowNum + ": Please enter valid year.");
                retMsg += '<Br />';
            }
        }
    }

    return retMsg;
}

function verifyLandOwnerInfo() {
    var retMsg = ''
    var rowNum = 0;
    if ((typeof (LANDOWNERINFORMATION) == "object")) {
        for (var y in LANDOWNERINFORMATION) {
            rowNum++;
            var sYear = LANDOWNERINFORMATION[y]["License Year"]
            var swissCode = LANDOWNERINFORMATION[y]["SWIS Code"]
            var taxMapId = LANDOWNERINFORMATION[y]["Tax Map ID/Parcel ID"]
            var isUseLO = LANDOWNERINFORMATION[y]["Check this box to use this landowner parcel for your DMP application"]

            if (!isValidTaxMapId(taxMapId)) {
                retMsg += ("Land owner information row #" + rowNum + ": Please enter valid Tax Map ID/Parcel ID.");
                retMsg += '<Br />';
            }

            if (!isValidSWISCode(swissCode)) {
                retMsg += ("Land owner information row #" + rowNum + ": Please enter valid 6 digit SWIS code.");
                retMsg += '<Br />';
            }

            if (!isValidYear(sYear)) {
                retMsg += ("Land owner information row #" + rowNum + ": Please enter valid year.");
                retMsg += '<Br />';
            }
        }
    }

    return retMsg;
}

function verifyDMPinfo() {
    var retMsg = ''

    if (!isValidBowHuntWmu(AInfo["WMU Choice 1"], AInfo)) {
        retMsg += ('No Bow hunting education. Selected WMU for choice 1 is valid only for bow hunting.');
        retMsg += '<Br />';
    }

    if (!isValidBowHuntWmu(AInfo["WMU Choice 2"], AInfo)) {
        retMsg += ('No Bow hunting education. Selected WMU for choice 2 is valid only for bow hunting.');
        retMsg += '<Br />';
    }

    var sAppLo1 = AInfo["Apply Land Owner for Choice1"]
    var sAppLo2 = AInfo["Apply Land Owner for Choice2"]
    var isYesApplyLO1 = ((sAppLo1 != null && (sAppLo1.equalsIgnoreCase('YES') || sAppLo1.equalsIgnoreCase('Y') || sAppLo1.equalsIgnoreCase('CHECKED') || sAppLo1.equalsIgnoreCase('SELECTED') || sAppLo1.equalsIgnoreCase('TRUE') || sAppLo1.equalsIgnoreCase('ON'))))
    var isYesApplyLO2 = ((sAppLo2 != null && (sAppLo2.equalsIgnoreCase('YES') || sAppLo2.equalsIgnoreCase('Y') || sAppLo2.equalsIgnoreCase('CHECKED') || sAppLo2.equalsIgnoreCase('SELECTED') || sAppLo2.equalsIgnoreCase('TRUE') || sAppLo2.equalsIgnoreCase('ON'))))
    if (isYesApplyLO1 && isYesApplyLO2) {
        retMsg += ('Landownership can only be applied to one WMU per license year.');
        retMsg += '<Br />';
    }

    return retMsg;
}
function verifyAnySalesSelect() {
    var retMsg = ''
    var isChecked = false;
    isChecked = isChecked || (AInfo["NY Organized Militia"] == "CHECKED");
    isChecked = isChecked || (AInfo["Junior Hunting Tags"] == "CHECKED");
    isChecked = isChecked || (AInfo["Marine Registry"] == "CHECKED");
    isChecked = isChecked || (AInfo["One Day Fishing License"] == "CHECKED");
    isChecked = isChecked || (AInfo["Bowhunting Privilege"] == "CHECKED");
    isChecked = isChecked || (AInfo["Deer Management Permit"] == "CHECKED");
    isChecked = isChecked || (AInfo["Hunting License"] == "CHECKED");
    isChecked = isChecked || (AInfo["Muzzleloading Privilege"] == "CHECKED");
    isChecked = isChecked || (AInfo["Turkey Permit"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Bowhunting"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Fishing"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Muzzleloading"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Small & Big Game"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Sportsman"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Trapping"] == "CHECKED");
    isChecked = isChecked || (AInfo["Trapping License"] == "CHECKED");
    isChecked = isChecked || (AInfo["Habitat/Access Stamp"] == "CHECKED");
    isChecked = isChecked || (AInfo["Venison Donation"] == "CHECKED");
    isChecked = isChecked || (AInfo["Conservation Fund"] == "CHECKED");
    isChecked = isChecked || (AInfo["Trail Supporter Patch"] == "CHECKED");
    isChecked = isChecked || (AInfo["Conservationist Magazine"] == "CHECKED");
    isChecked = isChecked || (AInfo["Conservation Patron"] == "CHECKED");
    isChecked = isChecked || (AInfo["Freshwater Fishing"] == "CHECKED");
    isChecked = isChecked || (AInfo["NonRes Freshwater Fishing"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident 1 Day Fishing"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident 7 Day Fishing"] == "CHECKED");
    isChecked = isChecked || (AInfo["Seven Day Fishing License"] == "CHECKED");
    isChecked = isChecked || (AInfo["Conservation Legacy"] == "CHECKED");
    isChecked = isChecked || (AInfo["Junior Bowhunting"] == "CHECKED");
    isChecked = isChecked || (AInfo["Junior Hunting"] == "CHECKED");
    isChecked = isChecked || (AInfo["NonRes Muzzleloading"] == "CHECKED");
    isChecked = isChecked || (AInfo["NonRes Super Sportsman"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident Bear Tag"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident Big Game"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident Bowhunting"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident Small Game"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident Turkey"] == "CHECKED");
    isChecked = isChecked || (AInfo["Small and Big Game"] == "CHECKED");
    isChecked = isChecked || (AInfo["Small Game"] == "CHECKED");
    isChecked = isChecked || (AInfo["Sportsman"] == "CHECKED");
    isChecked = isChecked || (AInfo["Super Sportsman"] == "CHECKED");
    isChecked = isChecked || (AInfo["Nonresident Trapping"] == "CHECKED");
    isChecked = isChecked || (AInfo["Trapper Super Sportsman"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Card Replace"] == "CHECKED");
    isChecked = isChecked || (AInfo["Sportsman Ed Certification"] == "CHECKED");
    isChecked = isChecked || (AInfo["Lifetime Inscription"] == "CHECKED");

    if (!isChecked) {
        retMsg += "Please select sales item.";
        retMsg += "<Br />";
    }
    return retMsg;

}

function createActiveHoldingTable() {
    logDebug("ENTER: createActiveHoldingTable");
    var xArray = getApplicantArrayEx();
    var peopleSequenceNumber = null;
    for (ca in xArray) {
        var thisContact = xArray[ca];
        peopleSequenceNumber = thisContact["refcontactSeqNumber"]
        if (peopleSequenceNumber != null) {
            var asitModel;
            var new_asit;
            var availableActiveItems = getActiveHoldings(peopleSequenceNumber, AInfo["License Year"]);
            var newAsitArray = GetActiveHoldingsAsitTableArray(availableActiveItems);

            asitModel = cap.getAppSpecificTableGroupModel();
            new_asit = addASITable4ACAPageFlow(asitModel, "ACTIVE HOLDINGS", newAsitArray);

            var strAllHolding = GetASITDelimitedString("ACTIVEHOLDINGS", newAsitArray);
            editAppSpecific4ACA("A_ActiveHoldings", strAllHolding);
            editAppSpecific4ACA("A_PrintConsignedLines", isPrivPanleWithConsignedLinesFound(availableActiveItems) ? 'N' : 'Y');
        }
        break;
    }
    logDebug("EXIT: createActiveHoldingTable");
}

function GetActiveHoldingsAsitTableArray(availableActiveItems) {
    logDebug("ENTER: GetActiveHoldingsAsitTableArray");

    var readOnly = "N";
    var tempObject = new Array();
    var tempArray = new Array();

    for (var tidx in availableActiveItems) {
        var tObj = availableActiveItems[tidx];
        if (tObj.RecordType != AA54_TAG_PRIV_PANEL) {
            logDebug(tObj.RecordType);
            tempObject = new Array();
            var fieldInfo = new asiTableValObj("Item Code", (isNull(tObj.IsTag(), false) ? isNull(tObj.TagType, '') : isNull(tObj.ItemCode, '')), "Y");
            tempObject["Item Code"] = fieldInfo;
            fieldInfo = new asiTableValObj("Description", isNull(tObj.Description, ''), "Y");
            tempObject["Description"] = fieldInfo;
            fieldInfo = new asiTableValObj("Tag / Document ID", isNull(tObj.altId, ''), "Y");
            tempObject["Tag / Document ID"] = fieldInfo;
            fieldInfo = new asiTableValObj("From Date", isNull(tObj.FromDate, ''), "Y");
            tempObject["From Date"] = fieldInfo;
            fieldInfo = new asiTableValObj("To Date", isNull(tObj.ToDate, ''), "Y");
            tempObject["To Date"] = fieldInfo;
            fieldInfo = new asiTableValObj("License Year", isNull(tObj.LicenseYear, ''), "Y");
            tempObject["License Year"] = fieldInfo;
            fieldInfo = new asiTableValObj("Tag", (isNull(tObj.IsTag(), false) ? "CHECKED" : ""), "Y");
            tempObject["Tag"] = fieldInfo;
            fieldInfo = new asiTableValObj("RecordType", tObj.RecordType, "Y");
            tempObject["RecordType"] = fieldInfo;

            tempArray.push(tempObject);  // end of record
        }
    }
    logDebug("EXIT: GetActiveHoldingsAsitTableArray");

    return tempArray;
}
function isPrivPanleWithConsignedLinesFound(availableActiveItems) {
    var isFound = false;
    for (var tidx in availableActiveItems) {
        var tObj = availableActiveItems[tidx];
        if (tObj.RecordType == AA54_TAG_PRIV_PANEL) {
            isFound = (tObj.PrintConsignedLines == 'Yes' || tObj.PrintConsignedLines == 'Y');
            if (isFound) {
                break;
            }
        }
    }
    return isFound;
}
function GetActiveHoldingsDelimitedString(availableActiveItems) {
    var delimitedStr = "";

    for (var tidx in availableActiveItems) {
        var tObj = availableActiveItems[tidx];
        if (tidx != 0) delimitedStr += "|";

        var sItemCode = (isNull(tObj.IsTag(), false) ? isNull(tObj.TagType, '') : isNull(tObj.ItemCode, ''));
        delimitedStr += sItemCode;
        delimitedStr += '^';

        var sDescription = isNull(tObj.Description, '');
        delimitedStr += sDescription;
        delimitedStr += '^';

        var sTag_DocumentID = isNull(tObj.altId, '');
        delimitedStr += sTag_DocumentID;
        delimitedStr += '^';

        var sFromDate = isNull(tObj.FromDate, '');
        delimitedStr += sFromDate;
        delimitedStr += '^';

        var sToDate = isNull(tObj.ToDate, '');
        delimitedStr += sToDate;
        delimitedStr += '^';

        var sLicenseYear = isNull(tObj.LicenseYear, '');
        delimitedStr += sLicenseYear;
        delimitedStr += '^';

        var sTag = (isNull(tObj.IsTag(), false) ? "CHECKED" : "");
        delimitedStr += sTag;
        delimitedStr += '^';

        var sRecordType = tObj.RecordType;
        delimitedStr += sRecordType;
        delimitedStr += '^';
    }

    return delimitedStr;
}
function editFileDate(itemCap, fileDate) {
    try {
        var javascriptDate = new Date(fileDate);
        var vfileDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

        var scriptDt = aa.date.parseDate(dateAdd(vfileDate, 0));
        //logDebug(scriptDt.getMonth() + "/" + scriptDt.getDayOfMonth() + "/" + scriptDt.getYear());

        var thisCapObj = aa.cap.getCap(itemCap).getOutput();
        thisCapObj.setFileDate(scriptDt);
        var capModel = thisCapObj.getCapModel();
        var setFileDateResult = aa.cap.editCapByPK(capModel);
        if (!setFileDateResult.getSuccess()) {
            logDebug("**WARNING: error setting cap name : " + setFileDateResult.getErrorMessage());
            return false;
        }


    }
    catch (err) {
        logDebug("**ERROR An error occured in editFileDate  Error:  " + err.message);
    }
    return true;
}
function isValidIntegerNumber(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^(?!^0)\d{1,9}$/;
        isvalid = (pattern.test(inputvalue));
    }
    return isvalid;
}
function isValidDisabilityNumber(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        /*
        var pattern = /^[C0-9]{9}$/;
        isvalid = (pattern.test(inputvalue));
        */
    }
    return isvalid;
}

function isValidYear(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^[0-9]{4}$/;
        isvalid = (pattern.test(inputvalue));
    }
    return isvalid;
}
function isValidSWISCode(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^[0-9]{6}$/;
        isvalid = (pattern.test(inputvalue));
    }
    return isvalid;
}
function isValidTaxMapId(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        //var pattern = /^[a-zA-Z0-9-]+$/;
        //isvalid = (pattern.test(inputvalue));
    }
    return isvalid;
}
function isValidPriorLicense(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        /*
        var pattern = /^[0-9]{9}$/;
        isvalid = (pattern.test(inputvalue));
        */
    }
    return isvalid;
}
function isValidCertificateNum(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        /*
        var pattern = /^[0-9]{9}$/;
        isvalid = (pattern.test(inputvalue));
        */
    }
    return isvalid;
}

function isAgentAbleToSell(userId) {
    var isvalid = true;

	var uObj = new USEROBJ(userId);
    logDebug(uObj.publicUserID);
    if (uObj.acctType == 'CITIZEN') return true;

    var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
    if (salesAgentInfoArray != null) {
            isvalid = (salesAgentInfoArray["Agent Enabled for Sales"] != "N");
        }
    return isvalid;
}

function isValidUserForGameHarvest(userId) {
    var isvalid = false;

    var uObj;
    if (arguments.length > 0) {
        uObj = new USEROBJ();
        uObj.userId = userId;
        uObj.userModel = uObj.getUserModel();
        uObj.setUserModelAttributes();
    } else {
        uObj = new USEROBJ(publicUserID);
    }
    isvalid = (uObj.acctType == 'CITIZEN');

    if (!isvalid) {
        var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
        if (salesAgentInfoArray != null) {
            isvalid = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
        }
    }
    return isvalid;
}
function isValidUserForUpgradeLic(userId) {
    var isvalid = false;

    var uObj;
    if (arguments.length > 0) {
        uObj = new USEROBJ();
        uObj.userId = userId;
        uObj.userModel = uObj.getUserModel();
        uObj.setUserModelAttributes();
    } else {
        uObj = new USEROBJ(publicUserID);
    }
    isvalid = (uObj.acctType != 'CITIZEN');

    if (isvalid) {
        var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
        if (salesAgentInfoArray != null) {
            var isCallcenter = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
            var isCampsite = (salesAgentInfoArray["Agent Group"] == "Campsite");
            var isMunicipality = (salesAgentInfoArray["Agent Group"] == "Municipality");
            var isNYSDEC_HQ = (salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
            var isNYSDEC_Regional_Office = (salesAgentInfoArray["Agent Group"] == "NYSDEC Regional Office");
            var isNative_American_Agency = (salesAgentInfoArray["Agent Group"] == "Native American Agency");
            var isRetail = (salesAgentInfoArray["Agent Group"] == "Retail");

            isvalid = isNYSDEC_HQ;
        }
    }
    return isvalid;
}
function isValidUserForReprintDocuments(userId) {
    var isvalid = false;

    var uObj;
    if (arguments.length > 0) {
        uObj = new USEROBJ();
        uObj.userId = userId;
        uObj.userModel = uObj.getUserModel();
        uObj.setUserModelAttributes();
    } else {
        uObj = new USEROBJ(publicUserID);
    }
    isvalid = (uObj.acctType != 'CITIZEN');

    if (isvalid) {
        var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
        if (salesAgentInfoArray != null) {
            var isCallcenter = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
            var isCampsite = (salesAgentInfoArray["Agent Group"] == "Campsite");
            var isMunicipality = (salesAgentInfoArray["Agent Group"] == "Municipality");
            var isNYSDEC_HQ = (salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
            var isNYSDEC_Regional_Office = (salesAgentInfoArray["Agent Group"] == "NYSDEC Regional Office");
            var isNative_American_Agency = (salesAgentInfoArray["Agent Group"] == "Native American Agency");
            var isRetail = (salesAgentInfoArray["Agent Group"] == "Retail");

            isvalid = !isCallcenter;
        }
    }
    return isvalid;
}
function isValidUserForVoidSales(userId) {
    var isvalid = false;

    var uObj;
    if (arguments.length > 0) {
        uObj = new USEROBJ();
        uObj.userId = userId;
        uObj.userModel = uObj.getUserModel();
        uObj.setUserModelAttributes();
    } else {
        uObj = new USEROBJ(publicUserID);
    }
    isvalid = (uObj.acctType != 'CITIZEN');

    if (isvalid) {
        var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
        if (salesAgentInfoArray != null) {
            var isCallcenter = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
            var isCampsite = (salesAgentInfoArray["Agent Group"] == "Campsite");
            var isMunicipality = (salesAgentInfoArray["Agent Group"] == "Municipality");
            var isNYSDEC_HQ = (salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
            var isNYSDEC_Regional_Office = (salesAgentInfoArray["Agent Group"] == "NYSDEC Regional Office");
            var isNative_American_Agency = (salesAgentInfoArray["Agent Group"] == "Native American Agency");
            var isRetail = (salesAgentInfoArray["Agent Group"] == "Retail");

            isvalid = isNYSDEC_HQ || isCallcenter || isCampsite || isMunicipality || isNYSDEC_Regional_Office || isNative_American_Agency || isRetail;
        }
    }
    return isvalid;
}
function addFullfillmentConditionArray(itemCapId, condArray) {
    for (var cnd in condArray) {
        addFullfillmentCondition(itemCapId, condArray[cnd]);
    }
}
function addFullfillmentCondition(itemCapId, fullfillmentCondition) {
    if (fullfillmentCondition != '') {
        addStdConditionWithComments("Fulfillment", fullfillmentCondition, "", "", itemCapId);
    }
}
function removeFullfillmentCapCondition(itemCapId, fullfillmentCondition) {
    if (fullfillmentCondition != '') {
        removeCapCondition("Fulfillment", fullfillmentCondition, itemCapId);
    }
}
function createChildForDec(grp, typ, stype, cat, desc) {
    // optional parent capId
    //
    // creates the new application and returns the capID object
    //

    var itemCap = capId
    if (arguments.length > 5) itemCap = arguments[5]; // use cap ID specified in args

    var appCreateResult = aa.cap.createApp(grp, typ, stype, cat, desc);
    logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
    if (appCreateResult.getSuccess()) {
        var newId = appCreateResult.getOutput();
        logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");

        // create Detail Record
        capModel = aa.cap.newCapScriptModel().getOutput();
        capDetailModel = capModel.getCapModel().getCapDetailModel();
        capDetailModel.setCapID(newId);
        aa.cap.createCapDetail(capDetailModel);

        var newObj = aa.cap.getCap(newId).getOutput(); //Cap object
        var result = aa.cap.createAppHierarchy(itemCap, newId);
        if (result.getSuccess())
            logDebug("Child application successfully linked");
        else
            logDebug("Could not link applications");

        var contactType = ''
        if (arguments.length > 6) contactType = arguments[6]; // copyContact

        // Copy Contacts
        capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            Contacts = capContactResult.getOutput();
            for (yy in Contacts) {
                var newContact = Contacts[yy].getCapContactModel();
                if (newContact.getContactType() == contactType || contactType == '') {
                    newContact.setCapID(newId);
                    aa.people.createCapContact(newContact);
                }
            }
        }

        /*
        // Copy Addresses
        capAddressResult = aa.address.getAddressByCapId(itemCap);
        if (capAddressResult.getSuccess()) {
        Address = capAddressResult.getOutput();
        for (yy in Address) {
        newAddress = Address[yy];
        newAddress.setCapID(newId);
        aa.address.createAddress(newAddress);
        logDebug("added address");
        }
        }
        */
        return newId;
    }
    else {
        logDebug("**ERROR: adding child App: " + appCreateResult.getErrorMessage());
    }
}

function afterApplicationPrintFail(itemCapId, numberOfTries) {
    var isVoidAll = (numberOfTries > 2);
    var itemCap = aa.cap.getCap(itemCapId).getOutput();
    //var altId = itemCapId.getCustomID();
    //var status = itemCap.getCapStatus();
    var contactTypeToAttach = ''; //Balnk = All
    appTypeString = itemCap.getCapType();

    if (appTypeString == 'Licenses/Annual/Application/NA') {

    }
    else if (appTypeString == 'Licenses/Sales/Reprint/Documents') {
        contactTypeToAttach = "Individual"
    }
    else if (appTypeString == 'Licenses/Sales/Upgrade/Lifetime') {
        contactTypeToAttach = "Individual"
    }

    var peopleSequenceNumber = null;
    var capContactResult = aa.people.getCapContactByCapID(itemCapId);
    if (capContactResult.getSuccess()) {
        var Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
            var newContact = Contacts[yy].getCapContactModel();
            if (newContact.getContactType() == "DEC Agent") {
                peopleSequenceNumber = newContact.getRefContactNumber();
                break;
            }
        }
    }

    salesAgentInfoArray = getAgentInfoByPeopleSeqNum(peopleSequenceNumber);

    var searchAppTypeString = "Licenses/*/*/*";
    var capArray = getChildren(searchAppTypeString, itemCapId);
    if (capArray == null) {
        return;
    }

    var appSpecInfoResult = aa.appSpecificInfo.editSingleAppSpecific(itemCap, "A_numberOfTries", numberOfTries + "", null);

    for (y in capArray) {
        var childCapId = capArray[y];
        var currcap = aa.cap.getCap(childCapId).getOutput();
        appTypeString = currcap.getCapType().toString();
        var ata = appTypeString.split("/");

        if (isVoidAll) {
            if (currcap.getCapStatus() == "Active" || currcap.getCapStatus() == "Returnable") {
                updateAppStatus("Void", "Void", childCapId);
                closeTaskForRec("Void Document", "Void", "", "", "", childCapId);
                closeTaskForRec("Report Game Harvest", "", "", "", "", childCapId);
                closeTaskForRec("Revocation", "", "", "", "", childCapId);
                closeTaskForRec("Suspension", "", "", "", "", childCapId);
            }
        } else {
            if (currcap.getCapStatus() == "Active") {
                //Onlt tags are returnable
                if (ata[1] == 'Tag') {
                    var newLicId = createChildForDec(ata[0], ata[1], ata[2], ata[3], null, childCapId, contactTypeToAttach);
                    activateTaskForRec("Report Game Harvest", "", newLicId);
                    activateTaskForRec("Void Document", "", newLicId);
                    activateTaskForRec("Revocation", "", newLicId);
                    activateTaskForRec("Suspension", "", newLicId);

                    updateAppStatus("Returnable", "Returnable", childCapId);

                    //copyAddresses(childCapId, newLicId);
                    copyASITables(childCapId, newLicId);
                    copyASIFields(childCapId, newLicId);
                    copyCalcVal(childCapId, newLicId);
                    copyFees(childCapId, newLicId);
                    copyConditions(newLicId, childCapId);

                    //SET open date and expiration date
                    var openDt = currcap.getFileDate();
                    var effectiveDt = new Date(openDt.getMonth() + "/" + openDt.getDayOfMonth() + "/" + openDt.getYear());
                    editFileDate(newLicId, jsDateToMMDDYYYY(effectiveDt));
                    var clacFromDt = dateAdd(effectiveDt, -1);
                    setLicExpirationDate(newLicId, "", clacFromDt);

                    //Application name
                    var appName = currcap.getSpecialText();
                    editAppName(appName, newLicId);

                    //Set document number
                    var newDecDocId = GenerateDocumentNumber(newLicId.getCustomID());
                    updateDocumentNumber(newDecDocId, newLicId);

                    //update Staus and workflow tasks
                    closeTaskForRec("Issuance", "Active", "", "", "", newLicId);
                    updateAppStatus("Active", "Active", newLicId);
                    activateTaskForRec("Report Game Harvest", "", newLicId);
                    activateTaskForRec("Void Document", "", newLicId);
                    activateTaskForRec("Revocation", "", newLicId);
                    activateTaskForRec("Suspension", "", newLicId);

                    var result = aa.cap.createAppHierarchy(itemCapId, newLicId);
                    if (result.getSuccess()) {
                        logDebug("Parent application successfully linked");
                    }
                    else {
                        logDebug("Could not link applications" + result.getErrorMessage());
                    }
                }
            }
        }
    }
    //Void Parent Application
    if (isVoidAll) {
        updateAppStatus("Void", "Void", itemCapId);
    }
}

function editCapConditionStatus(pType, pDesc, pStatus, pStatusType) {
    // updates a condition with the pType and   
    // to pStatus and pStatusType, returns true if updates, false if not
    // will not update if status is already pStatus && pStatusType
    // all parameters are required except for pType
    // optional fromStatus for 5th paramater
    // optional capId for 6th parameter

    var itemCap = capId;
    var fromStatus = "";

    if (arguments.length > 4) {
        fromStatus = arguments[4];
    }

    if (arguments.length > 5) {
        itemCap = arguments[5];
    }

    if (pType == null)
        var condResult = aa.capCondition.getCapConditions(itemCap);
    else
        var condResult = aa.capCondition.getCapConditions(itemCap, pType);

    if (condResult.getSuccess())
        var capConds = condResult.getOutput();
    else {
        logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
        return false;
    }

    var conditionUpdated = false;
    for (cc in capConds) {
        var thisCond = capConds[cc];
        var cStatus = thisCond.getConditionStatus();
        var cStatusType = thisCond.getConditionStatusType();
        var cDesc = thisCond.getConditionDescription();
        var cImpact = thisCond.getImpactCode();
        logDebug(cStatus + ": " + cStatusType);

        if (cDesc.toUpperCase() == pDesc.toUpperCase()) {
            if (fromStatus.toUpperCase().equals(cStatus.toUpperCase()) || fromStatus == "") {
                thisCond.setConditionStatus(pStatus);
                thisCond.setConditionStatusType(pStatusType);
                thisCond.setImpactCode("");
                aa.capCondition.editCapCondition(thisCond);
                conditionUpdated = true; // condition has been found and updated
            }
        }
    }


    if (conditionUpdated) {
        logDebug("Condition has been found and updated to a status of: " + pStatus);
    } else {
        logDebug("ERROR: no matching condition found");
    }

    return conditionUpdated; //no matching condition found
}

function closeTasksForTagAnditems(itemCapId) {
    var capTypesArray = new Array();
    capTypesArray.push("Licenses/Tag/*/*");
    capTypesArray.push("Licenses/Annual/Fishing/*");
    capTypesArray.push("Licenses/Annual/Hunting/*");
    capTypesArray.push("Licenses/Annual/Trapping/*");
    capTypesArray.push("Licenses/Lifetime/Fishing/*");
    capTypesArray.push("Licenses/Lifetime/Hunting/*");
    capTypesArray.push("Licenses/Lifetime/Trapping/*");
    capTypesArray.push("Licenses/Lifetime/Other/*");
    capTypesArray.push("Licenses/Other/Sales/*");

    var tskNameArray = new Array();
    tskNameArray.push("Report Game Harvest");
    tskNameArray.push("Void Document");
    tskNameArray.push("Revocation");
    tskNameArray.push("Suspension");

    var itemCap = aa.cap.getCap(itemCapId).getOutput();

    for (var c in capTypesArray) {
        var capTypes = capTypesArray[c];
        if (appMatch(capTypes, itemCapId) && !appMatch("*/*/*/Application", itemCapId)) {
            for (var t in tskNameArray) {
                var tskName = tskNameArray[t]
                if (isTaskActive(tskName)) {
                    closeTaskForRec(tskName, "", "", "", "", itemCapId);
                }
            }
            break;
        }
    }
}

function isValidBowHuntWmu(wmu, aAInfo) {
    var isValid = true;

    var strControl = 'WMU Bow Only';
    var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
    if (bizDomScriptResult.getSuccess()) {
        bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
        for (var i in bizDomScriptArray) {
            if (bizDomScriptArray[i].getBizdomainValue() == wmu) {
                var frm = new form_OBJECT(GS2_EXPR);
                frm.SetPriorLicense(aAInfo["A_Previous_License"]);
                frm.SetSportsmanEducation(aAInfo["A_Sportsman_Education"]);
                isValid = frm.HasBowHunt();
                break;
            }
        }
    }

    return isValid;
}

function addContactStdConditionWithComments(contSeqNum, cType, cDesc) {
    var foundCondition = false;
    var javascriptDate = new Date()
    var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

    cStatus = "Applied";
    if (arguments.length > 3)
        cStatus = arguments[3]; // use condition status in args

    var cShortComment = '';
    if (arguments.length > 4)
        cShortComment = arguments[4];
    var cLongComment = '';
    if (arguments.length > 5)
        cLongComment = arguments[5];

    if (!aa.capCondition.getStandardConditions) {
        logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
    }
    else {
        standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
        for (i = 0; i < standardConditions.length; i++)
            if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
            {
                standardCondition = standardConditions[i]; // add the last one found
                foundCondition = true;
                if (!contSeqNum) // add to all reference address on the current capId
                {
                    var capContactResult = aa.people.getCapContactByCapID(capId);
                    if (capContactResult.getSuccess()) {
                        var Contacts = capContactResult.getOutput();
                        for (var contactIdx in Contacts) {
                            var contactNbr = Contacts[contactIdx].getCapContactModel().getPeople().getContactSeqNumber();
                            if (contactNbr) {
                                var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
                                if (cShortComment != null && cShortComment != '') {
                                    newCondition.setConditionComment(cShortComment);
                                } else {
                                    newCondition.setConditionComment(standardCondition.getConditionComment());
                                }
                                if (cLongComment != null && cLongComment != '') {
                                    newCondition.setLongDescripton(cLongComment);
                                } else {
                                    newCondition.setLongDescripton(newCondition.getLongDescripton());
                                }
                                newCondition.setConditionDescription(standardCondition.getConditionDesc());
                                newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                                newCondition.setEntityType("CONTACT");
                                newCondition.setEntityID(contactNbr);
                                newCondition.setConditionGroup(standardCondition.getConditionGroup());
                                newCondition.setConditionType(standardCondition.getConditionType());
                                newCondition.setImpactCode(standardCondition.getImpactCode());
                                newCondition.setConditionStatus(cStatus)
                                newCondition.setAuditStatus("A");
                                newCondition.setIssuedByUser(systemUserObj);
                                newCondition.setIssuedDate(javautilDate);
                                newCondition.setEffectDate(javautilDate);
                                newCondition.setAuditID(currentUserID);
                                if (cLongComment != null && cLongComment != '') {
                                    var langCond = aa.condition.getCondition(newCondition, lang).getOutput();
                                    r.arDescription = langCond.getResConditionDescription();
                                    r.arComment = langCond.getResConditionComment();
                                }
                                var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);

                                if (addContactConditionResult.getSuccess()) {
                                    logDebug("Successfully added reference contact (" + contactNbr + ") condition: " + cDesc);
                                }
                                else {
                                    logDebug("**ERROR: adding reference contact (" + contactNbr + ") condition: " + addContactConditionResult.getErrorMessage());
                                }
                            }
                        }
                    }
                }
                else {
                    var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
                    if (cShortComment != null && cShortComment != '') {
                        newCondition.setConditionComment(cShortComment);
                    } else {
                        newCondition.setConditionComment(standardCondition.getConditionComment());
                    }
                    if (cLongComment != null && cLongComment != '') {
                        newCondition.setLongDescripton(cLongComment);
                    } else {
                        newCondition.setLongDescripton(newCondition.getLongDescripton());
                    }
                    newCondition.setConditionDescription(standardCondition.getConditionDesc());
                    newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                    newCondition.setEntityType("CONTACT");
                    newCondition.setEntityID(contSeqNum);
                    newCondition.setConditionGroup(standardCondition.getConditionGroup());
                    newCondition.setConditionType(standardCondition.getConditionType());
                    newCondition.setImpactCode(standardCondition.getImpactCode());
                    newCondition.setConditionStatus(cStatus)
                    newCondition.setAuditStatus("A");
                    newCondition.setIssuedByUser(systemUserObj);
                    newCondition.setIssuedDate(javautilDate);
                    newCondition.setEffectDate(javautilDate);

                    newCondition.setAuditID(currentUserID);
                    var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);

                    if (addContactConditionResult.getSuccess()) {
                        logDebug("Successfully added reference contact (" + contSeqNum + ") condition: " + cDesc);
                    }
                    else {
                        logDebug("**ERROR: adding reference contact (" + contSeqNum + ") condition: " + addContactConditionResult.getErrorMessage());
                    }
                }
            }
    }
    if (!foundCondition) logDebug("**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
}

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function addASITable4ACAPageFlow(destinationTableGroupModel,tableName,tableValueArray) // optional capId
    	{
  	//  tableName is the name of the ASI table
  	//  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
  	// 
  	
    	var itemCap = capId
  	if (arguments.length > 3)
  		itemCap = arguments[3]; // use cap ID specified in args
  
  	var ta = destinationTableGroupModel.getTablesMap().values();
  	var tai = ta.iterator();
  	
  	var found = false;
  	
  	while (tai.hasNext())
  		  {
  		  var tsm = tai.next();  // com.accela.aa.aamain.appspectable.AppSpecificTableModel
  		  if (tsm.getTableName().equals(tableName)) { found = true; break; }
  	          }


  	if (!found) { logDebug("cannot update asit for ACA, no matching table name"); return false; }
  	
	var fld = aa.util.newArrayList();  // had to do this since it was coming up null.
        var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
  	var i = -1; // row index counter
  
         	for (thisrow in tableValueArray)
  		{
  
 
  		var col = tsm.getColumns()
  		var coli = col.iterator();
  
  		while (coli.hasNext())
  			{
  			var colname = coli.next();
  			
			if (typeof(tableValueArray[thisrow][colname.getColumnName()]) == "object")  // we are passed an asiTablVal Obj
				{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "",colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField",args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g,"\+"));
				fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
				fld.add(fldToAdd);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);
				
				}
			else // we are passed a string
				{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "",colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField",args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g,"\+"));
				fldToAdd.setReadOnly(false);
				fld.add(fldToAdd);
				fld_readonly.add("N");

				}
  			}
  
  		i--;
  		
  		tsm.setTableField(fld);
  		tsm.setReadonlyField(fld_readonly); // set readonly field
  		}
  
  
                tssm = tsm;
                
                return destinationTableGroupModel;
                
  	}
    
function createEducUpdCond(ipPeopleModel) {
    var fvSubGroupName = "SPORTSMAN EDUCATION";
    var fvFieldName = "Sportsman Education Type";
    var fvAppSpecificTableScript = aa.appSpecificTableScript.getAppSpecificTableModel(capId, fvSubGroupName).getOutput();
    var fvAppSpecificTable = fvAppSpecificTableScript.getAppSpecificTableModel();
    var fVTableFields = fvAppSpecificTable.getTableFields();
    
    var fvNewSpEdArray = new Array();
    if (fVTableFields) {
        for (var fvIdx = 0; fvIdx < fVTableFields.size(); fvIdx++) {
            var fvAppSpecificTableField = fVTableFields.get(fvIdx);
            var fVFieldLabel = fvAppSpecificTableField.getFieldLabel();
            if (fVFieldLabel != fvFieldName)
                continue;
            var fvInputValue = fvAppSpecificTableField.getInputValue();
            fvNewSpEdArray.push(fvInputValue);
            break;
        }
    }
    
    var fvOldSpEdArray = new Array();
    var fvTemplateGroups = ipPeopleModel.getTemplate().getTemplateTables();
    if (fvTemplateGroups && fvTemplateGroups.size() > 0) {
        var fvSubGroups = fvTemplateGroups.get(0).getSubgroups();
        for (var fvSubGroupIndex = 0; fvSubGroupIndex < fvSubGroups.size(); fvSubGroupIndex++) {
            var fvSubGroup = fvSubGroups.get(fvSubGroupIndex);

            if (fvSubGroupName != fvSubGroup.getSubgroupName())
                continue;

            var fvFields = fvSubGroup.getFields();
            if (fvFields) {
                var fvFieldPos = -1;
                for (var fvCounter = 0; fvCounter < fvFields.size(); fvCounter++) {
                    var fvField = fvFields.get(fvCounter);
                    if (fvField.fieldName != fvFieldName)
                        continue;
                    fvFieldPos = fvCounter;
                    break;
                }

                var fvRows = fvSubGroup.getRows();
                if (fvRows) {
                    for (var fvCounter = 0; fvCounter < fvRows.size(); fvCounter++) {
                        var fvRow = fvRows.get(fvCounter);
                        var fvRowValues = fvRow.getValues();
                        var fvValue = fvRowValues.get(fvFieldPos);
                        fvOldSpEdArray.push(fvValue.value);
                    }
                }
            }
            break;
        }
    }

    var fvMismatch = false;
    for (var fvCounter1 in fvOldSpEdArray) {
        var fvOldSpEd = fvOldSpEdArray[fvCounter1];
        var fvFound = false;
        for (var fvCounter2 in fvNewSpEdArray) {
            var fvNewSpEd = fvNewSpEdArray[fvCounter2];
            if (fvOldSpEd == fvNewSpEd) {
                fvFound = true;
                break;
            }
        }
        if (!fvFound) {
            fvMismatch = true;
            break;
        }
    }
    if (!fvMismatch) {
        for (var fvCounter1 in fvNewSpEdArray) {
            var fvNewSpEd = fvNewSpEdArray[fvCounter1];
            var fvFound = false;
            for (var fvCounter2 in fvOldSpEdArray) {
                var fvOldSpEd = fvOldSpEdArray[fvCounter2];
                if (fvOldSpEd == fvNewSpEd) {
                    fvFound = true;
                    break;
                }
            }
            if (!fvFound) {
                fvMismatch = true;
                break;
            }
        }
    }
    var fvCondFulfill = new COND_FULLFILLMENT();
    if (fvMismatch && !appHasCondition("Fulfillment","Applied",fvCondFulfill.Condition_EducRefContUpd,null))
        addFullfillmentCondition(capId, fvCondFulfill.Condition_EducRefContUpd);
}
