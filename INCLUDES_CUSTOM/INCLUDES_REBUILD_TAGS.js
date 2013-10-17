/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_REBUILD_TAGS.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|           available to all master scripts
|
| Notes   : 10/15/2013,     Laxmikant Bondre (LBONDRE).
|                           Logic to Rebuild All tags for a Reference Contact.
|                           This routine should analyze given Reference Contact, Look at his / her age on given EffDate, Education,
|                           what Lifetime Licenses he / she has for the Year for which the give Efective Date is in Season.
|                           So what tags he / she should have and what tags he / she has.
|                           Create the Tags which are not there and Create an parent application for these tags.
|                           The Status of the Application should be "Approved" and put the Condition "Auto-Generated Applications" on this application.
/------------------------------------------------------------------------------------------------------*/

function rebuildAllTagsforaRefContact(ipRefContact,ipEffDate) {
    var fvProcessYear = getProcessYear(ipEffDate);
    var fvAge = getRefContactAgeAsOnDate(ipRefContact,ipEffDate);
}

function getProcessYear(ipEffDate) {
    var fvDateRange = lookup(DEC_CONFIG, LICENSE_SEASON);
    var fvDateArr = fvDateRange.split("-");
    opYear = ipEffDate.getFullYear();
    var fvStartStr = fvDateArr[0] + "/" + opYear.toString();
    var fvStartDt = new Date(fvStartStr);
    if (ipEffDate.getTime() < fvStartDt.getTime())
        opYear--;
    return opYear;
}

function getRefContactAgeAsOnDate(ipRefContact,fvBirthDate) {
    var opAge = 0;
    var fvContactQry = aa.people.getPeople(ipRefContact);
    if (fvContactQry.getSuccess()) {
        var fvContact = fvContactQry.getOutput();
        var fvBirthDate = fvContact.getBirthDate();
        opAge = getCompletedAge(fvBirthDate,fvBirthDate);
    }
    return opAge;
}

function getCompletedAge(ipBirthDate,ipEffDate) {
    var opAge = ipEffDate.getFullYear() - ipBirthDate.getFullYear();
    ipBirthDate.setHours(0);
    ipBirthDate.setMinutes(0);
    ipBirthDate.setSeconds(0);
    ipEffDate.setHours(0);
    ipEffDate.setMinutes(0);
    ipEffDate.setSeconds(0);
       
    var fvEffBirthDate = ipBirthDate;
    fvEffBirthDate.setFullYear(ipEffDate.getFullYear());
    if (fvEffBirthDate.getTime() > ipEffDate.getTime())
        opAge--;
    return opAge;
}