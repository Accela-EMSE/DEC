var myCapId = "14CAP-00000-001YE"
var myUserId = "PUBLICUSER94336"
var startDate = new Date();
var startTime = startDate.getTime();			// Start timer

//wfTask = "License Issuance";	
//wfStatus = "Issued";			
//aa.env.setValue("EventName","WorkflowTaskUpdateAfter");
aa.env.setValue("EventName","ApplicationSubmitAfter");

var runEvent = false; // set to false if you want to roll your own code here in script test
/* master script code don't touch */ var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));	}	eval(getScriptText("INCLUDES_CUSTOM"));if (documentOnly) {	doStandardChoiceActions(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName){	var servProvCode = aa.getServiceProviderCode();	if (arguments.length > 1) servProvCode = arguments[1]; vScriptName = vScriptName.toUpperCase();		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");		return emseScript.getScriptText() + "";			} catch(err) {		return "";	}} logGlobals(AInfo); if (runEvent && doStdChoices) doStandardChoiceActions(controlString,true,0); if (runEvent && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  logDebug(z);
//
// User code goes here
//capId = aa.cap.getCapID("13EST","00000","03843").getOutput();

showDebug = 3;
logDebug("STARTSTART - 13TMP-003846 attempt 1");

aa.env.setValue("CurrentUserID","PUBLICUSER101684");

try {	
ctrcaForDMVRequest();
}
catch(err) {
	logDebug("ERROR: " + err.message + " In " + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
	}

logDebug("ENDEND - 13TMP-003846 attempt 1");


// end user code
aa.env.setValue("ScriptReturnCode", "1"); 	aa.env.setValue("ScriptReturnMessage", debug)


function asaForDMVRequest() {

	try {

		// add fees

		if (AInfo["Add Lifetime to Driver License Re-Issue Immediately"] == "CHECKED") {
			addFee("FEE_DL_1", "FEE_LIFETM_DL_IMM_OPTIN", "FINAL", 1, "Y");
		}
		if (AInfo["Add Lifetime to Non-Driver License Re-Issue Immediately"] == "CHECKED") {
			addFee("FEE_DL_3", "FEE_LIFETM_DL_IMM_OPTIN", "FINAL", 1, "Y");
		}
		if (AInfo["Add Lifetime to Driver License on Renewal"] == "CHECKED") {
			addFee("FEE_DL_2", "FEE_LIFETM_DL_IMM_OPTIN", "FINAL", 1, "Y");
		}
		// associate contact

		refCon = getRefConByPublicUserSeq(aa.publicUser.getPublicUserByPUser(aa.env.getValue("CurrentUserID")).getOutput().getUserSeqNum());
		var refContactId = refCon.getContactSeqNumber() * 1;
		var refCon = getOutput(aa.people.getPeople(refContactId), " ");

		//Get reference contact address list so it copies down to the record
		var caSearchModel = aa.address.createContactAddressModel().getOutput();
		caSearchModel.setEntityID(refContactId);
		caSearchModel.setEntityType("CONTACT");
		var caResult = aa.address.getContactAddressList(caSearchModel.getContactAddressModel()).getOutput();
		if (caResult != null) {
			var caList = aa.util.newArrayList();
			for (var cax in caResult) {
				caList.add(caResult[cax].getContactAddressModel());
			}
			refCon.setContactAddressList(caList);
		}

		var linkRefContactResult = aa.people.createCapContactWithRefPeopleModel(capId, refCon);
		editContactType("Individual", "Applicant");
		editContactType("Organization", "Applicant");

	} catch (err) {
		logDebug(" ERROR : " + err.message + " In " + " Line " + err.lineNumber);
		logDebug(" Stack : " + err.stack);
	}
}

function ctrcaForDMVRequest() {

	try {

		var childId = null;

		// create children

		if (AInfo["Add Lifetime to Driver License Re-Issue Immediately"] == "CHECKED") {
			childId = createChild("Licenses", "Tag", "Document", "Driver License Immediate", "");
		}
		if (AInfo["Add Lifetime to Non-Driver License Re-Issue Immediately"] == "CHECKED") {
			childId = createChild("Licenses", "Tag", "Document", "Driver License Immediate", "");
		}
		if (AInfo["Add Lifetime to Driver License on Renewal"] == "CHECKED") {
			childId = createChild("Licenses", "Tag", "Document", "Driver License Renewal", "");
		}

		if (childId) {
		     updateAppStatus("Active", "Active", childId);
			//transferFeesAndPayments(capId, childId);
		}

	} catch (err) {
		logDebug(" ERROR : " + err.message + " In " + " Line " + err.lineNumber);
		logDebug(" Stack : " + err.stack);
	}
}

function editContactType(existingType, newType) {
//Function will change contact types from exsistingType to newType,
//optional paramter capID{
var updateCap = capId
	if (arguments.length == 3)
		updateCap = arguments[2]

			capContactResult = aa.people.getCapContactByCapID(updateCap);
	if (capContactResult.getSuccess()) {
		Contacts = capContactResult.getOutput();
		for (yy in Contacts) {
			var theContact = Contacts[yy].getCapContactModel();
			if (theContact.getContactType() == existingType) {
				theContact.setContactType(newType);
				aa.people.editCapContact(theContact);
				logDebug(" Contact for " + theContact.getFullName() + " Updated to " + newType);
			}
		}
	}
}

function transferFeesAndPayments(sourceCapId, targetCapId) {
	//
	// Step 1: Unapply payments from the Source
	//
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
			if (z.getSuccess()) {
				logDebug("Refund applied");
			} else {
				logDebug("Error applying refund " + z.getErrorMessage());
			}
		}
	}

	//
	// Step 2: add the fees to the target and void from the source
	//

	feeA = loadFees()

		for (x in feeA) {
			thisFee = feeA[x];
			logDebug("status is " + thisFee.status)
			if (thisFee.status == "INVOICED") {
				addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "Y", targetCapId)
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
					logDebug("**ERROR: Invoicing the fee items voided " + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
			}

		}

		//
		// Step 3: transfer the funds from Source to Target
		//

		var unapplied = paymentGetNotAppliedTot()

		var xferResult = aa.finance.makeFundTransfer(capId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, unapplied, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
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
										applyAmt = thisTFee.getFee() // use balance here?

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
