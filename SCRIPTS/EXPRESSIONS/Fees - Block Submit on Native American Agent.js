var aa = expression.getScriptRoot();
var showDebug = false;
var debug = "";
var br = "";

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var acaUserId = expression.getValue("$$userID$$").getValue();
var isValid = true;

var uObj = new USEROBJ();
uObj.userId = acaUserId;
uObj.userModel = uObj.getUserModel();
uObj.setUserModelAttributes();

var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
if (salesAgentInfoArray != null) {
	if (salesAgentInfoArray["Agent Group"] == "Native American Agency") {
		isValid = false;
	}
}

if (!isValid) {

var feeForm = expression.getValue("FEE::FORM");

var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){
		feeForm=expression.getValue(rowIndex, "FEE::FORM");
		feeForm.blockSubmit = true;
		feeForm.message = "This agent /location does not have permission to sell items that result in a charge to the customer.";
		expression.setReturn(rowIndex,feeForm);
		}

 }

