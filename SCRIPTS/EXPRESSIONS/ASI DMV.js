var servProvCode = expression.getValue("$$servProvCode$$").value;
var aa = expression.getScriptRoot();
var vUserID = expression.getValue("$$userID$$").getValue();

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_EXPRESSIONS"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

var fldExplanation = expression.getValue("ASI::LIC_DMV::Explanation");
var fldDelay = expression.getValue("ASI::LIC_DMV::Add Lifetime to Driver License on Renewal");
var fldImmedNonDL = expression.getValue("ASI::LIC_DMV::Add Lifetime to Non-Driver License Re-Issue Immediately");
var fldImmedDL = expression.getValue("ASI::LIC_DMV::Add Lifetime to Driver License Re-Issue Immediately");
var form = expression.getValue("ASI::FORM");


try {
	refCon = getRefConByPublicUserSeq(aa.publicUser.getPublicUserByUserId(vUserID).getOutput().getUserSeqNum());
	
	if (refCon) {
		var peopleSequenceNumber = refCon.getContactSeqNumber()
        var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
        var tmpl = peopleModel.getTemplate();
		var useDL = false;
		var useNonDL = false;
		var alreadyRequested = false;
		var DLNum = peopleModel.getDriverLicenseNbr();
		var nonDLNum = peopleModel.getStateIDNbr();

		if (DLNum) useDL = true;
		if (!useDL && nonDLNum) useNonDL = true;
		
		var asitModel;
		var new_asit;
		var hasHoldings = false;
		var holdingMessage = "";
		var availableActiveItems = getActiveHoldings(peopleSequenceNumber, null);
		
		for (var tidx in availableActiveItems) {
			var tObj = availableActiveItems[tidx];
			if (tObj.RecordType == AA54_TAG_PRIV_PANEL || tObj.RecordType == AA09_LIFETIME_BOWHUNTING || tObj.RecordType == AA10_LIFETIME_FISHING || tObj.RecordType == AA11_LIFETIME_MUZZLELOADING || tObj.RecordType == AA12_LIFETIME_SMALL_AND_BIG_GAME || tObj.RecordType == AA13_LIFETIME_SPORTSMAN || tObj.RecordType == AA14_LIFETIME_TRAPPING) {
				if (hasHoldings) holdingMessage += "\n";
				hasHoldings = true;
				holdingMessage += tObj.Description;
				}
				
			if (tObj.RecordType == AA55_TAG_DRIV_LIC_IMM || tObj.RecordType == AA56_TAG_DRIV_LIC_REN) {
				alreadyRequested = true;
				}
			}
			
		if (!hasHoldings) holdingMessage = "You currently do not hold any lifetime licenses.";
		
		if (!useDL && !useNonDL) {
			holdingMessage 	= "You currently do not have a DMV ID on File";
			}
		else {
			if (useDL) holdingMessage += "\n\nDMV Driver License Number : " + DLNum;
			if (useNonDL) holdingMessage += "\n\nDMV Non-Driver License Number : " + nonDLNum;
			}
			
		if (alreadyRequested) {
			holdingMessage += "\n\nA request has already been submitted for this DMV ID.";
			}
			
		fldExplanation.setValue(holdingMessage);
        }
	else 
		{
		fldExplanation.setValue("no contact found");
		}
}
catch (err) {
	fldExplanation.setValue("an error occurred (" + vUserID + ") : " + err.message);
	}

fldExplanation.readOnly = true;
expression.setReturn(fldExplanation);

if (!alreadyRequested && hasHoldings && (useDL || useNonDL)) {
	if (useDL) {
		fldDelay.hidden = false;
		fldImmedNonDL.hidden = true;
		fldImmedDL.hidden = false;
		}
	else {
		fldDelay.hidden = false;
		fldImmedNonDL.hidden = false;
		fldImmedDL.hidden = true;
		}
	}
else {
	fldDelay.hidden = true;
	fldImmedNonDL.hidden = true;
	fldImmedDL.hidden = true; 
	}
	
var numChecked = 0; 
if (fldDelay.getValue().toUpperCase() == "CHECKED") {
	numChecked++;
	}
	
if (fldImmedNonDL.getValue().toUpperCase() == "CHECKED") {
	numChecked++;
	}

if (fldImmedDL.getValue().toUpperCase() == "CHECKED") {
	numChecked++;
	}
	
form.message = "";
form.blockSubmit = false;

if (numChecked > 1) {
	form.blockSubmit = true;
	form.message = "Can't continue.   Please select only one option.";
	}

if (fldImmedDL.getValue().toUpperCase() != "CHECKED" && fldImmedNonDL.getValue().toUpperCase() != "CHECKED" && fldDelay.getValue().toUpperCase() != "CHECKED") {
	form.blockSubmit = true;
	form.message = "Can't continue.   Please select an option.";
	}	
	
if (alreadyRequested) {
	form.blockSubmit = true;
	form.message = "Can't continue.  A request has already been submitted for this DMV ID.";
	}
	
	
expression.setReturn(fldDelay);
expression.setReturn(fldImmedNonDL);
expression.setReturn(fldImmedDL);
expression.setReturn(form);
