/*     ACA ONLOAD FILL FROM CONTACT     */

showMessage=false;
showDebug=false;
var isSuspended = copyContactAppSpecificToRecordAppSpecific();
if (isSuspended) {
	cancel = true;
	showMessage=true;
	comment(MSG_SUSPENSION);
	}

aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER CARCASSTAG     */

showMessage=false;
showDebug=false;
cancel = false;
loadHarvestInfo();
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER LICYEAR     */

showMessage=false;
showDebug=false;
createActiveHoldingTable();
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER OTHERSALES     */

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_SELECTED_FEES);
SetOtherformForSelectedLics(frm);
addFeeAndSetAsitForFeetxfer(frm);
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER PRINTSELCT     */

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
addRepritFees();
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER SALESSELECT     */

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_SELECTED_FEES);
SetformForSelectedLics(frm);
addFeeAndSetAsitForFeetxfer(frm);
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER TBL UPDATE     */

showMessage=false;
showDebug=false;
//branch("EMSE:GlobalFlags");
SetTableStringFields();
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER UGRDCNT     */

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

/*     ACA ONSUBMIT AFTER UGRDSTEP2     */

showMessage=false;
showDebug=false;
cancel = false;
addFeeForUpgrade();
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT AFTER VDSLSTEP1     */

showMessage=false;
showDebug=false;
cancel = false;
loadDocumentToVoid();
aa.env.setValue("CapModel",cap);

/*     ACA ONSUBMIT BEFORE CARCASSTAG     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidHarvestinfo('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE PRINTSELCT     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidReprintDocuments('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE PRINTSTEP1     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidReprintDocuments('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE SALESELECT     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidBuyRecord('Step3');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE TBL UPDATE     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidBuyRecord('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE UGRDSTEP1     */

showMessage=false;
showDebug=false;
cancel = false;
var isNotValidMsg = isValidLicesesToupgrad('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE UGRDSTEP2     */

showMessage=false;
showDebug=false;
cancel = false;
var isNotValidMsg = isValidLicesesToupgrad('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE VDSLSTEP1     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidVoidSales('Step1');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE VDSLSTEP2     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidVoidSales('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ACA ONSUBMIT BEFORE VERIFYTAG     */

showMessage=false;
showDebug=false;
var isNotValidMsg = isValidHarvestinfo('Step2');
if (isNotValidMsg !='') {
	cancel = true;
	showMessage=true;
	comment(isNotValidMsg);
	}

/*     ASA:Licenses/Other/Sportsmen/Game Harvest     */

prefix = "CMN";
if (!publicUser) {
	branch("EMSE_VariableBranching");
	}

/*     ASA:Licenses/WMU/Process/Create     */

prefix = "WTUA";
branch("EMSE_VariableBranching");

/*     ASIUA:Licenses/WMU/Process/Create     */

processMutpleupdate();

/*     CMN:Licenses/*/*/*:SYNC_REF_CONTACT     */

iArr = new Array();
// attributes to ignore;
contactTypeArray = new Array();
// ignored since we are using REF_CONTACT_CREATION_RULES;
createRefContactsFromCapContactsAndLink(capId,contactTypeArray,iArr,false,false,comparePeopleStandard);

/*     CMN:Licenses/Other/Sportsmen/Game Harvest     */

showDebug = false;
showMessage=false;
if (balanceDue == 0) {
	closeTask ("Review", "Approved","","");
	}

updateTag();

/*     CMN:Licenses/WMU/Process/Create     */

var isSucess = true;
showMessage=true;
branch('WTUA:Licenses/WMU/Process/Create');

/*     CMN_CREATE_ENFORCEMENT_CONDITIONS     */

showDebug = true;
showMessage = true;
createEnforcemrntCondition();
revokeActiveHoldings();

/*     CMN_CREATE_LICENSE     */

frm = new form_OBJECT(GS2_SCRIPT, OPTZ_TYPE_CTRC);
if (appTypeString == 'Licenses/Annual/Application/NA') {
	SetformForSelectedLics(frm);
	}

if (appTypeString == 'Licenses/Other/Sales/Application') {
	SetOtherformForSelectedLics(frm);
	}

issueSelectedSalesItems(frm);

/*     CMN_MOVE_WKFLOW_AFTER_PAYMENT     */

if (balanceDue == 0) {
	closeTask ("Review", "Approved","","");
	}

/*     CTRCA:Licenses/Annual/Application/NA     */

showDebug = false;
showMessage=false;
branch ("CMN_CREATE_LICENSE");

/*     CTRCA:Licenses/Other/Sales/Application     */

showDebug = false;
showMessage=false;
branch ("CMN_CREATE_LICENSE");

/*     CTRCA:Licenses/Other/Sportsmen/Game Harvest     */

prefix = "CMN";
branch("EMSE_VariableBranching");

/*     CTRCA:Licenses/Sales/Reprint/Documents     */

showDebug = false;
showMessage=false;
ReprintDocuments();

/*     CTRCA:Licenses/Sales/Upgrade/Lifetime     */

showDebug = false;
showMessage=false;
upgradeLifetimeLic();

/*     CTRCA:Licenses/Sales/Void/Documents     */

showDebug = false;
showMessage=false;
VoidsSales();

/*     ContactAddAfter     */

prefix = "CAA";
branch("EMSE_VariableBranching");
showMessage=true;
showDebug=true;
createRefContactsFromCapContactsAndLink(capId,null,null,false,true,comparePeopleGeneric);

/*     EMSE:GlobalFlags     */

if (matches(currentUserID,"ADMIN", "LGAWAD")) {
	showDebug = 3;
	} else {
	showDebug = false;
	/* enable debugging on on scripts for ADMIN userID */;
	}

LICENSESTATE = "NY";

/*     EMSE_VariableBranching     */

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

/*     LIC: Document Requirement Item     */

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

/*     WTUA:Licenses/*/*/*     */

closeTasksForTagAnditems(capId);

/*     WTUA:Licenses/WMU/Process/Create     */

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


