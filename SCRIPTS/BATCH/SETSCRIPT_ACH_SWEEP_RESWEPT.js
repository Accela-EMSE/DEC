/*------------------------------------------------------------------------------------------------------/
| | Program : SetIssuePermitWorkflowUpdate.js
| Event   : Cap Set Script
|
| Usage   : For use with the cap set script functionality available in 6.5.0 and later.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Initialize Variables
/------------------------------------------------------------------------------------------------------*/
var debug = "";
var br = "<BR>";
var message = "";
var currentUserID = aa.env.getValue("CurrentUserID");
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var msg = "";
var showDebug = false;
var capId = null;

/*------------------------------------------------------------------------------------------------------/
| END Initialize Variables
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
var SetMemberArray = aa.env.getValue("SetMemberArray");
var CapSetScriptID = aa.env.getValue("CapSetScriptID");
var CurrentUserID = aa.env.getValue("CurrentUserID");
var ServiceProviderCode = aa.env.getValue("ServiceProviderCode");

var SetID = aa.env.getValue("SetID");

var set = new capSet(SetID);

if (set.statusComment) { // we can only do anything if the set comment has the ref seq nbr of the agency contact
    var agentSeqNbr = set.statusComment;
    var pm = aa.people.getPeople(agentSeqNbr).getOutput();

    logDebug("agent sequence number " + agentSeqNbr);
    if (pm) {

        // update the set status

        set.status = "ReSwept"
        set.statusComment = agentSeqNbr;
        set.update();

        // add blank row to ACH table
        /*
        var valuesMapBySubGroup = aa.util.newHashMap();  //build hash for values
        putTableValuesToMap(valuesMapBySubGroup,"ACH SWEEPS","Set Name",SetID);
        putTableValuesToMap(valuesMapBySubGroup,"ACH SWEEPS","Submission Date","");
        putTableValuesToMap(valuesMapBySubGroup,"ACH SWEEPS","Status","");
        putTableValuesToMap(valuesMapBySubGroup,"ACH SWEEPS","Comments","");

        addTableValuesToTemplateModel(pm.getTemplate(), "AGNT_TABLES", valuesMapBySubGroup);

        aa.people.editPeople(pm);
        */
        // find most recent ACH Record for the agent

        // 11/6/2013 JHS:   TODO:  Have to use SQL since there will be too many records associated with the agent.


        var vError = '';
        var conn = null;
        try {
            var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
            var ds = initialContext.lookup("java:/AA");
            conn = ds.getConnection();


            var s = "SELECT b.B1_ALT_ID from b1permit b, b3contact g WHERE b.b1_per_id1 = g.b1_per_id1 and b.b1_per_id2 = g.b1_per_id2 and b.b1_per_id3 = g.b1_per_id3 and b.serv_prov_code = 'DEC' and b.b1_per_group = 'Licenses' and	b.b1_per_type = 'DEC Internal' and	b.b1_per_sub_type = 'Revenue Management' and b.b1_per_category = 'ACH Status' ";
            s += " and g.g1_contact_nbr = " + agentSeqNbr + " order by b.b1_file_dd desc";
            logDebug(s);
            var sStmt = conn.prepareStatement(s);
            var rSet = sStmt.executeQuery();
            var counter = 0;

            if (rSet.next()) {
                var achId = aa.cap.getCapID(rSet.getString("B1_ALT_ID")).getOutput();
                logDebug("there is an ACH transaction " + achId.getCustomID());
                var achTable = loadASITable("SET_STATUS", achId);
                var lastSwept = null;
                var sweepRow = null;
                for (var i in achTable) {
                    logDebug(achTable[i]["SETID"] + "/" + achTable[i]["SetStatus"]);
                    if (String(achTable[i]["SETID"]).equals(String(SetID)) && String(achTable[i]["SetStatus"]).equals("Sweep Failed")) {
                        logDebug("Match");
                        if (!lastSwept) {
                            sweepRow = achTable[i];
                            lastSwept = new Date(achTable[i]["DateTime"]);
                        }
                        else {
                            if (new Date(achTable[i]["DateTime"] > lastSwept)) {
                                sweepRow = achTable[i];
                                lastSwept = new Date(achTable[i]["DateTime"]);
                            }
                        }
                    }
                }
                if (sweepRow) {
                    logDebug("adding a sweep row");
                    sweepRow["SetStatus"] = "ReSwept";
                    sweepRow["DateTime"] = dateAdd(null, 0);
                    sweepRow["SETPreviousStatus"] = "Sweep Failed";
                    addToASITable("SET_STATUS", sweepRow, achId);
                }
            }

        } catch (vError) {
            logDebug("Runtime error occurred: " + vError);
            if (conn) {
                conn.close();
            }
        }

        if (conn) {
            conn.close();
        }
    }
}


aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "Update Set successful - Sweep Reswept : " + (showDebug ? debug : ""));

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function logDebug(dstr) {
    debug += dstr + br;
}

function logMessage(dstr) {
    message += dstr + br;
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (available for use within the main loop)
/------------------------------------------------------------------------------------------------------*/



// put table values to given map
function putTableValuesToMap(valuesMapBySubgroup, subGroupName, fieldName, value) {
    if (valuesMapBySubgroup == null) {
        return;
    }

    var valuesMapByField = valuesMapBySubgroup.get(subGroupName);
    if (valuesMapByField == null) {
        valuesMapByField = aa.util.newHashMap();
        valuesMapBySubgroup.put(subGroupName, valuesMapByField);
    }

    valuesMapByField.put(fieldName, value);
}

// add table values to given templateModel
function addTableValuesToTemplateModel(templateModel, objectGroupName, valuesMapBySubgroup) {
    if (templateModel != null) {
        var templateTables = templateModel.getTemplateTables();

        if (templateTables != null) {
            for (var i = 0; i < templateTables.size(); i++) {
                var templateTable = templateTables.get(i);
                var groupName = templateTable.getGroupName();
                if (objectGroupName != groupName) {
                    continue;
                }

                addTableValuesToTemplateTable(templateTable, valuesMapBySubgroup);
            }
        }
    }
}

// add table values to given templateTable
function addTableValuesToTemplateTable(templateTable, valuesMapBySubgroup) {
    var templateSubgroups = templateTable.getSubgroups();
    if (templateSubgroups != null) {
        for (var i = 0; i < templateSubgroups.size(); i++) {
            var templateSubgroup = templateSubgroups.get(i);
            var subgroupName = templateSubgroup.getSubgroupName();
            var valuesMapByField = valuesMapBySubgroup.get(subgroupName);
            if (valuesMapByField == null || valuesMapByField.size() == 0) {
                continue;
            }

            // add new template row to given subGroup
            addTableValuesToTemplateSubGroup(templateSubgroup, valuesMapByField);
        }
    }
    return;
}


// add table values to given TemplateSubgroup
function addTableValuesToTemplateSubGroup(templateSubgroup, valuesMapByField) {
    if (valuesMapByField == null || valuesMapByField.size() == 0) {
        return;
    }

    if (templateSubgroup.getRows() == null) {
        templateSubgroup.setRows(aa.util.newArrayList());
    }

    var rowIndex = aa.util.parseLong("" + (templateSubgroup.getRows().size() + 1));

    // construct table values
    var tablevalues = aa.util.newArrayList();
    var fields = templateSubgroup.getFields();
    for (var i = 0; i < fields.size(); i++) {
        var field = fields.get(i);
        // construct new table value
        var value = valuesMapByField.get(field.getFieldName());
        var tablevalue = aa.genericTemplate.createGenericTemplateTableValue(rowIndex, field, value);
        tablevalues.add(tablevalue);
    }

    // construct new row
    var templateRow = aa.genericTemplate.createTemplateRow(rowIndex, tablevalues);
    templateRow.setValues(tablevalues);

    // add the new row templateSubGroup
    templateSubgroup.getRows().add(templateRow);
}

