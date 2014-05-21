/*------------------------------------------------------------------------------------------------------/
| Program:  BATCH_DMP_IBP.js  Trigger: Batch
| Event   : N/A
| Usage   : Batch Script  
| Agency  : DEC
| Purpose : DMP - Intermediate Batch Process.
| Notes   : 07/17/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("emailAddress", "");
aa.env.setValue("showDebug", "Y");
/*------------------------------------------------------------------------------------------------------/
| END: TEST PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var maxSeconds = 4.5 * 60; 	    // number of seconds allowed for batch processing, usually < 5*60
var message = "";
var br = "<br>";
var tagAgentPrefix = "9991";
/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_REBUILD_TAGS"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
/*------------------------------------------------------------------------------------------------------/
| START: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var emailAddress = getParam("emailAddress"); 				// email to send report
var reportName = getParam("reportName");
/*------------------------------------------------------------------------------------------------------/
| END: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
var servProvCode = aa.getServiceProviderCode();
var showDebug = isNull(aa.env.getValue("showDebug"), "N") == "Y";
var batchJobID = 0;
var batchJobName = "";
var batchJobDesc = "";
var batchJobResult = "";
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var currentUser = aa.person.getCurrentUser().getOutput();
var startDate = new Date();
var startTime = startDate.getTime(); 		// Start timer
var appTypeArray = new Array();
var sYear = isNull(aa.env.getValue("Year"), sysDate.getYear());

/*------------------------------------------------------------------------------------------------------/
| END: Variable Definitions
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/
var isPartialSuccess = false;
var timeExpired = false;
var capId = null;
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var currentUser = aa.person.getCurrentUser().getOutput();
var currentUserID = currentUser == null ? "ADMIN" : currentUser.getUserID().toString()
var ordAinfo = null;
var AInfo = new Array();

logDebug("Start of Job");
if (!timeExpired) var isSuccess = mainProcess();
logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
if (isSuccess) {
    aa.print("Passed");
    aa.env.setValue("ScriptReturnCode", "0");
    if (isPartialSuccess) {
        aa.env.setValue("ScriptReturnMessage", "A script timeout has caused partial completion of this process.  Please re-run.");
        aa.eventLog.createEventLog("Batch Job run partial successful.", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
    } else {
        aa.env.setValue("ScriptReturnMessage", "Batch Job run successfully.");
        aa.eventLog.createEventLog("Batch Job run successfully.", "Batch Process", batchJobName, sysDate, sysDate, batchJobDesc, batchJobResult, batchJobID);
    }
}
else {
    aa.print("Failed");
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "Batch Job failed: " + emailText);
}

if (emailAddress.length)
    aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
/*------------------------------------------------------------------------------------------------------/
| END: MAIN LOGIC
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
    var vError = null;
    try {
        var vSuccess = checkBatch();
        if (!vSuccess) return false;

        logDebug("****** Start logic ******");

        callIBPlogic();

        logDebug("****** End logic ******");

        return vSuccess;
    }
    catch (vError) {
        logDebug("Runtime error occurred in line " + vError.lineNumber + " : " + vError.message);
        logDebug("at " + vError.stack);
        return true;
    }
}

function checkBatch() {
    var vBatchJobResult = aa.batchJob.getJobID();
    batchJobName = "" + aa.env.getValue("BatchJobName");

    if (vBatchJobResult.getSuccess()) {
        batchJobID = vBatchJobResult.getOutput();
        logDebug("Batch job ID found " + batchJobID);
        return true;
    }
    else {
        logDebug("Batch job ID not found " + vBatchJobResult.getErrorMessage());
        return false;
    }
}

function callIBPlogic() {
    /*
    var seasonPeriod = GetLicenseSeasonPeriod();
    var overLapPeriod = GetOverLapPeriod();
    var fromDate = aa.date.parseDate(jsDateToMMDDYYYY(overLapPeriod[0]));
    var toDate = aa.date.parseDate(jsDateToMMDDYYYY(seasonPeriod[1]));
    var currYear = seasonPeriod[0].getFullYear();
    logDebug("License Year : " + currYear);
    logDebug("Seseon sales start date : " + fromDate);
    logDebug("Seseon sales end date : " + toDate);
    */
    var drw = new Draw_Obj(sYear, 'NA', 0, DRAW_IBP, false);
    ordAinfo = drw.getPreorderAinfo();  //used to set preference bucket order

    var sql = getRecordsToProcess(sYear);

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();

    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();

    while (rSet.next()) {
        var fvRefContactNumber = rSet.getString("g1_contact_nbr");
        var sPreferenceBucket = rSet.getString("Preference_Bucket");
        var sChoiceNumber = rSet.getString("Choice_Number");
        var swmu = rSet.getString("WMU");
        var sDrawResult = rSet.getString("Result");
        var sIsCorrect = rSet.getString("Correct");
        var sIsNew = rSet.getString("New_1");
        var sApplyLandOwner = rSet.getString("Apply_Land_Owner");

        var dmpCapId = aa.cap.getCapID(rSet.getString("B1_PER_ID1"), rSet.getString("B1_PER_ID2"), rSet.getString("B1_PER_ID3")).getOutput();
        var dmpCap = aa.cap.getCap(dmpCapId).getOutput();
        var dmpAltId = dmpCapId.getCustomID();

        var dmpStatus = dmpCap.getCapStatus();
        appTypeResult = dmpCap.getCapType();
        appTypeString = appTypeResult.toString();
        var dmpAinfo = new Array();
        loadAppSpecific(dmpAinfo, dmpCapId);

        var spreferencePoint = getPrefpoint(dmpCapId);

        var newIbpRec = new IBPREC_OBJ(dmpAinfo["Year"]);
        newIbpRec.appTypeString = appTypeString;
        newIbpRec.CapStatus = dmpStatus;
        newIbpRec.DisabledVet = (dmpAinfo["Military Disabled"] == "CHECKED");
        newIbpRec.dmpCap = dmpCap;
        newIbpRec.dmpCapId = dmpCapId;
        newIbpRec.dmpId = dmpCapId;
        newIbpRec.dmpAltId = dmpAltId;
        newIbpRec.DrawType = sDrawResult;
        newIbpRec.Landowner = (dmpAinfo["Landowner"] == "CHECKED");
        newIbpRec.PreferencePoints = spreferencePoint;
        newIbpRec.PreferenceBucket = sPreferenceBucket;
        newIbpRec.Resident = (dmpAinfo["Resident"] == "CHECKED");
        newIbpRec.ItemCode = dmpAinfo["Item Code"];
        newIbpRec.Order = getOrderForBucket(newIbpRec.PreferenceBucket, ordAinfo);
        newIbpRec.ChoiceNum = sChoiceNumber;
        newIbpRec.WMU = swmu;
        newIbpRec.ApplyLandowner = (sApplyLandOwner == "CHECKED");

        //RunIBPlotteryForDMP(newIbpRec,ordAinfo);
    }
    conn.close();
}

