/*
   ACA ONLOAD FILL FROM CONTACT
*/

showMessage=false;
showDebug=false;
var isSuspended = copyContactAppSpecificToRecordAppSpecific();
if (isSuspended) {
	cancel = true;
	showMessage=true;
	comment(MSG_SUSPENSION);
	}

aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER CARCASSTAG
*/

showMessage=false;
showDebug=false;
cancel = false;
loadHarvestInfo();
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER LICYEAR
*/

showMessage=false;
showDebug=false;
createActiveHoldingTable();
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER OTHERSALES
*/

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_SELECTED_FEES);
SetOtherformForSelectedLics(frm);
addFeeAndSetAsitForFeetxfer(frm);
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER PRINTSELCT
*/

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
addRepritFees();
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER SALESSELECT
*/

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_SELECTED_FEES);
SetformForSelectedLics(frm);
addFeeAndSetAsitForFeetxfer(frm);
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER TBL UPDATE
*/

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
SetTableStringFields();
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER UGRDCNT
*/

showMessage=false;
showDebug=false;
cancel = false;
var isNotValidMsg = loadUpgradeLic();
if (isNotValidMsg  !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	} else {
	aa.env.setValue("CapModel",cap);
	}
/*
   ACA ONSUBMIT AFTER UGRDSTEP2
*/

showMessage=false;
showDebug=false;
cancel = false;
addFeeForUpgrade();
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT AFTER VDSLSTEP1
*/

showMessage=false;
showDebug=false;
cancel = false;
loadDocumentToVoid();
aa.env.setValue("CapModel",cap);
/*
   ACA ONSUBMIT BEFORE CARCASSTAG
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidHarvestinfo('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE PRINTSELCT
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidReprintDocuments('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE PRINTSTEP1
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidReprintDocuments('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE SALESELECT
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidBuyRecord('Step3');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE TBL UPDATE
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidBuyRecord('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE UGRDSTEP1
*/

