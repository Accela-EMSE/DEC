/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012
|
| Program : REFCONTACTEDITAFTER.js
| Event   : REFCONTACTEDITAFTER
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|	The following script code will attempt to read the assocaite event and invoker the proper standard choices
|    
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 2.0
var capId = null;

eval(getCustomScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getCustomScriptText("INCLUDES_CUSTOM"));
eval(getCustomScriptText("INCLUDES_REBUILD_TAGS"));

function getCustomScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

var vToday = new Date();
vToday.setHours(0);
vToday.setMinutes(0);
vToday.setSeconds(0);

var vRefContact = aa.env.getValue("ContactModel");
var vContactSeqNum = vRefContact.contactSeqNumber;
var contactType = vRefContact.getContactType();
var emailText = "";
var maxSeconds = 4.5 * 60; 	    // number of seconds allowed for batch processing, usually < 5*60
var message = "";
var br = "<br>";
var servProvCode = aa.getServiceProviderCode();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var currentUser = aa.person.getCurrentUser().getOutput();
var useAppSpecificGroupName = false;
var isPartialSuccess = false;
var timeExpired = false;
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString();
var debug = "";

var showDebug = true;
var showMessage = true;

var currDate = new Date();
var contactType = vRefContact.contactType;

var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
var a = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), vContactSeqNum);
var array = a.toArray();
var arrayLen = array.length;
logDebug("No of rows in also known as: " + array.length);
var flag = 0;

var index = 0;

//Code for updating "also known as" info
if (contactType == "Individual" || contactType == "Clerk" || contactType == "DEC Agent") {
    for (i in array) {
        logDebug("Contact details: " + array[i].firstName + "  " + array[i].lastName);
        if (array[i].endDate == null) {
            if (array[i].firstName != vRefContact.firstName || array[i].lastName != vRefContact.lastName) {
                flag = 1;
            }
            else if (array[i].middleName && vRefContact.middleName) {
                if (array[i].middleName != vRefContact.middleName) {
                    flag = 1
                }
            }
            else if ((array[i].middleName && !vRefContact.middleName) || (!array[i].middleName && vRefContact.middleName)) {
                flag = 1;
            }

            if (flag == 1) {
                array[i].endDate = currDate;
                index = i;
                break;
            }
        }
    }

    if (flag == 1 || arrayLen == 0) {
        var args = new Array();
        var akaModel = aa.proxyInvoker.newInstance("com.accela.orm.model.contact.PeopleAKAModel", args).getOutput();
        var auditModel = aa.proxyInvoker.newInstance("com.accela.orm.model.common.AuditModel", args).getOutput();

        akaModel.setServiceProviderCode(aa.getServiceProviderCode());
        akaModel.setContactNumber(parseInt(vContactSeqNum));
        //if(vRefContact.firstName)
        {
            akaModel.setFirstName(vRefContact.firstName);
        }

        //if(vRefContact.middleName)
        {
            akaModel.setMiddleName(vRefContact.middleName);
        }

        //if(vRefContact.lastName)
        {
            akaModel.setLastName(vRefContact.lastName);
        }

        //if(vRefContact.firstName && vRefContact.lastName)
        {
            var fullName = vRefContact.firstName + " " + vRefContact.lastName;
            akaModel.setFullName(fullName);
        }

        akaModel.setStartDate(new Date());
        //akaModel.setEndDate(endDate);
        auditModel.setAuditDate(new Date());
        auditModel.setAuditStatus("A");
        auditModel.setAuditID("ADMIN");
        akaModel.setAuditModel(auditModel);
        a.add(akaModel);
        aka.saveModels(aa.getServiceProviderCode(), vContactSeqNum, a);
    }
}

if (contactType == "Individual" && !vRefContact.getDeceasedDate())
    rebuildAllTagsforaRefContact(vContactSeqNum, vToday);
if (contactType == "DEC Agent")
    callWebServiceForANS(vContactSeqNum);

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", debug);
}
else {
    aa.env.setValue("ScriptReturnCode", "0");
    if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
    if (showDebug) aa.env.setValue("ScriptReturnMessage", debug);
}
