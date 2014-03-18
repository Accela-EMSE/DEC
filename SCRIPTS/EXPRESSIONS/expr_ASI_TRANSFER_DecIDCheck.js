var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var aa = expression.getScriptRoot();

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_EXPRESSIONS"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
var aYear = expression.getValue("ASI::GENERAL INFORMATION::License Year");
var vUserID = expression.getValue("$$userID$$");
var sUserIdEB = vUserID.getValue();
var oRecordType=expression.getValue("CAP::capType");

var otDecId = expression.getValue("ASI::TRANSFER INFORMATION::Customer ID Transfer to");
//
var isDecIDExist = getPeopleByDecID(otDecId);
var msg = "";
if(isNull(isDecIDExist)){
    msg="Customer ID Transfer to (DEC ID)  is not exit";
	otDecId.value = "";
 }
otDecId.message = msg;
expression.setReturn(otDecId);
////