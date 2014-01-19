/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_EXPRESSION.js
| Event   : N/A
|
| Usage   : Common Script to Include in expression to validate Buiseness rules  
|         : Can be shared across super agency
| Notes   : 04/17/2013,     Lalit Gawad,     Initial Version 
|         
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; 	// Set to true to see results in popup window
var showDebug = false; 		// Set to true to see debug messages in popup window
var disableTokens = false; 	// turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var enableVariableBranching = true; // Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99; 		// Maximum number of std choice entries.  Entries must be Left Zero Padded
//------------------------------------------------------------------------------------------------------/

var capId = null;
var cap = null;
var capIDString = "";
var appTypeResult = null;
var appTypeString = "";
var appTypeArray = new Array();
var capName = null;
var capStatus = null;
var fileDateObj = null;
var fileDate = null;
var fileDateYYYYMMDD = null;
var parcelArea = 0;
var estValue = 0;
var calcValue = 0;
var houseCount = 0;
var feesInvoicedTotal = 0;
var balanceDue = 0;
var houseCount = 0;
var feesInvoicedTotal = 0;
var capDetail = "";
var AInfo = new Array();
var partialCap = false;
var feeFactor = "";
var publicUserID = '';

function getCapIDString() {
    if (capID != null) {
        return capID.getCapID().toString();
    }
    else {
        return "";
    }
}

function isWmuProcessExists(year) {
    var searchCapId = year + " WMU Process";
    var currCapId = getCapId(searchCapId);

    return (currCapId != null);
}

function matches(eVal, argList) {
    for (var i = 1; i < arguments.length; i++)
        if (arguments[i] == eVal)
            return true;

}

function isLicenseType(appType, capId) {
    return appMatch(appType, capId)
}

function isActiveLicense(capId) {
    return matches(getExpirationStatus(capId), "Active", "About to Expire")
}

function getCapId(recordNum) {
    var getCapResult = aa.cap.getCapID(recordNum);

    if (getCapResult.getSuccess()) {
        return getCapResult.getOutput();
    } else {
        return null;
    }
}

function getCurrentUserID() {
    return aa.env.getValue("CurrentUserID");
}

function isPublicUser() {
    var isPublicUser = false;
    var currUserID = getCurrentUserID();
    if (currUserID.indexOf("PUBLICUSER") == 0) {
        isPublicUser = true
    }
    return isPublicUser;
}

function getExpirationStatus(capId) {
    b1ExpResult = aa.expiration.getLicensesByCapID(capId);
    if (b1ExpResult.getSuccess()) {
        this.b1Exp = b1ExpResult.getOutput();
        licStatus = this.b1Exp.getExpStatus();
        return licStatus;
    } else {
        return false;
    }
}

//Not in use
function isValidSsn(ssn) {
    var isValid = true;
    if (ssn != null && ssn != '') {
        var matchArr = ssn.match(/^(\d{3})-?\d{2}-?\d{4}$/);
        var numDashes = ssn.split('-').length - 1;
        if (matchArr == null || numDashes == 1) {
            isValid = false;
        }
        else {
            if (parseInt(matchArr[1], 10) == 0) {
                isValid = false;
            }
        }
    } else {
        isValid = true;
    }
    return isValid;
}

function isValidEmail(inputvalue) {
    var isValid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        isValid = (pattern.test(inputvalue));
    }
    return isValid;
}

function isValidPhoneNumber(inputvalue) {
    var isValid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/;
        isValid = (pattern.test(inputvalue));
    }
    return isValid;
}

function isValidZip(inputvalue) {
    var isValid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^\d{5}$|^\d{5}-\d{4}$/;
        isValid = (pattern.test(inputvalue));
    }
    return isValid;
}

