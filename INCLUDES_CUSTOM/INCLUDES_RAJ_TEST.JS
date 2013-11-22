function addEnforcementCondition(contSeqNum, cType, cDesc, effFromDt, expDate, cStatus, cShortComment, cLongComment) {

    var foundCondition = false;
    var javascriptDate = new Date()
    var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());


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
                        aa.print("existing condition");
                        var Contacts = capContactResult.getOutput();
                        for (var contactIdx in Contacts) {
                            var contactNbr = Contacts[contactIdx].getCapContactModel().getPeople().getContactSeqNumber();
                            if (contactNbr) {
                                var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
                                newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                                newCondition.setEntityType("CONTACT");
                                newCondition.setEntityID(contactNbr);
                                newCondition.setConditionDescription(standardCondition.getConditionDesc());
                                newCondition.setConditionGroup(standardCondition.getConditionGroup());
                                newCondition.setConditionType(standardCondition.getConditionType());
                                newCondition.setConditionComment(standardCondition.getConditionComment());
                                newCondition.setImpactCode(standardCondition.getImpactCode());
                                newCondition.setConditionStatus(cStatus)
                                newCondition.setAuditStatus("A");
                                newCondition.setIssuedByUser(systemUserObj);
                                newCondition.setIssuedDate(javautilDate);

                                newCondition.setEffectDate(aa.util.parseDate(effFromDt));
                                newCondition.setExpireDate(aa.util.parseDate(expDate));

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
                    newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                    newCondition.setEntityType("CONTACT");
                    newCondition.setEntityID(contSeqNum);
                    newCondition.setConditionDescription(standardCondition.getConditionDesc());
                    newCondition.setConditionGroup(standardCondition.getConditionGroup());
                    newCondition.setConditionType(standardCondition.getConditionType());
	
					if (cShortComment != null && cShortComment != '') {
						newCondition.setConditionComment(cShortComment);
					}
					
					if (cLongComment != null && cLongComment != '') {
						newCondition.setLongDescripton(cLongComment);
					}

                    newCondition.setImpactCode(standardCondition.getImpactCode());
                    newCondition.setConditionStatus(cStatus)
                    newCondition.setAuditStatus("A");

					newCondition.setConditionStatusType("Applied");
                    newCondition.setIssuedByUser(systemUserObj);
                   // newCondition.setIssuedDate(javautilDate);   - The applied date has to on or before effective date....Raj
					newCondition.setIssuedDate(aa.util.parseDate(effFromDt));
                    newCondition.setEffectDate(aa.util.parseDate(effFromDt));
                    newCondition.setExpireDate(aa.util.parseDate(expDate));

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



function addContactStdConditionWithDates(contSeqNum, cType, cDesc, effFromDt, expDate) {

    var foundCondition = false;
    var javascriptDate = new Date()
    var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());


    cStatus = "Applied";


    if (arguments.length > 5) {
        cStatus = arguments[5]; // use condition status in args
        toDate = arguments[4];
        fromDate = arguments[3];
    }
    if (arguments.length > 4) {
        toDate = arguments[4];
        fromDate = arguments[3];
    }
    if (arguments.length > 3) {
        fromDate = arguments[3];
    }



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
                        aa.print("existing condition");
                        var Contacts = capContactResult.getOutput();
                        for (var contactIdx in Contacts) {
                            var contactNbr = Contacts[contactIdx].getCapContactModel().getPeople().getContactSeqNumber();
                            if (contactNbr) {
                                var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
                                newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                                newCondition.setEntityType("CONTACT");
                                newCondition.setEntityID(contactNbr);
                                newCondition.setConditionDescription(standardCondition.getConditionDesc());
                                newCondition.setConditionGroup(standardCondition.getConditionGroup());
                                newCondition.setConditionType(standardCondition.getConditionType());
                                newCondition.setConditionComment(standardCondition.getConditionComment());
                                newCondition.setImpactCode(standardCondition.getImpactCode());
                                newCondition.setConditionStatus(cStatus)
                                newCondition.setAuditStatus("A");
                                newCondition.setIssuedByUser(systemUserObj);
                                newCondition.setIssuedDate(javautilDate);

                                newCondition.setEffectDate(aa.util.parseDate(effFromDt));
                                newCondition.setExpireDate(aa.util.parseDate(expDate));

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
                    newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                    newCondition.setEntityType("CONTACT");
                    newCondition.setEntityID(contSeqNum);
                    newCondition.setConditionDescription(standardCondition.getConditionDesc());
                    newCondition.setConditionGroup(standardCondition.getConditionGroup());
                    newCondition.setConditionType(standardCondition.getConditionType());
                    newCondition.setConditionComment(standardCondition.getConditionComment());
                    newCondition.setImpactCode(standardCondition.getImpactCode());
                    newCondition.setConditionStatus(cStatus)
                    newCondition.setAuditStatus("A");

                    newCondition.setIssuedByUser(systemUserObj);
                    newCondition.setIssuedDate(javautilDate);

                    newCondition.setEffectDate(aa.util.parseDate(effFromDt));
                    newCondition.setExpireDate(aa.util.parseDate(expDate));

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




function copyAddresstoCompactAddressforRefContact(refContactSeq, conType, conAddrType) {
    //var r = aa.people.getPeople(refContactSeq);

    var contactModel = getOutput(aa.people.getPeople(refContactSeq), "")

    var compactAddress = contactModel.getCompactAddress();
    var attributes = contactModel.getAttributes();
    var contactAddressModel = aa.env.getValue("ContactAddressModel");
    aa.print("--------------Contact Field--------------");
    aa.print("LastName = " + contactModel.getLastName());
    aa.print("FirstName = " + contactModel.getFirstName());
    aa.print("ContactType = " + contactModel.getContactType());
    aa.print("Phone1 = " + contactModel.getPhone1());
    aa.print("Email = " + contactModel.getEmail());
    aa.print("Phone2 = " + contactModel.getPhone2());
    aa.print("AddressLine1 = " + compactAddress.getAddressLine1());
    aa.print("AddressLine2 = " + compactAddress.getAddressLine2());
    aa.print("AddressLine3 = " + compactAddress.getAddressLine3());
    aa.print("City = " + compactAddress.getCity());
    aa.print("State = " + compactAddress.getState());
    aa.print("Zip = " + compactAddress.getZip());
    aa.print("Comment = " + contactModel.getComment());
    aa.print("BusinessName = " + contactModel.getBusinessName());

    if (contactAddressModel != "" && contactAddressModel != null) {
        aa.print("--------------Contact Address Field--------------");
        aa.print("EntityType = " + contactAddressModel.getEntityType());
        aa.print("EntityID = " + contactAddressModel.getEntityID());
        aa.print("AddressType = " + contactAddressModel.getAddressType());
        aa.print("EffectiveDate = " + contactAddressModel.getEffectiveDate());
        aa.print("ExpirationDate = " + contactAddressModel.getExpirationDate());
        aa.print("Recipient = " + contactAddressModel.getRecipient());
        aa.print("FullAddress = " + contactAddressModel.getFullAddress());
        aa.print("AddressLine1 = " + contactAddressModel.getAddressLine1());
        aa.print("AddressLine2 = " + contactAddressModel.getAddressLine2());
        aa.print("AddressLine3 = " + contactAddressModel.getAddressLine3());
        if (contactAddressModel.getAddressType().toUpperCase().equals(conAddrType.toUpperCase())) {
            var contactAddressPKModel = contactAddressModel.getContactAddressPK();
            var auditModel = contactAddressModel.getAuditModel();

            if (contactAddressPKModel != "" && contactAddressPKModel != null) {
                aa.print("ServiceProviderCode = " + contactAddressPKModel.getServiceProviderCode());
                aa.print("AddressID = " + contactAddressPKModel.getAddressID());

            }

            compactAddress.setAddressLine1(contactAddressModel.getAddressLine1());

            compactAddress.setAddressLine2(contactAddressModel.getAddressLine2());
            compactAddress.setAddressLine3(contactAddressModel.getAddressLine3());
            compactAddress.setCity(contactAddressModel.getCity());
            compactAddress.setState(contactAddressModel.getState());
            compactAddress.setZip(contactAddressModel.getZip());

            contactModel.setCompactAddress(compactAddress);

            //Update
            var editContactResult = aa.people.editPeople(contactModel);

            if (editContactResult.getSuccess()) {
                logDebug("Success");
            }
            else {
                logDebug("**ERROR:  " + editContactResult.getErrorMessage());
            }
        }
    }
}

function findRefContactForCap(conType) { // For the current cap, finds the reference contact seq for the type of contact specified

    itemCap = capId;

    if (arguments.length == 2) {
        itemCap = arguments[1]; // use cap ID specified in args
    }

    var resultRefContactNumber = null;
    capContactResult = aa.people.getCapContactByCapID(itemCap);
    if (capContactResult.getSuccess()) {
        Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
            var theContact = Contacts[yy].getCapContactModel();

            if (theContact.getContactType().toUpperCase().equals(conType.toUpperCase())) {
                var peopleModel = theContact.getPeople();
                resultRefContactNumber = theContact.getRefContactNumber();
                return resultRefContactNumber
            }
            else {
            }
        }
    }
    else {
        logDebug("Could not retrieve record contacts: " + capContactResult.getErrorType() + ":" + capContactResult.getErrorMessage());
        return resultRefContactNumber;
    }
}


// - CALLED EXTERNALLY

function putConditionOnRefContact(conType, cType, cDesc, fromDate, toDate, cStat) {

    itemCap = capId;

    var refContactNumber = findRefContactForCap(conType);

    addContactStdConditionWithDates(refContactNumber, cType, cDesc, fromDate, toDate, cStat);
}

function copyAddressOnRefContact(conType, cType) {

    var contactModel = aa.env.getValue("ContactModel");
    var refContactNumber = contactModel.getContactSeqNumber();

    copyAddresstoCompactAddressforRefContact(refContactNumber, conType, cType);

}


function putEnforcementConditionOnRefContact(conType, cCondType, cCondDesc, fromDate, toDate, cStatus, cShortComment, cLongComment) {

    var refContactNumber = findRefContactForCap(conType);
	//aa.print ("Reference Contact Seq:" + refContactNumber);
    addEnforcementCondition(refContactNumber, cCondType, cCondDesc, fromDate, toDate, cStatus, cShortComment, cLongComment);

}

function getActiveHoldingsForRovkation(peopleSequenceNumber) {
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
            if (newActiveTag.isActive()) {
                availableActiveItems.push(newActiveTag);
            }
        }
    }
    return availableActiveItems;
}

function revokeRecord(itemCap) {
    //Update Status
    updateTagStatus("Revoked", "Revoked", itemCap);

    closeTaskForRec("Report Game Harvest", "", "", "", "", itemCap);
    closeTaskForRec("Void Document", "", "", "", "", itemCap);
    closeTaskForRec("Revocation", "Revoked", "", "", "", itemCap);
    closeTaskForRec("Suspension", "", "", "", "", itemCap);
}

function createEnforcemrntCondition() {
    var isRevokeFishing = (AInfo["Revoke Fishing"] == "CHECKED");
    var isRevokeHunting = (AInfo["Revoke Hunting"] == "CHECKED");
    var isRevokeTrapping = (AInfo["Revoke Trapping"] == "CHECKED");
    //logDebug(isRevokeFishing);
    //logDebug(isRevokeHunting);
    //logDebug(isRevokeTrapping);
    //logDebug(AInfo["Enforcement Type"]);

    if (AInfo["Enforcement Type"] == "Revocation") {
        if (isRevokeTrapping) {
            //Condition on the Enforcement Record Type
            addStdCondition("Revocation", "Trapping Revocation");
            //Conditions on Reference Contact - AA only conditions
            putEnforcementConditionOnRefContact("Individual", "Revocation", "Trapping Revocation", AInfo["Start Date"], AInfo["End Date"], "Revocation in Force", AInfo["Reason"],AInfo["Narrative Description"]);
            //Conditions on Reference Contact - ACA only conditions
            // putEnforcementConditionOnRefContact("Individual", "Contact DEC", "Contact DEC (RT)", AInfo["Start Date"], AInfo["End Date"], "Revocation in Force", AInfo["Reason"], AInfo["Narrative Description"]);
        }
		
        if (isRevokeHunting) {
            //Condition on the Enforcement Record Type
            addStdCondition("Revocation", "Hunting Revocation");
            //Conditions on Reference Contact - AA only conditions
            putEnforcementConditionOnRefContact("Individual", "Revocation", "Hunting Revocation", AInfo["Start Date"], AInfo["End Date"], "Revocation in Force", AInfo["Reason"], AInfo["Narrative Description"]);
            //Conditions on Reference Contact - ACA only conditions
            //putEnforcementConditionOnRefContact("Individual", "Contact DEC", "Contact DEC (RH)", AInfo["Start Date"], AInfo["End Date"], "Revocation in Force", AInfo["Reason"], AInfo["Narrative Description"]);
        }
        if (isRevokeFishing) {
            //Condition on the Enforcement Record Type
            addStdCondition("Revocation", "Fishing Revocation");
            //Conditions on Reference Contact - AA only conditions
            putEnforcementConditionOnRefContact("Individual", "Revocation", "Fishing Revocation", AInfo["Start Date"], AInfo["End Date"], "Revocation in Force", AInfo["Reason"], AInfo["Narrative Description"]);
            //Conditions on Reference Contact - ACA only conditions
            //putEnforcementConditionOnRefContact("Individual", "Contact DEC", "Contact DEC (RF)", AInfo["Start Date"], AInfo["End Date"], "Revocation in Force", AInfo["Reason"], AInfo["Narrative Description"]);
        }
		

    } else if (AInfo["Enforcement Type"] == "Suspension") {
        //Condition on the Enforcement Record Type
        addStdCondition("Suspension", "Suspension of Privileges");
        //Conditions on Reference Contact - AA only conditions
        putEnforcementConditionOnRefContact("Individual", "Suspension", "Suspension of Privileges", AInfo["Start Date"], AInfo["End Date"], "Suspension in Force", AInfo["Reason"], AInfo["Narrative Description"]);
        //Conditions on Reference Contact - ACA only conditions
        //putEnforcementConditionOnRefContact("Individual", "Contact DEC", "Contact DEC (SP)", AInfo["Start Date"], AInfo["End Date"], "Suspension in Force", AInfo["Reason"], AInfo["Narrative Description"]);
    }
}

function revokeActiveHoldings() {
    if (AInfo["Revoke Hunting"] == "CHECKED" || AInfo["Revoke Fishing"] == "CHECKED" || AInfo["Revoke Trapping"] == "CHECKED") {
        var peopleSequenceNumber = findRefContactForCap("Individual");

        var validRecArray;
        var itemCap;
        var availableActiveItems = getActiveHoldingsForRovkation(peopleSequenceNumber);
        for (var tidx in availableActiveItems) {
            var tObj = availableActiveItems[tidx];
            if (AInfo["Revoke Hunting"] == "CHECKED") {
                validRecArray = getRevokHuntRecTypeArray();
                if (exists(tObj.RecordType, validRecArray)) {
                    itemCap = getCapIdBycapIDString(tObj.itemCapId + "");
                    revokeRecord(itemCap);
                }
            }

            if (AInfo["Revoke Fishing"] == "CHECKED") {
                validRecArray = getRevokFishRecTypeArray();
                if (exists(tObj.RecordType, validRecArray)) {
                    itemCap = getCapIdBycapIDString(tObj.itemCapId + "");
                    revokeRecord(itemCap);
                }
            }

            if (AInfo["Revoke Trapping"] == "CHECKED") {
                validRecArray = getRevokTrapRecTypeArray();
                if (exists(tObj.RecordType, validRecArray)) {
                    itemCap = getCapIdBycapIDString(tObj.itemCapId + "");
                    revokeRecord(itemCap);
                }
            }
        }
    }
}
