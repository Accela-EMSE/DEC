/*------------------------------------------------------------------------------------------------------/
|
| Usage   : Expression Builder Script that will validate a driver license
|
| Client  : N/A
| Action# : N/A
|
| Notes   : Validates NY ID's against DMV   
|	MUST IMPORT SSL Certificate FROM DMV SERVER INTO trusted_cacerts on BIZ Server in order to fix not have SSL Errors
|	1) Export the SSL Cert to file using Internet explorer
|	2) Import in to keystore on Accela AppServer using keytool.  Example string provided below
|	D:\Accela\bin\jdk1.6.0\bin\keytool -import -noprompt -trustcacerts -alias nysDMV_test -file D:\nysDMV_test.cer -keystore D:\Accela\av.biz\conf\certs\trusted_cacerts -storepass changeit
|
| 12/04/2013 : 1.0 : DQ Initial
|
/------------------------------------------------------------------------------------------------------*/
var dmvWsURL = "https://wsc.dmv.state.ny.us/sst/runtime.asvc/com.actional.intermediary.CIDVerif__Test_";
var dmvUserID = "deccidvb"
var dmvUserPwd = "853ID1yg"

var msg = "";
var servProvCode=expression.getValue("$$servProvCode$$").value;

var servProvCode=expression.getValue("$$servProvCode$$").value;
var dl = expression.getValue("CUSTOMER::driverLicenseNbr");
var dlState =expression.getValue("CUSTOMER::driverLicenseState");
var dlLast = expression.getValue("CUSTOMER::lastName");
var dlDOB = expression.getValue("CUSTOMER::birthDate");

var form = expression.getValue("CUSTOMER::FORM");

var returnMessage = "";
// get the EMSE biz object
var aa = expression.getScriptRoot();

if (String(dlState.value).length > 0 && dlState.value.toUpperCase().equals("NY") && String(dl.value).length > 0) {

	form.blockSubmit = false;
	
	var searchLast = "";
	if (String(dlLast.value).length > 0 ){
		searchLast = String(dlLast.value).substring(0,1).toUpperCase();
	}
	var dt = new Date(dlDOB.getValue());
	var yyyymmdd = dt.getFullYear() + ("00" + String(dt.getMonth() + 1)).slice(-2) + String("00" + dt.getDate()).slice(-2);

	var pattern = /^\d{4}((0\d)|(1[012]))(([012]\d)|3[01])$/ ;
	var vLicNbr = String(dl.value).replace(/\D/g,'');
	
	if (!pattern.test(yyyymmdd)) {
		form.blockSubmit = true;
		dlDOB.message = "Required for Driver License Verification";
		dl.message = "";
		}
	else if (String(vLicNbr).length != 9) {
		form.blockSubmit = true;
		dl.message = "Must contain exactly 9 digits";
		dlDOB.message = "";
		}
	else if (!checkDMV(vLicNbr)) {
		form.blockSubmit = true;
		dl.message = "Invalid License Number";
		dlDOB.message = "";
		}
	else {
		var vOut = CIDVerify(dmvUserID,dmvUserPwd,dl.value,searchLast,yyyymmdd);
		
		if( !vOut.valid ){
			form.blockSubmit = true;
			dl.message = vOut.messages; //"Drivers License Validation Failed";
			dlDOB.message = ""
		}
		else{
			dl.message = "";
			dlDOB.message = "";
		}
	}
	
	expression.setReturn(dl);
	expression.setReturn(form);
	expression.setReturn(dlDOB);

}