//Obsolete
function restrictASCII(inputvalue) {
    var isValid = true;

    if (inputvalue != null && inputvalue != '') {
        string = inputvalue;
        for (var i = 0; i < string.length; i++) {
            asciiNum = string.charCodeAt(i);
            if (((asciiNum < 10 && asciiNum > 7) && (asciiNum > 29 && asciiNum < 91) && (asciiNum = 92) && (asciiNum > 94 && asciiNum < 127) && (asciiNum = 130) && (asciiNum > 144 && asciiNum < 149) && (asciiNum = 150) && (asciiNum = 8211) && (asciiNum > 8215 && asciiNum < 8219) && (asciiNum > 8219 && asciiNum < 8222))) {
                isValid = isValid && true;
            }
            else {
                isValid = isValid && false;
            }
        }
    } else {
        isValid = true;
    }
    return isValid;
}

//Obsolete
function isValidConfirmationNumber(inputvalue) {
    var isvalid = true;

    if (inputvalue != null && inputvalue != '') {
        var pattern = /^[0-9]{1,9}$/;
        if (pattern.test(inputvalue)) {
            isvalid = (inputvalue < 0 && inputvalue > 999999999);
        }
    }
    return isvalid;
}

function isValidStateIdentification(inputvalue) {
    var isvalid = true;
    if (inputvalue != null && inputvalue != '') {
        var pattern = /^[0-9]{9}$/;
        isvalid = (pattern.test(inputvalue));
    }
    return isvalid;
}

function isAuthAgentLogin(userId) {
    var uObj = new USEROBJ();
    uObj.userId = userId;
    uObj.userModel = uObj.getUserModel();
    uObj.setUserModelAttributes();
    return (uObj.acctType != 'CITIZEN');
}
function isValidUserForPayementInfo(userId) {
    var isvalid = false;

    var uObj;
    if (arguments.length > 0) {
        uObj = new USEROBJ();
        uObj.userId = userId;
        uObj.userModel = uObj.getUserModel();
        uObj.setUserModelAttributes();
    } else {
        uObj = new USEROBJ(publicUserID);
    }
    isvalid = (uObj.acctType == 'CITIZEN');

    if (!isvalid) {
        var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
        if (salesAgentInfoArray != null) {
            isvalid = (salesAgentInfoArray["Agent Group"] == "Call Center" || salesAgentInfoArray["Agent Group"] == "Call Centre");
        }
    }
    return !isvalid;
}
function getDecId(userId) {
    var decId = 'xxxxssssx';
    var uObj = new USEROBJ();
    uObj.userId = userId;
    uObj.userModel = uObj.getUserModel();
    uObj.setUserModelAttributes();
    var peopleModel = getOutput(aa.people.getPeople(uObj.peopleSequenceNumber), "");
    if (peopleModel != null) {
        decId = peopleModel.getPassportNumber();
    }
    return decId;
}
function isNativeAmericanAgent(userId) {
    var isvalid = false;

    var uObj = new USEROBJ();
    uObj.userId = userId;
    uObj.userModel = uObj.getUserModel();
    uObj.setUserModelAttributes();

    var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
    if (salesAgentInfoArray != null) {
        isvalid = (salesAgentInfoArray["Agent Group"] == "Native American Agency" || salesAgentInfoArray["Agent Group"] == "NYSDEC HQ");
    }
    return isvalid;
}
function getAgentID(userId) {
    var agentId = null;

    var uObj = new USEROBJ();
    uObj.userId = userId;
    uObj.userModel = uObj.getUserModel();
    uObj.setUserModelAttributes();

    var salesAgentInfoArray = getAgentInfo(uObj.publicUserID, uObj);
    if (salesAgentInfoArray != null) {
        agentId = salesAgentInfoArray["Agent Id"];
    }

    return agentId;
}
function logDebug(dstr) {
    //DO nothing
}
//
// exists:  return true if Value is in Array
//
function exists(eVal, eArray) {
    for (ii in eArray)
        if (eArray[ii] == eVal) return true;
    return false;
}

function getAge(argbirthDate) {
    var now = new Date();
    var birthDate = new Date(argbirthDate);

    function isLeap(year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    // days since the birthdate    
    var days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
    var age = 0;
    // iterate the years
    for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
        var daysInYear = isLeap(y) ? 366 : 365;
        if (days >= daysInYear) {
            days -= daysInYear;
            age++;
            // increment the age only if there are available enough days for the year.
        }
    }
    return age;
}
