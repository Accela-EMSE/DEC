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

var userId=expression.getValue("$$userID$$");
var dlState=expression.getValue("APPLICANT::applicant*driverLicenseState");
var dlNbr=expression.getValue("APPLICANT::applicant*driverLicenseNbr");
var variable0=expression.getValue("APPLICANT::FORM");

var inputValue = dlNbr.value;
var msg = '';

function isValidNumberX(inputValue) {
var isValid = true;
if (inputValue != null && inputValue != '') {
var Pattern = /^[0-9]{9}$/;
isValid = Pattern.test(inputValue);
}
return isValid;
}

if (dlState.value!=null && dlState.value.equals(String("NY"))) 
{
     if (inputValue != null || inputValue != '')
    {
       var isValid = isValidNumberX(inputValue);
       if (!isValid) 
       {
          msg = "Please enter 9 digit number.";
          variable0.message="Please enter valid 9 digit license number"
          variable0.blockSubmit=true; 
          expression.setReturn(variable0);
        }
    }
}
dlNbr.message = msg;
expression.setReturn(dlNbr);