function getRecordsToProcess(year) {
    var sql = " SELECT D.g1_contact_nbr, A.serv_prov_code, A.b1_per_id1, A.b1_per_id2, A.b1_per_id3, ";
    sql += " A.b1_per_group, A.b1_per_type, A.b1_per_sub_type, A.b1_per_category, ";
    sql += " T.ROW_INDEX, DRAW_TYPE, WMU, Apply_Land_Owner, Choice_Number, Correct, New_1, ";
    sql += " Land_Owner, Preference_Bucket, Preference_Points_After, ";
    sql += " Preference_Points_Given, Result, table_name  ";
    sql += " FROM b1permit A ";
    sql += " INNER JOIN bchckbox B ";
    sql += " ON A.serv_prov_code = B.serv_prov_code ";
    sql += " AND A.b1_per_id1 = B.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = B.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = B.b1_per_id3 ";
    sql += " AND B.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND UPPER(B.B1_CHECKBOX_DESC) ='YEAR' ";
    sql += " AND UPPER(B.B1_CHECKLIST_COMMENT) = '" + year + "' ";
    sql += " AND B.B1_CHECKBOX_TYPE = 'BASIC INFORMATION' ";
    sql += " INNER JOIN b3contact D ";
    sql += " ON A.serv_prov_code = D.serv_prov_code ";
    sql += " AND A.b1_per_id1 = D.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = D.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = D.b1_per_id3 ";
    sql += " INNER JOIN ";
    sql += " (SELECT DMPChoice1.ROW_INDEX, ";
    sql += " SERV_PROV_CODE, ";
    sql += " B1_PER_ID1, ";
    sql += " B1_PER_ID2, ";
    sql += " B1_PER_ID3, ";
    sql += " MAX(DECODE(column_name,'Apply Land Owner',attribute_value,NULL))            AS Apply_Land_Owner, ";
    sql += " MAX(DECODE(column_name,'Choice Number',attribute_value,NULL))               AS Choice_Number, ";
    sql += " MAX(DECODE(column_name,'Correct?',attribute_value,NULL))                    AS Correct, ";
    sql += " MAX(DECODE(column_name,'DRAW TYPE',attribute_value,NULL))                   AS DRAW_TYPE, ";
    sql += " MAX(DECODE(column_name,'Land Owner?',attribute_value,NULL))                 AS Land_Owner, ";
    sql += " MAX(DECODE(column_name,'Preference Bucket',attribute_value,NULL))           AS Preference_Bucket, ";
    sql += " MAX(DECODE(column_name,'Preference Points After',attribute_value,NULL))     AS Preference_Points_After, ";
    sql += " MAX(DECODE(column_name,'Preference Points Corrected',attribute_value,NULL)) AS Preference_Points_Corrected, ";
    sql += " MAX(DECODE(column_name,'Preference Points Given',attribute_value,NULL))     AS Preference_Points_Given, ";
    sql += " MAX(DECODE(column_name,'Result',attribute_value,NULL))                      AS Result, ";
    sql += " MAX(DECODE(column_name,'WMU',attribute_value,NULL))                         AS WMU, ";
    sql += " MAX(DECODE(column_name,'New?',attribute_value,NULL))                        AS New_1, ";
    sql += " table_name ";
    sql += " FROM bappspectable_value DMPChoice1 ";
    sql += " GROUP BY DMPChoice1.ROW_INDEX, ";
    sql += " DMPChoice1.SERV_PROV_CODE, ";
    sql += " DMPChoice1.B1_PER_ID1, ";
    sql += " DMPChoice1.B1_PER_ID2, ";
    sql += " DMPChoice1.B1_PER_ID3, ";
    sql += " table_name ";
    sql += " ) T ";
    sql += " ON A.serv_prov_code = T.serv_prov_code ";
    sql += " AND A.b1_per_id1 = T.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = T.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = T.b1_per_id3 ";
    sql += " AND T.DRAW_TYPE = 'INSTANT' ";
    sql += " AND T.Result = 'LOST' ";
    sql += " WHERE A.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND A.rec_status = 'A' ";
    sql += " AND D.rec_status = 'A' ";
    sql += " AND A.b1_module_name = 'Licenses' ";
    sql += " AND A.b1_per_group = 'Licenses' ";
    sql += " AND A.b1_per_type = 'Annual' ";
    sql += " AND A.b1_per_sub_type = 'Hunting' ";
    sql += " AND A.b1_per_category = 'Deer Management Permit' ";
    sql += " AND A.b1_appl_status = 'Active' ";
    sql += " AND b1_contact_type = 'Individual' ";
    sql += " AND NOT EXISTS ";
    sql += " (SELECT 1 ";
    sql += " FROM bappspectable_value I ";
    sql += " WHERE I.serv_prov_code = A.serv_prov_code ";
    sql += " AND I.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND I.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND I.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND I.rec_status = 'A' ";
    sql += " AND Upper(I.column_name) = Upper('DRAW TYPE') ";
    sql += " AND I.table_name = T.table_name ";
    sql += " AND I.attribute_value = 'IBP') ";
    sql += " ORDER BY Preference_Bucket, ";
    sql += " A.rec_date ";

    return sql;
}


