/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_DEC_MANAGE_STD_CHOICE.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be available 
|           to all master scripts through 
|            1. INCLUDES_CUSTOM 
|            or 2. Expression scripts fles (Starts with EXPR)
|            or 3. in expression 
|           
|           -Adds Dynamic values in standard choices 
|           1. Users
|           2. License Year
|           -Read values form Standard Chocies
|           1. DEC_CONFIG for seson period and overlap period
|
| Notes   : 01/02/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
|           10/10/2013,     Laxmikant Bondre (LBONDRE), Fixed Defect - 1922.
|                           Active Holdings are not shown because expiry date was wrong.
|                           Fixed Expiry Date.
/------------------------------------------------------------------------------------------------------*/
//UserNames share dropdown to update.
//Must create following Standard choice Share Dropdown prior to running
var USER_NAMES_SET = "USER_NAMES_SET"; //Share Dropdown
var LICENSE_FILING_YEAR = "LICENSE_FILING_YEAR"; //Share Dropdown
var LICENSE_FILING_YEAR_Desc = "LICENSE_FILING_YEAR_Desc"
//Switch
var DEC_CONFIG = "DEC_CONFIG";
var DEC_APP_LICENSE_TYPE = "DEC_APP_LICENSE_TYPE";

//Items in DEC_CONFIG
var LICENSE_SEASON = "LICENSE_SEASON";
var OVERLAP_SEASON = "OVERLAP_SEASON";
var DMP_APP_PERIOD = "DMP_APP_PERIOD";
var DMP_FCFS_PERIOD = "DMP_FCFS_PERIOD";
var DMP_INSTANT_LOTTERY_PERIOD = "DMP_INSTANT_LOTTERY_PERIOD";

//Call in one of the ASI which need dynamic year vales to be fill 
function InitializeDecStdChoce() {
    //Comment since not required with any record type
    //InitUserNames();
    InitLicenseFilingYear();
}

//
function InitUserNames() {
    //Department to process, USE "*" to process all users
    var DEPT = "*";

    var SHARED_DDLIST = USER_NAMES_SET;
    var peop = aa.people.getSysUserList(null).getOutput();
    var peopArr = new Array();

    for (x in peop) {
        if (peop[x].getFullName() != null && (peop[x].getDeptOfUser() == DEPT || DEPT == "*")) {
            peopArr[peop[x].getFullName()] = peop[x].getAuditStatus();
            var bizObj = aa.bizDomain.getBizDomainByValue(SHARED_DDLIST, peop[x].getFullName());

            //Add users that do not already exist within the Share DropDown
            if (!bizObj.getSuccess()) {
                var res = aa.bizDomain.createBizDomain(SHARED_DDLIST, peop[x].getFullName(), peop[x].getAuditStatus(), "");
                if (res.getSuccess()) {
                    aa.print("Added " + peop[x].getFullName());
                }
                else {
                    aa.print("Failed to Add " + peop[x].getFullName());
                }
            }
            //Enable Users that already exist in share dropdown, but were disabled and now enabled again
            else {
                var tmp = bizObj.getOutput();
                //aa.print(tmp.getAuditStatus());
                if (tmp.getAuditStatus() != "A") {
                    tmp.setAuditStatus("A");
                    aa.bizDomain.editBizDomain(tmp.getBizDomain());
                    aa.print("Enabled " + tmp.getBizdomainValue());
                }
            }

        }

    }
}

//To get Ovelap Period
function GetOverLapPeriod() {
    var now = new Date();
    var y = now.getFullYear();
    var returnPeriod = new Array();
    var bizObj = aa.bizDomain.getBizDomainByValue(DEC_CONFIG, OVERLAP_SEASON);

    if (bizObj.getSuccess()) {
        var sItemVal = bizObj.getOutput().getDescription();
        var monthArray = new Array();
        monthArray = sItemVal.toString().split("-");
        if (monthArray.length != 2) {
            logDebug("**ERROR :DEC_CONFIG >> OVERLAP_SEASON is not set up properly");
        } else {
            for (var p = 0; p < monthArray.length; p++) {
                var op = monthArray[p].toString().split("/");
                returnPeriod[returnPeriod.length] = new Date(y, op[0] - 1, op[1]);
            }
        }
    }
    return returnPeriod;
}

function GetLicenseYearDescByYear(year) {
    var retDesc = '';

    var strControl = LICENSE_FILING_YEAR_Desc;
    var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
    if (bizDomScriptResult.getSuccess()) {
        bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
        for (var i in bizDomScriptArray) {
            if (bizDomScriptArray[i].getDescription() == year) {
                retDesc = bizDomScriptArray[i].getBizdomainValue()
                break;
            }
        }
    }
    return retDesc;
}
//To Get Licese season period
function GetLicenseSeasonPeriod() {
    var now = new Date();
    var y = now.getFullYear();
    var returnPeriod = new Array();
    var bizObj = aa.bizDomain.getBizDomainByValue(DEC_CONFIG, LICENSE_SEASON);

    if (bizObj.getSuccess()) {
        var sItemVal = bizObj.getOutput().getDescription();
        var monthArray = new Array();
        monthArray = sItemVal.toString().split("-");
        if (monthArray.length != 2) {
            logDebug("**ERROR :DEC_CONFIG >> LICENSE_SEASON is not set up properly");
        } else {

            for (var p = 0; p < monthArray.length; p++) {
                var op = monthArray[p].toString().split("/");
                returnPeriod[returnPeriod.length] = new Date(y, op[0] - 1, op[1]);
            }
            var IsCurrentYearSame = (now >= returnPeriod[0] && now <= returnPeriod[1]);
            returnPeriod.length = 0;
            for (var p = 0; p < monthArray.length; p++) {
                var op = monthArray[p].toString().split("/");
                if (returnPeriod.length == 0) {
                    returnPeriod[returnPeriod.length] = new Date((IsCurrentYearSame ? y : y - 1), op[0] - 1, op[1]);
                } else {
                    returnPeriod[returnPeriod.length] = new Date((IsCurrentYearSame ? y + 1 : y), op[0] - 1, op[1]);
                }
            }
        }
    }
    return returnPeriod;
}

