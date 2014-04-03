/**
 * Accela Automation
 * $Id: ReportRunBeforeInACA.js 2013-06-28 BEYOND SOFT\kay.li $
 *
 * Description:
 * ReportRunBeforeInACA.js the EMSE Script for 12ACC-00792 Support for Authorized Agent Role in ACA
 *
 * Notes:
 *
 * Revision History:
 * 2013-06-28     Kay Li	Initial Version
 */
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var documentOnly = false; // Document Only -- displays hierarchy of std choice steps
var disableTokens = false; // turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var enableVariableBranching = false; // Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99; // Maximum number of std choice entries.  Entries must be Left Zero Padded
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var cancel = false;
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag
var feeSeqList = new Array(); // invoicing fee list
var paymentPeriodList = new Array(); // invoicing pay periods
var emailText = "";
var maxSeconds = 4.5 * 60; // number of seconds allowed for batch processing, usually < 5*60
var capId = null;
var sysDate = aa.date.getCurrentDate();
var systemUserObj = aa.person.getUser("ADMIN").getOutput(); // Current User Object
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}
/*------------------------------------------------------------------------------------------------------/
| END Includes
/------------------------------------------------------------------------------------------------------*/

var params = aa.env.getParamValues();
var keys =  params.keys();
var key = null;
while(keys.hasMoreElements())
{
 key = keys.nextElement();
 eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
 aa.debug("REPORTRUNBEFOREINACA","Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

var reportInfo = aa.env.getValue("ReportInfoModel");
var reportDetail = aa.env.getValue("ReportDetailModel");

//defind reprint log ASIT name.
var rePrintLogTableName = "REPRINT LOG";
var maxReprintTimes = 10;

if (reportDetail) {
	// get max reprint time from report configuration.
	maxReprintTimes = reportDetail.getReprintLimit4ACA();
}

var capIDModel;

aa.debug("REPORTRUNBEFOREINACA", "reportInfo = " + reportInfo);

if (reportInfo) {
	var reportParameters = reportInfo.getReportParameters();
	var callerId = reportInfo.getCallerId();
	aa.debug("REPORTRUNBEFOREINACA", "callerId = " + callerId);
	var agentId = getAgentID(aa.publicUser.getPublicUser(parseInt(callerId.replace("PUBLICUSER",""))).getOutput().getUserID());
	aa.debug("REPORTRUNBEFOREINACA", "agentId = " + agentId);
	var reportName = reportDetail.getReportName();
	aa.debug("REPORTRUNBEFOREINACA", "reportName = " + reportName);
	var edmsEntityModel = reportInfo.getEDMSEntityIdModel();
	aa.debug("REPORTRUNBEFOREINACA", "edmsEntityModel = " + edmsEntityModel);

	if (reportName == "ANS" && agentId) {
		var rs = aa.wsConsumer.consume("http://infweb.licensecenter.ny.gov/NYSELS-DEC-ANSREGWS/services/ReANS?wsdl", "regANS", ["DEC_ACH", agentId]);
		if (rs.getSuccess()) {
			var resp = rs.getOutput();
			aa.debug("REPORTRUNBEFOREINACA", "resp[0] = " + resp[0]);
		} else {
			aa.debug("REPORTRUNBEFOREINACA", "web service call failed: " + rs.getErrorMessage());
		}
	}

	if (reportName == "License Tags") {
		if (edmsEntityModel) {
			// build cap id model
			capIDModel = getCapIdBycapIDString(edmsEntityModel.getCapId());
			aa.debug("REPORTRUNBEFOREINACA", "capIDModel = " + capIDModel);
			if (capIDModel) {
				var result = aa.appSpecificTableScript.getAppSpecificTableModel(capIDModel, rePrintLogTableName);
				if (result.getSuccess()) {
					var asit = result.getOutput().getAppSpecificTableModel();
					if (asit.getTableField() != null && asit.getTableField().size() > 0) {
						// because we insert one row into reprint log table every print,
						// so the print times should be the record numbers in print log table.
						var rePrintTimes = asit.getTableField().size() / asit.getColumns().size();
						aa.debug("REPORTRUNBEFOREINACA", "rePrintTimes = " + rePrintTimes);

						// commenting out for now see 13ACC-12217
						//
						afterApplicationPrintFailDebug(capIDModel, parseInt(rePrintTimes));
						var appSpecInfoResult = aa.appSpecificInfo.editSingleAppSpecific(capIDModel, "A_numberOfTries", rePrintTimes, null);

						// if already used all the reprint times, return error message and code.
						if (parseInt(rePrintTimes) + 1 > maxReprintTimes) {
							aa.env.setValue("ScriptReturnMessage", "You have reached the maximum times you can reprint.  Please select the reason it did not print below.");
							aa.env.setValue("ScriptReturnCode", "-1");
						}
					}
				}
			}
		}
	}
}

function afterApplicationPrintFailDebug(itemCapId, numberOfTries) {
	var isVoidAll = (numberOfTries > 2);
	var itemCap = aa.cap.getCap(itemCapId).getOutput();
	//var altId = itemCapId.getCustomID();
	//var status = itemCap.getCapStatus();
	var contactTypeToAttach = ''; //Balnk = All
	appTypeString = itemCap.getCapType();

	if (appTypeString == 'Licenses/Annual/Application/NA') {}
	else if (appTypeString == 'Licenses/Sales/Reprint/Documents') {
		contactTypeToAttach = "Individual"
	} else if (appTypeString == 'Licenses/Sales/Upgrade/Lifetime') {
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

	aa.debug("afterApplicationPrintFailDebug", "peopleSequenceNumber = " + peopleSequenceNumber);
	salesAgentInfoArray = getAgentInfoByPeopleSeqNum(peopleSequenceNumber);

	var searchAppTypeString = "Licenses/*/*/*";
	var capArray = getChildren(searchAppTypeString, itemCapId);
	if (capArray == null) {
		aa.debug("afterApplicationPrintFailDebug", "no children found");
		return;
	}

	var appSpecInfoResult = aa.appSpecificInfo.editSingleAppSpecific(itemCapId, "A_numberOfTries", numberOfTries + "", null);

	for (y in capArray) {
		var childCapId = capArray[y];
		var currcap = aa.cap.getCap(childCapId).getOutput();
		appTypeString = currcap.getCapType().toString();
		var ata = appTypeString.split("/");
		aa.debug("afterApplicationPrintFailDebug", "appTypeString = " + appTypeString);

		aa.debug("afterApplicationPrintFailDebug", "isVoidAll = " + isVoidAll);
		aa.debug("afterApplicationPrintFailDebug", "currcap.getCapStatus() = " + currcap.getCapStatus());
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
					} else {
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

function getAgentID(userId) {
	var agentId = null;

	var uObj = new USEROBJ();
	uObj.userId = userId;
	uObj.userModel = uObj.getUserModel();
	uObj.setUserModelAttributes();
	return uObj.getAuthAgentPeopleSeqNum();
	
}