function getRecordsToProcessOld(year) {
    var sql = " SELECT D.g1_contact_nbr, A.serv_prov_code, A.b1_per_id1, A.b1_per_id2, A.b1_per_id3, ";
    sql += " A.b1_per_group, A.b1_per_type, A.b1_per_sub_type, A.b1_per_category, ";
    sql += " T.attribute_value AS DRAW_TYPE, ";
    sql += " (SELECT X.attribute_value ";
    sql += " FROM   bappspectable_value X ";
    sql += " WHERE  X.serv_prov_code = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('Choice Number') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2) AS Choice_Number, ";
    sql += " (SELECT X.attribute_value ";
    sql += " FROM   bappspectable_value X ";
    sql += " WHERE  X.serv_prov_code = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('WMU') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2) AS WMU, ";
    sql += " (SELECT X.attribute_value ";
    sql += " FROM   bappspectable_value X ";
    sql += " WHERE  X.serv_prov_code = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('Preference Bucket') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2) AS Preference_Bucket, ";
    sql += " (SELECT X.attribute_value ";
    sql += " FROM   bappspectable_value X ";
    sql += " WHERE  X.serv_prov_code = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('Result') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2) AS DrawResult, ";
    sql += " (SELECT X.attribute_value ";
    sql += " FROM   bappspectable_value X ";
    sql += " WHERE  X.serv_prov_code = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('Correct?') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2) AS IsCorrect, ";
    sql += " (SELECT X.attribute_value ";
    sql += " FROM bappspectable_value X ";
    sql += " WHERE X.serv_prov_code   = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('Apply Land Owner') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2 ) AS Apply_Land_Owner ";
    sql += " FROM   b1permit A ";
    sql += " inner join b3contact D ";
    sql += " ON A.serv_prov_code = D.serv_prov_code ";
    sql += " AND A.b1_per_id1 = D.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = D.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = D.b1_per_id3 ";
    sql += " inner join bchckbox B ";
    sql += " ON A.serv_prov_code = B.serv_prov_code ";
    sql += " AND A.b1_per_id1 = B.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = B.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = B.b1_per_id3 ";
    sql += " inner join bappspectable_value T ";
    sql += " ON A.serv_prov_code = T.serv_prov_code ";
    sql += " AND A.b1_per_id1 = T.b1_per_id1 ";
    sql += " AND A.b1_per_id2 = T.b1_per_id2 ";
    sql += " AND A.b1_per_id3 = T.b1_per_id3 ";
    sql += " WHERE  A.serv_prov_code = '" + aa.getServiceProviderCode() + "' ";
    sql += " AND A.rec_status = 'A' ";
    sql += " AND D.rec_status = 'A' ";
    sql += " AND A.b1_module_name = 'Licenses' ";
    sql += " AND A.b1_per_group = 'Licenses' ";
    sql += " AND A.b1_per_type = 'Annual' ";
    sql += " AND A.b1_per_sub_type = 'Hunting' ";
    sql += " AND A.b1_per_category = 'Deer Management Permit' ";
    sql += " AND A.b1_appl_status = 'Active' ";
    sql += " AND b1_contact_type = 'Individual' ";
    sql += " AND B.b1_checkbox_desc = 'Year' ";
    sql += " AND B.b1_checkbox_group = 'APPLICATION' ";
    sql += " AND b1_checklist_comment = " + year;
    sql += " AND T.column_name = 'DRAW TYPE' ";
    sql += " AND T.attribute_value = 'INSTANT' ";
    sql += " AND NOT EXISTS (SELECT 1 ";
    sql += " FROM   bappspectable_value I ";
    sql += " WHERE  I.serv_prov_code = A.serv_prov_code ";
    sql += " AND I.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND I.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND I.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND I.rec_status = 'A' ";
    sql += " AND Upper(I.column_name) = Upper('DRAW TYPE') ";
    sql += " AND I.row_index = T.row_index ";
    sql += " AND I.table_name = T.table_name ";
    sql += " AND I.attribute_value = 'IBP') ";
    sql += " AND EXISTS (SELECT 1 ";
    sql += " FROM   bappspectable_value I ";
    sql += " WHERE  I.serv_prov_code = A.serv_prov_code ";
    sql += " AND I.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND I.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND I.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND I.rec_status = 'A' ";
    sql += " AND Upper(I.column_name) = Upper('Result') ";
    sql += " AND I.row_index = T.row_index ";
    sql += " AND I.table_name = T.table_name ";
    sql += " AND I.attribute_value = 'LOST') ";
    //sql += " AND rownum < 51 ";
    sql += " ORDER  BY (SELECT X.attribute_value ";
    sql += " FROM   bappspectable_value X ";
    sql += " WHERE  X.serv_prov_code = A.serv_prov_code ";
    sql += " AND X.b1_per_id1 = A.b1_per_id1 ";
    sql += " AND X.b1_per_id2 = A.b1_per_id2 ";
    sql += " AND X.b1_per_id3 = A.b1_per_id3 ";
    sql += " AND X.rec_status = 'A' ";
    sql += " AND Upper(X.column_name) = Upper('Preference Bucket') ";
    sql += " AND X.row_index = T.row_index ";
    sql += " AND X.table_name = T.table_name ";
    sql += " AND ROWNUM < 2), ";
    sql += " A.rec_date ";

    return sql;
}