//To Get Licese filing year
function InitLicenseFilingYear() {
    var SHARED_DDLIST = LICENSE_FILING_YEAR;
    var SHARED_DDLIST_DESC = LICENSE_FILING_YEAR_Desc;

    var now = new Date();
    var appYear = new Array();
    var appYearDesc = new Array();
    var y = now.getFullYear();

    //Read Stadard choice for season
    var overlapPeriod = GetOverLapPeriod();
    //Read Stadard choice for season
    var seasonPeriod = GetLicenseSeasonPeriod();

    var IsOverLapPeriod = (now >= overlapPeriod[0] && now <= overlapPeriod[1]);
    var startY;
    var endY;

    appYear[appYear.length] = seasonPeriod[0].getFullYear();
    startY = seasonPeriod[0].getFullYear();
    endY = startY + 1;
    appYearDesc[appYearDesc.length] = "October 1, " + startY + " - September 30, " + endY;
    if (IsOverLapPeriod) {
        appYear[appYear.length] = seasonPeriod[0].getFullYear() + 1;
        startY = seasonPeriod[0].getFullYear() + 1;
        endY = startY + 1;
        appYearDesc[appYearDesc.length] = "October 1, " + startY + " - September 30, " + endY;
    }
    for (var y = 0; y < appYear.length; y++) {
        editLookup(SHARED_DDLIST, appYear[y], "");
        editLookup(SHARED_DDLIST_DESC, appYearDesc[y], appYear[y]);
        editLookup(SHARED_DDLIST, appYear[y], "");
        editLookup(SHARED_DDLIST_DESC, appYearDesc[y], appYear[y]);
    }
    //Disable Past Years ;
    var n = appYear[0];
    while (true) {
        n--;
        var bizDomObj = aa.bizDomain.getBizDomainByValue(SHARED_DDLIST, n);
        if (bizDomObj.getSuccess()) {
            editLookupAuditStatus(SHARED_DDLIST, n, "I");
            editLookupAuditStatus(SHARED_DDLIST, n, "I");
            startY = n;
            endY = startY + 1;
            editLookupAuditStatus(SHARED_DDLIST_DESC, "October 1, " + startY + " - September 30, " + endY, "I");
            editLookupAuditStatus(SHARED_DDLIST_DESC, "October 1, " + startY + " - September 30, " + endY, "I");
        } else {
            break;
        }
    }

    //Disable Future Years added for testing;
    var n = appYear[0];
    while (true) {
        n++;
        var bizDomObj = aa.bizDomain.getBizDomainByValue(SHARED_DDLIST, n);
        if (bizDomObj.getSuccess()) {
            editLookupAuditStatus(SHARED_DDLIST, n, "A");
            editLookupAuditStatus(SHARED_DDLIST, n, "A");
            startY = n;
            endY = startY + 1;
            editLookupAuditStatus(SHARED_DDLIST_DESC, "October 1, " + startY + " - September 30, " + endY, "A");
            editLookupAuditStatus(SHARED_DDLIST_DESC, "October 1, " + startY + " - September 30, " + endY, "A");
        }
        break;
    }

}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function getFirstMonday(d) {
    d = new Date(d);
	var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
	
    //Find Tuesday
    var mon = 1;

    while (firstDay.getDay() != mon) {
		firstDay.setDate(firstDay.getDate() + 1);
    }
    return firstDay;
}

function GetDateRange(stdChoice, sValue, year) {
    var returnPeriod = new Array();
    var desc = GetLookupVal(stdChoice, sValue);
    if (sValue != null && sValue != "") {
        if (desc != "") {
            var monthArray = new Array();
            var atmp = desc.toString().split("|");
            var isChangeByDay = false;
            var isChangeByFirstDayOfMonth = false;
            if (atmp.length > 1) {
                isChangeByDay = (atmp[1] == "Monday");
                isChangeByFirstDayOfMonth = (atmp[1] == "First Monday");
            }
            monthArray = atmp[0].toString().split("-");
            //monthArray = desc.toString().split("-");

            if (monthArray.length != 2) {
                logDebug("**ERROR :DEC_CONFIG >> " + sValue + " is not set up properly");
            } else {
                for (var p = 0; p < monthArray.length; p++) {
                    var op = monthArray[p].toString().split("/");
                    var dt = new Date(year, op[0] - 1, op[1]);
                    if (op != 0) {
                        if (returnPeriod.length > 0) {
                            if ((returnPeriod[returnPeriod.length - 1]) && dt.getTime() < (returnPeriod[returnPeriod.length - 1]).getTime()) {
                                dt = new Date((parseInt(year) + 1), op[0] - 1, op[1]);
                            }
                        }
                    }
                    returnPeriod[returnPeriod.length] = dt;
                }
            }

            if ((isChangeByDay || isChangeByFirstDayOfMonth) && returnPeriod.length == 2) {
                if (isChangeByDay) {
                    returnPeriod[0] = getMonday(returnPeriod[0]);
                }
                if (isChangeByFirstDayOfMonth) {
                    returnPeriod[0] = getFirstMonday(returnPeriod[0]);
                }
            }
        }
    }
    return returnPeriod;
}

function GetLookupVal(sControl, sValue) {
    var desc = "";
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(sControl, sValue);

    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        desc = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
    }

    return desc;
}
