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

var otDecId = expression.getValue("ASI::TRANSFER INFORMATION::Customer ID Transfer to (DEC ID)");

var isValidUser = isValidUserForTransferLifetimeLicense(vUserID.getValue());

if (!isValidUser) {
    //message = "Not authorize user to transfer license.";
 } 
else {

	}

 //Init
var f = new form_OBJECT(GS2_EXPR, OPTZ_TYPE_ALLFEES);
f.Year = aYear.value;
f.UserIdEB = sUserIdEB;
f.RecordType = oRecordType.getValue();
//

//Set control array and set values for lic
var exprControlArray = new Array();
var exprObj;
var isYesExprObj = false;
for (var idx = 0; idx < f.licObjARRAY.length; idx++) {
    exprObj = expression.getValue(f.licObjARRAY[idx].ExprFieldName);
    isYesExprObj = ((exprObj.value != null && (exprObj.value.equalsIgnoreCase('YES') || exprObj.value.equalsIgnoreCase('Y') || exprObj.value.equalsIgnoreCase('CHECKED') || exprObj.value.equalsIgnoreCase('SELECTED') || exprObj.value.equalsIgnoreCase('TRUE') || exprObj.value.equalsIgnoreCase('ON'))));
    f.SetSelected(f.licObjARRAY[idx].Identity, isYesExprObj);
    exprControlArray[exprControlArray.length] = expression.getValue(f.licObjARRAY[idx].ExprFieldName);
}

////Set Lic availablity using lic array from app object
for (var idx = 0; idx < f.licObjARRAY.length; idx++) {
    //var oTemp = new License_OBJ();
    var oLic = f.licObjARRAY[idx];

    if (f.licObjARRAY[idx].ExprFieldName != "") {
        if (f.licObjARRAY[idx].Message != "") {
            (exprControlArray[idx]).message = f.licObjARRAY[idx].Message;
        }
      /*   if (f.licObjARRAY[idx].IsSelectable == false || f.licObjARRAY[idx].IsActive == false) {
            //(exprControlArray[idx]).readOnly = true;
            (exprControlArray[idx]).value = false;
            (exprControlArray[idx]).hidden = true;
        } else {
            (exprControlArray[idx]).readOnly = f.licObjARRAY[idx].IsDisabled;
            (exprControlArray[idx]).hidden = false;
        } */
        if ((exprControlArray[idx]) != "") {
            expression.setReturn((exprControlArray[idx]));
        }
    }
} 
////

//conrol Refeshment to commit applied settings
var myLicObj = new Array();

myLicObj[myLicObj.length] = expression.getValue("ASI::TRANSFER INFORMATION::Transfer Reason");
myLicObj[myLicObj.length] = expression.getValue("ASI::TRANSFER INFORMATION::Customer ID Transfer to (DEC ID)");
myLicObj[myLicObj.length] = expression.getValue("ASI::TRANSFER INFORMATION::Comments");
////

//