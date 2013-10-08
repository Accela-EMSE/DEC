function getParam(pParamName) //gets parameter value and logs message showing param value
{
    var ret = "" + aa.env.getValue(pParamName);
    logDebug("Parameter : " + pParamName + " = " + ret);
    return ret;
}

function isNull(pTestValue, pNewValue) {
    if (pTestValue == null || pTestValue == "")
        return pNewValue;
    else
        return pTestValue;
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function logDebug(dstr) {
    if (showDebug) {
        aa.print(dstr)
        emailText += dstr + "<br>";
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
        aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(), "", dstr, batchJobID);
    }
}


function getACAUrl() {

    // returns the path to the record on ACA.  Needs to be appended to the site

    itemCap = capId;
    if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args
    var acaUrl = "";
    var id1 = capId.getID1();
    var id2 = capId.getID2();
    var id3 = capId.getID3();
    var cap = aa.cap.getCap(capId).getOutput().getCapModel();

    acaUrl += "/urlrouting.ashx?type=1000";
    acaUrl += "&Module=" + cap.getModuleName();
    acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
    return acaUrl;
}


function addParameter(pamaremeters, key, value) {
    if (key != null) {
        if (value == null) {
            value = "";
        }

        pamaremeters.put(key, value);
    }
}

function getDateCode(ipDate) {
    var fvYear = ipDate.getFullYear().toString();
    var fvMonth = (ipDate.getMonth() + 1).toString();
    var fvDay = ipDate.getDate().toString();
    if (ipDate.getMonth() < 9) fvMonth = "0" + fvMonth;
    if (ipDate.getDate() < 10) fvDay = "0" + fvDay;

    var fvDateCode = fvYear + fvMonth + fvDay;
    return fvDateCode;
}

function getDateString(ipDate) {
    var fvYear = ipDate.getFullYear().toString();
    var fvMonth = (ipDate.getMonth() + 1).toString();
    var fvDay = ipDate.getDate().toString();
    if (ipDate.getMonth() < 9) fvMonth = "0" + fvMonth;
    if (ipDate.getDate() < 10) fvDay = "0" + fvDay;

    var fvDateString = fvMonth + "/" + fvDay + "/" + fvYear;
    return fvDateString;
}

/*------------------------------------------------------------------------------------------------------/
|  EMAIL HELPER
/------------------------------------------------------------------------------------------------------*/
function EmailHelper(module) {
    this.Module = module;
    this.FileToAttach = null;
    this.Subject = String("");
    this.EmailFrom = String("");
    this.EmailTo = String("");
    this.EmailCC = String("");
    this.EmailContent = String("");

    this.Validate = function () {
        var isvalid = true;
        if (this.EmailFrom == null || this.EmailFrom == "") {
            logDebug("From Email address is blank.");
            isvalid = false;
        }
        if ((this.EmailTo == null || this.EmailTo == "") && (this.EmailCC == null || this.EmailCC == "")) {
            logDebug("To Email address is blank.");
            isvalid = false;
        }
        return isvalid;
    }
    this.EmailFile = function () {
        var isSuccess = false;
        if (this.Validate()) {

            //Send file via Email
            var vSendResult = aa.sendEmail(this.EmailFrom, this.EmailTo, this.EmailCC, this.Subject, this.EmailContent, this.FileToAttach);
            if (vSendResult.getSuccess()) {
                logDebug("Email sent successfully");
                isSuccess = true;
            } else {
                logDebug("System failed send report to selected email addresses because mail server is broken or report file size is great than 5M.");
            }
        }
        return isSuccess;
    }
}

/*------------------------------------------------------------------------------------------------------/
|  REPORT GENERATION HELPER
/------------------------------------------------------------------------------------------------------*/
function ReportHelper(module, reportname) {
    this.Module = module;
    this.ReportName = reportname;
    this.ReportUser = null;
    this.ReportParamArray = aa.util.newHashMap();
    this.AddReportParam = function (key, value) {
        if (key != null) {
            if (value == null) {
                value = "";
            }
            this.ReportParamArray.put(key, value);
        }
    }
    this.CapID = null;
    this.altID = null;
    this.isEDMS = false;
    this.ReportInfo = null;
    this.ReportFileName = null;
    this.StringToInsertForName = null;
    this.AppendBefore = false;

    this.IsReportExists = function () {
        var isExists = true;
        var vReportInfoResult = aa.reportManager.getReportInfoModelByName(this.ReportName);
        if (vReportInfoResult.getSuccess()) {
            logDebug("Report found " + this.ReportName);
            this.ReportInfo = vReportInfoResult.getOutput()
        } else {
            logDebug("Could not found this report " + this.ReportName);
            isExists = false;
        }
        return isExists;
    }

    this.HasPermission = function () {
        var vPermissionResult = aa.reportManager.hasPermission(this.ReportName, this.ReportUser);
        if (vPermissionResult.getSuccess() == false || vPermissionResult.getOutput().booleanValue() == false) {
            logDebug("The user " + this.ReportName + " does not have perssion on this report " + this.ReportUser);
            return false;
        } else {
            logDebug("The User has permission.");
        }
        return true;
    }

    this.RunReport = function () {
        // Step 1. Initialize report
        var oReport = this.ReportInfo;
        oReport.setModule(this.Module);
        if (this.CapID != null) {
            oReport.setCapId(this.CapID);
        }
        if (this.ReportParamArray.size() > 0) {
            oReport.setReportParameters(this.ReportParamArray);
        }
        if (this.isEDMS && isNull(this.altID, '') != '') {
            oReport.getEDMSEntityIdModel().setAltId(this.altID);
        }

        var vReportResult = aa.reportManager.getReportResult(oReport);
        if (vReportResult.getSuccess()) {
            var reportResult = vReportResult.getOutput();
            if (isNull(this.StringToInsertForName, '') != '') {
                var tmpName = reportResult.getName();
                var newName = tmpName;
                if (this.AppendBefore) {
                    newName = (this.StringToInsertForName + '_' + tmpName.substring(0, tmpName.indexOf("_")) + tmpName.substring(tmpName.indexOf("_"), tmpName.length()));
                } else {
                    newName = (tmpName.substring(0, tmpName.indexOf("_")) + '_' + this.StringToInsertForName + tmpName.substring(tmpName.indexOf("_"), tmpName.length()));
                }
                reportResult.setName(newName);
            }
            return reportResult;
        } else {
            // Notify adimistrator via Email, for example
            logDebug("Could not get report from report manager normally, error message please refer to: " + vReportResult.getErrorMessage());
            return null;
        }
    }

    this.ExecuteReport = function () {
        var isSuccess = false;

        if (this.IsReportExists()) {
            if (this.HasPermission()) {
                // Run report
                var oReportOutput = this.RunReport();
                if (oReportOutput != null) {
                    // Store Report File to harddisk
                    this.ReportFileName = this.SaveReportToDisk(oReportOutput);
                    isSuccess = true;
                }
            }
        }
        return isSuccess;
    }

    this.SaveReportToDisk = function (oReportOutput) {
        var vReportFileResult = aa.reportManager.storeReportToDisk(oReportOutput);
        if (vReportFileResult.getSuccess()) {
            return vReportFileResult.getOutput();
        } else {
            logDebug("The appliation does not have permission to store this temporary report " + this.ReportName + ", error message please refer to:" + vReportFileResult.getErrorMessage());
            return null;
        }
    }
}