function RunIBPlotteryForDMP(dmpIbpItem, orderInfo) {

    var ibpRec = dmpIbpItem;
    logDebug("RunIBPlotteryForDMP : " + ibpRec.Year + "," + ibpRec.WMU + "," + ibpRec.ChoiceNum + "," + ibpRec.DrawType + "," + ibpRec.ApplyLandowner + "," + ibpRec.PreferencePoints);

    var drw = new Draw_Obj(ibpRec.Year, ibpRec.WMU, ibpRec.ChoiceNum, DRAW_IBP, ibpRec.ApplyLandowner);
    drw.IsNyResiDent = ibpRec.Resident;
    drw.IsDisableForYear = ibpRec.DisabledVet;
    drw.IsMilitaryServiceman = ibpRec.DisabledVet;
    drw.PreferencePoints = ibpRec.PreferencePoints;
    drw.ordbAinfo = orderInfo;
    drw.PreferenceBucketForIbp = ibpRec.PreferenceBucket;
    logDebug("drw : " + drw.Year + "," + drw.Wmu + "," + drw.ChoiceNum + "," + drw.DrawType + "," + drw.ApplyLandowner + "," + drw.ordbAinfo);

    var dmpTag = new TagProp(LIC53_TAG_DMP_DEER, AA53_TAG_DMP_DEER, "", TAG_TYPE_4_DMP_DEER_TAG, 1);

    var condFulfill = new COND_FULLFILLMENT();
    fullfillCond = condFulfill.Condition_IBPTag;

    wmu1Result = drw.RunLottery();
    logDebug(wmu1Result);
    logDebug("Lottery result: " + wmu1Result.Selected);

    if (wmu1Result.Selected) {
        //No need to check rule for DMP since DMP is available only fo qualified customers only

        addFullfillmentCondition(ibpRec.dmpCapId, fullfillCond);
        var ruleParams = null;
        var parentCapId = getParent(ibpRec.dmpCapId);

        // Issue the new tag manually vs running through CreateTags, because there is no form/rules.
        //CreateTags(arryTags_DMP, ruleParams, ibpRec.ItemCode, wmu1Result, parentCapId);
        var seasonPeriod = GetDateRange(DEC_CONFIG, LICENSE_SEASON, ibpRec.Year);
        var diff = dateDiff(new Date(), seasonPeriod[0]);
        if (diff > 0) {
            var clacExpDt = dateAdd(convertDate(seasonPeriod[1]), 0);
            var startDate = seasonPeriod[0];
        }
        else {
            var clacExpDt = dateAdd(convertDate(seasonPeriod[1]), 0);
            var startDate = new Date();
        }

        newLicId = createNewTag(parentCapId, startDate, clacExpDt, "DMP Deer", null);
        updateDocumentNumber(tagAgentPrefix + newLicId.getCustomID(), newLicId);
        editAppSpecific("Tag Type", TAG_TYPE_4_DMP_DEER_TAG, parentCapId);
        var newAInfo = new Array();
        newAInfo.push(new NewLicDef("Tag Type", TAG_TYPE_4_DMP_DEER_TAG));
        newAInfo.push(new NewLicDef("WMU", wmu1Result.WMU));
        newAInfo.push(new NewLicDef("Draw Type", wmu1Result.DrawType));
        newAInfo.push(new NewLicDef("Choice", wmu1Result.ChoiceNum));
        newAInfo.push(new NewLicDef("PreferencePoints", wmu1Result.PreferencePoints));
        newAInfo.push(new NewLicDef("Landowner", wmu1Result.Landowner));
        newAInfo.push(new NewLicDef("Military Disabled", wmu1Result.DisabledVet));
        newAInfo.push(new NewLicDef("Resident", wmu1Result.Resident));
        copyLicASI(newLicId, newAInfo);

        if (ibpRec.ChoiceNum == 1) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 1 IBP", " - " + ibpRec.WMU + ":  SELECTED", newLicId.getCustomID(), ibpRec.dmpCapId);
        } else if (ibpRec.ChoiceNum == 2) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 2 IBP", " - " + ibpRec.WMU + ":  SELECTED", newLicId.getCustomID(), ibpRec.dmpCapId);
        }

        var result = aa.cap.createAppHierarchy(ibpRec.dmpCapId, newLicId);
        if (result.getSuccess()) {
            logDebug("Parent DMP successfully linked");
        }
        else {
            logDebug("Could not link DMP" + result.getErrorMessage());
        }
    }
    else {
        if (ibpRec.ChoiceNum == 1) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 1 IBP", " - " + ibpRec.WMU + ":  NOT SELECTED", "", ibpRec.dmpCapId);
        } else if (ibpRec.ChoiceNum == 2) {
            addStdConditionWithComments("DMP Application Result", "WMU Choice 2 IBP", " - " + ibpRec.WMU + ":  NOT SELECTED", "", ibpRec.dmpCapId);
        }
    }

    logDebug("wmu1Result : " + wmu1Result.DrawType + "," + wmu1Result.WMU + "," + wmu1Result.Result() + "," + wmu1Result.Landowner);
    var tempObject = new Array();
    var fieldInfo = new asiTableValObj("DRAW TYPE", wmu1Result.DrawType + "", "Y");
    tempObject["DRAW TYPE"] = fieldInfo;
    fieldInfo = new asiTableValObj("WMU", wmu1Result.WMU + "", "Y");
    tempObject["WMU"] = fieldInfo;
    fieldInfo = new asiTableValObj("Choice Number", wmu1Result.ChoiceNum, "Y");
    tempObject["Choice Number"] = fieldInfo;
    fieldInfo = new asiTableValObj("Result", wmu1Result.Result() + "", "Y");
    tempObject["Result"] = fieldInfo;
    fieldInfo = new asiTableValObj("Apply Land Owner", wmu1Result.Landowner ? "CHECKED" : "UNCHECKED", "Y");
    tempObject["Apply Land Owner"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points Given", wmu1Result.GivenPreferencePoints + "", "Y");
    tempObject["Preference Points Given"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Points After", wmu1Result.RemainingPreferencePoints + "", "Y");
    tempObject["Preference Points After"] = fieldInfo;
    fieldInfo = new asiTableValObj("Preference Bucket", wmu1Result.PreferenceBucket ? wmu1Result.PreferenceBucket + "" : "" + "", "Y");
    tempObject["Preference Bucket"] = fieldInfo;
    fieldInfo = new asiTableValObj("Land Owner?", "", "N");
    tempObject["Land Owner?"] = fieldInfo;
    fieldInfo = new asiTableValObj("Correct?", "", "N");
    tempObject["Correct?"] = fieldInfo;
    addToASITable("DRAW RESULT", tempObject, ibpRec.dmpCapId)
}
function IBPREC_OBJ(year) {
    this.Year = year;
    this.WMU = null;
    this.DrawType = null;
    this.ChoiceNum = null;
    this.PreferencePoints = null;
    this.Landowner = null;
    this.DisabledVet = null;
    this.Resident = null;
    this.PreferenceBucket = null;
    this.dmpId = null;
    this.dmpCapId = null;
    this.dmpCap = null;
    this.dmpAltId = null;
    this.CapStatus = null;
    this.appTypeString = '';
    this.ApplyLandowner = null;
    this.Order = 0;
    this.ItemCode = null;
}

function getPrefpoint(itemcapId) {
    var prefPoints = 0;
    var c = getContactObj(itemcapId, "Individual");
    if (c && c.refSeqNumber) {
        var p = aa.people.getPeople(c.refSeqNumber).getOutput();
        var subGroupArray = getTemplateValueByFormArrays(p.getTemplate(), null, null);
        GetAllASI(subGroupArray);
        for (var subGroupName in subGroupArray) {
            var fieldArray = subGroupArray[subGroupName];
            if (subGroupName == "ADDITIONAL INFO") {
                prefPoints = isNull(fieldArray["Preference Points"], 0);
                break;
            }
        }
    }
    return prefPoints;
}