/*********************************************************************************************
CIDVerify Function 

vUser = DMV User_ID
VPass = DMV Passowrd
vLicNbr = DMV ID number
vLast = DMV ID last name (this will wild card match)
vDOB = DMV ID Date of Birth in YYYYMMDD format.
*********************************************************************************************/
function CIDVerify(vUser,vPass,vLicNbr,vLast,vDOB){

	//change to proper environment
	var wsURL = dmvWsURL;

	var dmvSOAPenv = <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cid="http://www.NYSDMV.com/CIDVerif/CIDVerif">
	   <soapenv:Header/>
	   <soapenv:Body>
		  <cid:VerifyCID>
			 <cid:objXmlDoc>
				$$MYXML$$
			 </cid:objXmlDoc>
		  </cid:VerifyCID>
	   </soapenv:Body>
	</soapenv:Envelope>;

	dmvSOAPenv = dmvSOAPenv.toString();

	var dmvTran =	<DMVTRAN>
					<ADMIN_USER>
					<USER_ID></USER_ID>
					<PASSWORD></PASSWORD>
				</ADMIN_USER> 
				<CIDVERIFY_TRANS_DATA>
					<END_USER_ID></END_USER_ID>
				</CIDVERIFY_TRANS_DATA>
				<LOOKUP>
					<DMV_CLIENT_ID></DMV_CLIENT_ID>
				</LOOKUP>
				<VERIFY>
					<TEST name="DMV_CLIENT_LAST_NAME" type="WILDCARD" data="" />
					<TEST name="DMV_CLIENT_DOB" type="EXACT" data="" />
				</VERIFY>
			</DMVTRAN>;


	vLicNbr = String(vLicNbr).replace(/\D/g,'');			
			
	dmvTran.ADMIN_USER.USER_ID = vUser;
	dmvTran.ADMIN_USER.PASSWORD = vPass;
	dmvTran.CIDVERIFY_TRANS_DATA.END_USER_ID = vUser;
	dmvTran.LOOKUP.DMV_CLIENT_ID = vLicNbr;
	dmvTran.VERIFY.TEST[0].@data = vLast + "*";
	dmvTran.VERIFY.TEST[1].@data = vDOB;
	dmvSOAPenv = dmvSOAPenv.replace("$$MYXML$$",dmvTran.toString());

	//Invoke Web Service
	var soapResp = ""
	var soapRespObj = aa.util.httpPostToSoapWebService(wsURL, dmvSOAPenv, null,null,"http://www.NYSDMV.com/CIDVerif/CIDVerif/VerifyCID");
	var results = new CIDValidObj(); //Response Ojbect
	results.valid = true;
	results.messages = "Validated"

	if(soapRespObj.getSuccess())
		soapResp = soapRespObj.getOutput();
	else {
		results.valid = false;
		results.messages = "Unable to validate"; 
		//uncomment next line for debugging
		//results.messages = soapRespObj.getErrorMessage();
		return results;
	}
	var soap = new Namespace("http://schemas.xmlsoap.org/soap/envelope/");
	var ns1 = new Namespace("http://www.NYSDMV.com/CIDVerif/CIDVerif");

	//Fix XML Object
	soapResp = soapResp.replace('<?xml version="1.0" encoding="utf-8"?>',"");
	eval("var soapResp = " + soapResp.toString() + ";");

	//PARSE RESPONSE DMVTRANSACTION AND ASSIGNED TO dmvTranResp
	var dmvTranResp = soapResp.soap::Body.ns1::VerifyCIDResponse.ns1::objXmlDoc.DMVTRAN; //Response DMVTran from web services


	if(dmvTranResp.ADMIN_TRANSACTION.DISPOSITION != 'P'){
		results.valid=false;
		var failedMsg = dmvTranResp.SYSTEM_MESSAGES.MESSAGE_TEXT + "";
		
		if(failedMsg.indexOf("MLD0011") > -1){
			results.messages = "Invalid license number";
		}
		else if (failedMsg.indexOf("MLW0018") > -1){
			results.messages =  "Please enter valid 9 digit license number";
		}
		else if (failedMsg.indexOf("MLW0013") > -1){
			results.messages =  "Please enter valid 9 digit license number";
		}
		else if (failedMsg.indexOf("MLW0004") > -1){
			results.messages =  "“DMV validation service is unavailable, please try later";
		}
		else{
			results.messages =  "Unable to validate";
		}
		//uncomment next line for debugging
		//results.messages =  dmvTranResp.SYSTEM_MESSAGES.MESSAGE_TEXT + "";
	}
	else{
		for(vtest in dmvTranResp.VERIFY.TEST)
			if(dmvTranResp.VERIFY.TEST[vtest].@result == 'N'){
				results.valid = false;
				results.messages = "Name and/or Birth Date do not match DMV records";
			}
	}

	return results;

}

//resposne object
function CIDValidObj(){
	this.valid = true;
	this.messages = ""
return this;
}

function checkDMV(input) {
    var multipliers = [4 , 3 , 2 , 6 , 5 , 4 , 3 , 2] ; 

    var sum = 0;
    // Iterate each character in the input string.
    for(var i = 0; i < 8; i++) {
        // Get the index position of the next multiplier, using modulus.
        var multiplierIndex = (i % multipliers.length);
        var multiplier = multipliers[multiplierIndex];
        var char = input[i];
        // Check if char is a digit or a character.
        // If it is a character, get the appropriate int value.
        if(isNaN(char)) {
            // Not a number, so get the correct value.
        } else {
            // Add to the sum.
            sum += char * multiplier;   
        }
    }
    // Return the remainder.
    var checkDigit = sum % 10;
	var lastDigit = input[8];
	
	if (checkDigit != lastDigit) return false;
	else return true;
}