showMessage=false;
showDebug=false;
cancel = false;
var isNotValidMsg = isValidLicesesToupgrad('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE UGRDSTEP2
*/

showMessage=false;
showDebug=false;
cancel = false;
var isNotValidMsg = isValidLicesesToupgrad('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE VDSLSTEP1
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidVoidSales('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE VDSLSTEP2
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidVoidSales('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ACA ONSUBMIT BEFORE VERIFYTAG
*/

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidHarvestinfo('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}
/*
   ASA:Licenses/Other/Sportsmen/Game Harvest
*/

prefix = "CMN";
if (!publicUser) {
	branch("EMSE_VariableBranching");
	}
/*
   ASA:Licenses/WMU/Process/Create
*/

prefix = "WTUA";
branch("EMSE_VariableBranching");
/*
   ASIUA:Licenses/WMU/Process/Create
*/

processMutpleupdate();
/*
   AdditionalInfoUpdateAfter
*/

prefix = "AIUA";
branch("EMSE_VariableBranching");
/*
   AdditionalInfoUpdateBefore
*/

prefix = "AIUB";
branch("EMSE_VariableBranching");
/*
   ApplicationConditionAddAfter
*/

prefix = "ACAA";
branch("EMSE_VariableBranching");
/*
   ApplicationSpecificInfoUpdateAfter
*/

prefix = "ASIUA";
branch("EMSE_VariableBranching");
/*
   ApplicationSpecificInfoUpdateBefore
*/

prefix = "ASIUB";
branch("EMSE_VariableBranching");
/*
   ApplicationSpecificInformationTableUpdateAfter
*/

prefix = "ASITUA";
branch("EMSE_VariableBranching");
/*
   ApplicationStatusUpdateAfter
*/

prefix = "ASUA";
branch("EMSE_VariableBranching");
branch ("CMN_CREATE_ENFORCEMENT_CONDITIONS");
/*
   ApplicationStatusUpdateBefore
*/

prefix = "ASUB";
branch("EMSE_VariableBranching");
/*
   ApplicationSubmitAfter
*/

prefix = "ASA";
branch("EMSE_VariableBranching");
/*
   ApplicationSubmitBefore
*/

prefix = "ASB";
branch("EMSE_VariableBranching");
/*
   CMN:Licenses/*/*/*:SYNC_REF_CONTACT
*/

iArr = new Array();
// attributes to ignore;
contactTypeArray = new Array();
// ignored since we are using REF_CONTACT_CREATION_RULES;
createRefContactsFromCapContactsAndLink(capId,contactTypeArray,iArr,false,false,comparePeopleStandard);
/*
   CMN:Licenses/Other/Sportsmen/Game Harvest
*/

showDebug = false;
showMessage=false;
if (balanceDue == 0) {
	closeTask ("Review", "Approved","","");
	}

updateTag();
/*
   CMN:Licenses/WMU/Process/Create
*/

var isSucess = true;
showMessage=true;
branch('WTUA:Licenses/WMU/Process/Create');
/*
   CMN_CREATE_ENFORCEMENT_CONDITIONS
*/

showDebug = true;
showMessage = true;
createEnforcemrntCondition();
revokeActiveHoldings();
/*
   CMN_CREATE_LICENSE
*/

frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_CTRC);
if (appTypeString == 'Licenses/Annual/Application/NA') {
	SetformForSelectedLics(frm);
	}

if (appTypeString == 'Licenses/Other/Sales/Application') {
	SetOtherformForSelectedLics(frm);
	}

issueSelectedSalesItems(frm);
/*
   CMN_MOVE_WKFLOW_AFTER_PAYMENT
*/

if (balanceDue == 0) {
	closeTask ("Review", "Approved","","");
	}
/*
   CTRCA:Licenses/Annual/Application/NA
*/

showDebug = false;
showMessage=false;
branch ("CMN_CREATE_LICENSE");
/*
   CTRCA:Licenses/Other/Sales/Application
*/

showDebug = false;
showMessage=false;
branch ("CMN_CREATE_LICENSE");
/*
   CTRCA:Licenses/Other/Sportsmen/Game Harvest
*/

prefix = "CMN";
branch("EMSE_VariableBranching");
/*
   CTRCA:Licenses/Sales/Reprint/Documents
*/

showDebug = false;
showMessage=false;
ReprintDocuments();
/*
   CTRCA:Licenses/Sales/Upgrade/Lifetime
*/

showDebug = false;
showMessage=false;
upgradeLifetimeLic();
/*
   CTRCA:Licenses/Sales/Void/Documents
*/

showDebug = false;
showMessage=false;
VoidsSales();
/*
   ContactAddAfter
*/

prefix = "CAA";
branch("EMSE_VariableBranching");
showMessage=true;
showDebug=true;
createRefContactsFromCapContactsAndLink(capId,null,null,false,true,comparePeopleGeneric);
/*
   ContactAddBefore
*/

prefix = "CAB";
branch("EMSE_VariableBranching");
/*
   ContactEditAfter
*/

prefix = "CEA";
branch("EMSE_VariableBranching");
/*
   ContactEditBefore
*/

/*
   ContactRemoveAfter
*/

prefix = "CRA";
branch("EMSE_VariableBranching");
/*
   ContactRemoveBefore
*/

prefix = "CRB";
branch("EMSE_VariableBranching");
/*
   ConvertToRealCapAfter
*/

prefix = "CTRCA";
branch("EMSE_VariableBranching");
/*
   DocumentUploadAfter
*/

prefix = "DUA";
branch("EMSE_VariableBranching");
/*
   DocumentUploadBefore
*/

/*
   EMSE:ASI Copy Exceptions
*/

/*
   EMSE:GlobalFlags
*/

if (matches(currentUserID,"ADMIN", "LGAWAD")) {
	showDebug = 3;
	} else {
	showDebug = false;
	/* enable debugging on on scripts for ADMIN userID */;
	}

LICENSESTATE = "NY";
/*
   EMSE:LicProfLookup
*/

logDebug("Using LICENSESTATE = " + LICENSESTATE + " from EMSE:GlobalFlags");
//Issue State;
LICENSETYPE = "";
//License Type to be populated;
licCapId = null;
isNewLic = false;
licIDString = null;
licObj = null;
licCap = null;
branch("EMSE:LicProfLookup:getLicenses");
//Get License CAP;
if (licCapId !=null) {
	branch("EMSE:LicProfLookup:getLicenseType");
	}

licObj = licenseProfObject(licIDString,LICENSETYPE);
//Get LicArray;
if (!licObj.valid && lookup("LICENSED PROFESSIONAL TYPE",LICENSETYPE) != null) {
	branch("EMSE:LicProfLookup:CreateLP");
	licObj = licenseProfObject(licIDString,LICENSETYPE );
	}

if (licObj.valid) {
	branch("EMSE:LicProfLookup:UpdateLP");
	} else {
	logDebug("LP Not found to update");
	}
/*
   EMSE:LicProfLookup:CreateLP
*/

var vNewLic = aa.licenseScript.createLicenseScriptModel();
vNewLic.setAgencyCode(aa.getServiceProviderCode());
vNewLic.setAuditDate(sysDate);
vNewLic.setAuditID(currentUserID);
vNewLic.setAuditStatus("A");
vNewLic.setLicenseType(LICENSETYPE);
vNewLic.setLicState(LICENSESTATE);
vNewLic.setStateLicense(licIDString);
aa.licenseScript.createRefLicenseProf(vNewLic);
var tmpLicObj = licenseProfObject(licIDString,LICENSETYPE);
if (tmpLicObj.valid) {
	isNewLic = true;
	}
/*
   EMSE:LicProfLookup:UpdateLP
*/

branch("EMSE:LicProfLookup:UpdateLP:BaseFields");
branch("EMSE:LicProfLookup:UpdateLP:ApplicationStatus");
if (licObj.updateRecord()) {
	logDebug("LP Updated Successfully");
	} else {
	logDebug("LP Update Failed");
	}
/*
   EMSE:LicProfLookup:UpdateLP:ApplicationStatus
*/

licObj.refLicModel.setBusinessName2(licCapStatus);
logDebug("Lic Cap Status: " + licCapStatus);
/*
   EMSE:LicProfLookup:UpdateLP:BaseFields
*/

licObj.refLicModel.setState(LICENSESTATE);
licObj.refLicModel.setLicenseBoard(LICENSETYPE);
licObj.refLicModel.setLicenseIssueDate(licCap.getFileDate());
var expObj = null;
var expDt = null;
var expObjRes = aa.expiration.getLicensesByCapID(licCapId);
if(expObjRes.getSuccess()) var expObj = expObjRes.getOutput();
if (expObj != null) {
	expDt = aa.date.parseDate(expObj.getExpDateString());
	}

if (expDt != null) {
	licObj.refLicModel.setLicenseExpirationDate(expDt);
	//Expiration Date;
	}

if (licCapTypeArr[1] == "Business") {
	licObj.refLicModel.setLicenseBoard(getAppSpecific("Business Type",licCapId));
	} else {
	licObj.refLicModel.setLicenseBoard(LICENSETYPE);
	}

if (licObj.updateFromRecordContactByType(licCapId,"",true,false);) {
	logDebug("LP Updated from Primary Contact");
	} else {
	logDebug("LP Failed to Update from Primary Contact trying License Holder");
	if(licObj.updateFromRecordContactByType(licCapId,"License Holder",true,false)) logDebug("Updated from License Holder");
	else logDebug("Couldn't Update Contact Info");
	}

if (licObj.updateFromAddress(licCapId)) {
	logDebug("LP Address Updated from License Address");
	} else {
	logDebug("LP Address Failed to update from License Address");
	}

if (getAppSpecific("Doing Business As (DBA) Name",licCapId)) {
	licObj.refLicModel.setBusinessName(getAppSpecific("Doing Business As (DBA) Name",licCapId) );
	}
/*
   EMSE:LicProfLookup:getLicenseType
*/

if (licCapId !=null) {
	licIDString = licCapId.getCustomID();
	}

if (licCapId !=null) {
	licCap = aa.cap.getCap(licCapId).getOutput();
	licCapType = licCap.getCapType().toString();
	licCapTypeArr = licCapType.split("/");
	licCapStatus = licCap.getCapStatus();
	}

if (licCapId !=null) {
	LICENSETYPE = licCapTypeArr[2];
	}
/*
   EMSE:LicProfLookup:getLicenses
*/

var searchCap = capId;
var tmpId = capId;
var prjArr = null;
if (appMatch("*/*/*/License")) {
	var childArr = getChildren("*/*/*/Application");
	if(childArr != null) searchCap = childArr[0];
	}

capId = tmpId;
var vRelationType = "R";
if(appMatch("*/*/*/Renewal")) vRelationType="Renewal";
var prjArrRes = aa.cap.getProjectByChildCapID(searchCap,vRelationType,null);
if(prjArrRes.getSuccess()) prjArr = prjArrRes.getOutput();
if (prjArr != null) {
	for(prj in prjArr) if(appMatch("*/*/*/License",prjArr[prj].getProjectID())) licCapId = prjArr[prj].getProjectID();
	}

if (licCapId == null && appMatch("*/*/*/License")) {
	licCapId = capId;
	//In the event license has no application;
	}

if (licCapId != null) {
	licCapId = aa.cap.getCapID(licCapId.getID1(),licCapId.getID2(),licCapId.getID3()).getOutput();
	logDebug("Got Lic Cap " + licCapId.getCustomID());
	}
/*
   EMSE_VariableBranching
*/

if (matches(currentUserID, "ADMIN")) {
	showDebug = 3;
	showMessage= true;
	branch("EMSE:GlobalFlags");
	} else {
	showDebug = false;
	showMessage= true;
	branch("EMSE:GlobalFlags");
	}

branch(prefix + ":" + appTypeArray[0] + "/*/*/*");
branch(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
branch(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
branch(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
branch(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
branch(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
branch(prefix + ":" + appTypeString);
/*
   FeeAssessAfter
*/

prefix = "FAA";
branch("EMSE_VariableBranching");
/*
   FeeEstimateAfter4ACA
*/

prefix = "FEA";
branch("EMSE_VariableBranching");

/*
   InspectionResultModifyAfter
*/

prefix = "IRSA";
branch("EMSE_VariableBranching");
/*
   InspectionResultModifyBefore
*/

prefix = "IRSB";
branch("EMSE_VariableBranching");
/*
   InspectionResultSubmitAfter
*/

prefix = "IRSA";
branch("EMSE_VariableBranching");
/*
   InspectionResultSubmitBefore
*/

prefix = "IRSB";
branch("EMSE_VariableBranching");
/*
   InspectionScheduleAfter
*/

prefix = "ISA";
branch("EMSE_VariableBranching");
/*
   InspectionScheduleBefore
*/

prefix = "ISB";
branch("EMSE_VariableBranching");
/*
   InvoiceFeeAfter
*/

prefix = "IFA";
branch("EMSE_VariableBranching");
/*
   LIC: Document Requirement Item
*/

conditionType = "License Required Documents";
dr = r[x];
// passed from script, contains name of requirement which will match condition;
if (dr) {
	ccr = aa.capCondition.getStandardConditions(conditionType, dr).getOutput();
	}

if (dr && ccr.length > 0 && showList) {
	comment("<LI>" + dr + " : " + ccr[0].getPublicDisplayMessage() + "</LI>");
	}

if (dr && ccr.length > 0 && addConditions) {
	addStdCondition(conditionType,dr);
	}

if (dr && ccr.length > 0 && addTableRows) {
	row = new Array();
	row["Document Type"] = new asiTableValObj("Document Type",dr,"Y");
	row["How Submitted"]=new asiTableValObj("How Submitted","","N");
	row["Comments"] = new asiTableValObj("Comments","","N");
	conditionTable.push(row);
	asit = cap.getAppSpecificTableGroupModel();
	}
/*
   LicProfLookupSubmitAfter
*/

prefix = "LPLSA";
branch("EMSE_VariableBranching");
/*
   LicProfLookupSubmitBefore
*/

prefix = "LPLSB";
branch("EMSE_VariableBranching");
/*
   LicProfUpdateAfter
*/

prefix = "LPUA";
branch("EMSE_VariableBranching");
/*
   LicProfUpdateBefore
*/

prefix = "LPUB";
branch("EMSE_VariableBranching");
/*
   PaymentReceiveAfter
*/

branch ("CMN_MOVE_WKFLOW_AFTER_PAYMENT");
/*
   PaymentReceiveBefore
*/

prefix = "PRB";
branch("EMSE_VariableBranching");
/*
   REF_CONTACT_CREATION_RULES
*/

if (F) {
	}
/*
   RenewalInfoUpdateAfter
*/

prefix = "RIUA";
branch("EMSE_VariableBranching");
/*
   WTUA:Licenses/*/*/*
*/

closeTasksForTagAnditems(capId);
/*
   WTUA:Licenses/WMU/Process/Create
*/

logDebug("WTUA:Licenses/WMU/Process/Create");
var currWfStatus;
if (isTaskActive('Init')) {
	currWfStatus = 'Init';
	}

if (isTaskActive('Close Instant Lottery')) {
	currWfStatus = 'Close Instant Lottery';
	}

if (isTaskActive('Close IBP Lottery')) {
	currWfStatus = 'Close IBP Lottery';
	}

if (isTaskActive('Close FCFS Lottery')) {
	currWfStatus = 'Close FCFS Lottery';
	}

if (isTaskActive('Close Draw Processs')) {
	currWfStatus = 'Close Draw Processs';
	}

createDrawSettings(AInfo['License Year'], currWfStatus);
/*
   WorkflowTaskUpdateAfter
*/

prefix = "WTUA";
branch("EMSE_VariableBranching");
/*
   WorkflowTaskUpdateBefore
*/

prefix = "WTUB";
branch("EMSE_VariableBranching");
