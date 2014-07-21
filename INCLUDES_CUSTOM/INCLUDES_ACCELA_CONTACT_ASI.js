/*------------------------------------------------------------------------------------------------------/
|
| Program : INCLUDES_ACCELA_CONTACT_ASI.js
| Event   : N/A
|
| Usage   : Master Script Functions included in CUSTOM file to handle contact generic template.
|
| Notes   : This script  respect to Contact Management Enhancements (12ACC-01746, 13ACC-02905) 
|         : 04/12/2013,     Lalit S Gawad (LGAWAD),     Initial Version 
|
/------------------------------------------------------------------------------------------------------*/
/*----------/
| EXAMPLES
/----------*/
function example1() {
    var peopleSequenceNumber = "41259742";
    var formSubGroup = "CONTACT AUDIT LOG";
    var formFieldName = "ASI text";
    var tableSubgroup = "LICENSE TYPES";
    var tableFieldName = "Notes";

    //Retrive
    var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");

    var fieldValue = getTemplateValueByForm(peopleModel.getTemplate(), formSubGroup, formFieldName);
    aa.print("fieldValue = " + fieldValue);
    setTemplateValueByForm(peopleModel.getTemplate(), formSubGroup, formFieldName, "asi value creajoy");

    var allTableValue = getTemplateValueByTable(peopleModel.getTemplate(), tableSubgroup, tableFieldName);
    aa.print("allTableValue value = " + allTableValue);
    setTemplateValueByTable(peopleModel.getTemplate(), tableSubgroup, tableFieldName, "all asit value creajoy");

    var singleTableValue = getTemplateValueByTableRow(peopleModel.getTemplate(), tableSubgroup, tableFieldName, 1);
    aa.print("singleTableValue value = " + singleTableValue);
    setTemplateValueByTableRow(peopleModel.getTemplate(), tableSubgroup, tableFieldName, 1, "first row asit value creajoy");

    aa.people.editPeople(peopleModel);
}
function example2() {
    var peopleSequenceNumber = "878251";
    var tableSubgroup = "LEGALTABLE";
    tableFieldName = "Major";
    //Retrive
    var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");

    var major = getTemplateValueByForm(peopleModel.getTemplate(), tableSubgroup, tableFieldName);
    setTemplateValueByForm(peopleModel.getTemplate(), tableSubgroup, tableFieldName, major);
    aa.people.editPeople(peopleModel);
}
function example3() {
    var peopleSequenceNumber = "878251";

    //Retrive
    var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");

    var subGroupArray = getTemplateValueByFormArrays(peopleModel.getTemplate(), null, null);
    GetAllASI(subGroupArray);

    var gArray = getTemplateValueByTableArrays(peopleModel.getTemplate());
    GetAllASIT(gArray);
}
function example4() {
    var peopleSequenceNumber = "878251";

    var newAInfo = new Array();
    var subGroupName = "APPEARANCE";
    newAInfo.push(new NewLicDef("Height", "5", subGroupName));
    newAInfo.push(new NewLicDef("Eye Color", "Black", subGroupName));

    //Retrive
    var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
    setContactASI(peopleModel.getTemplate(), newAInfo);

    //for identical tables
    var aColName = new Array();
    var aColNameLink = new Array();
    var tableNameVar;
    var tableSubgroup;
    tableNameVar = "LANDOWNERINFORMATION";
    tableSubgroup = "LAND OWNER INFORMATION";
    aColName[aColName.length] = new Array("License Year", "SWIS Code", "Tax Map ID/Parcel ID", "Check this box to use this landowner parcel for your DMP application");
    aColNameLink[tableNameVar] = aColName.length - 1;
    setContactASIT(peopleModel, tableNameVar, tableSubgroup, LANDOWNERINFORMATION, aColName[aColNameLink[tableNameVar]])

    //for each table
    if (typeof (LANDOWNERINFORMATION) == "object") {
        for (y in LANDOWNERINFORMATION) {
            setTemplateValueByTableRow(peopleModel.getTemplate(), "LAND OWNER INFORMATION", "License Year", y, LANDOWNERINFORMATION[y]["License Year"]);
            setTemplateValueByTableRow(peopleModel.getTemplate(), "LAND OWNER INFORMATION", "SWIS Code", y, LANDOWNERINFORMATION[y]["SWIS Code"]);
            setTemplateValueByTableRow(peopleModel.getTemplate(), "LAND OWNER INFORMATION", "Tax Map ID/Parcel ID", y, LANDOWNERINFORMATION[y]["Tax Map ID/Parcel ID"]);
        }
    }

}
/*----------/
| METHODS
/----------*/
function NewTblDef(fldname, val) {
    this.FieldName = fldname;
    this.Value = val;

    var subgroupname = null;
    if (arguments.length > 2) {
        subgroupname = arguments[2];
    }
    this.SubGroupName = subgroupname;
}
/**
* get the field's default value for ASIT
*/
function getDefaultTemplateValueByTable(templateModel, subGroupName, fieldName) {
    var asiTableGroups = templateModel.getTemplateTables();
    return getDefaultTemplateValueByGroup(asiTablesGroup, subGroupName, fieldName);
}

/**
* get the field's value for ASI
*/
function getTemplateValueByForm(templateModel, subGroupName, fieldName) {
    logDebug("ENTER: getTemplateValueByForm");

    var asiFormGroups = templateModel.getTemplateForms();
    return getDefaultTemplateValueByGroup(asiFormGroups, subGroupName, fieldName);

    logDebug("EXIT: getTemplateValueByForm");
}

/**
* get the field's value for ASIT in line number
*/
function getTemplateValueByTableRow(templateModel, subGroupName, fieldName, lineNbr) {
    if (lineNbr == null || lineNbr <= 0) {
        return null;
    }

    var valueAttributes = getTableValueAttributesByName(templateModel.getTemplateTables(), subGroupName, fieldName);
    if (valueAttributes != null && valueAttributes.length >= lineNbr) {
        return valueAttributes[lineNbr - 1].getValue();
    }

    return null
}

/**
* get the field's value for ASIT
*/
function getTemplateValueByTable(templateModel, subGroupName, fieldName) {
    var valueAttributes = getTableValueAttributesByName(templateModel.getTemplateTables(), subGroupName, fieldName);
    if (valueAttributes != null && valueAttributes.length > 0) {
        var values = new Array();
        for (var rowIndex = 0; rowIndex < valueAttributes.length; rowIndex++) {
            values.push(valueAttributes[rowIndex].getValue());
        }
        return values;
    }

    return null;
}
/*
function getTemplateValueByTable(templateModel,groupName,fieldName)
{
        
        var asiTables = templateModel.getTemplateTables();
        if(asiTables == null || asiTables.size() == 0)
        {
           return null;
        }
        var subGroups = asiTables.get(0).getSubgroups();
        for(var groupsIndex = 0; groupsIndex < subGroups.size(); groupsIndex++)
        {
            var subGroup = subGroups.get(groupsIndex);
            if(groupName == subGroup.getSubgroupName())
            {
               var asiFields = subGroup.getFields();
               for(var fieldIndex = 0 ; fieldIndex < asiFields.size() ; fieldIndex++) 
               {
                   var field = asiFields.get(fieldIndex);
                   if(field.getFieldName() == fieldName)
                   {
                       return field.getDefaultValue();
                   }
               }
            }
        }
}
*/
/**
* set the field's value for ASI
*/
function setTemplateValueByForm(templateModel, subGroupName, fieldName, value) {
    var field = getFieldAttributeByName(templateModel.getTemplateForms(), subGroupName, fieldName);
    if (field != null) {
        field.setDefaultValue(value);
        return true;
    }

    return false;
}

/**
* set the field's value for ASIT in line number
*/
function setTemplateValueByTableRow(templateModel, subGroupName, fieldName, lineNbr, value) {
    var valueAttributes = getTableValueAttributesByName(templateModel.getTemplateTables(), subGroupName, fieldName);
    if (valueAttributes != null && valueAttributes.length >= lineNbr) {
        valueAttributes[lineNbr - 1].setValue(value);
    }

    return false;
}

/**
* set the field's value for ASIT
*/
function setTemplateValueByTable(templateModel, subGroupName, fieldName, value) {
    var valueAttributes = getTableValueAttributesByName(templateModel.getTemplateTables(), subGroupName, fieldName);
    if (valueAttributes != null && valueAttributes.length > 0) {
        for (var rowIndex = 0; rowIndex < valueAttributes.length; rowIndex++) {
            valueAttributes[rowIndex].setValue(value);
        }
        return true;
    }

    return false;
}
/*
function setTemplateValueByTable(templateModel, groupName, fieldName, newValue) {

    var asiTables = templateModel.getTemplateTables();
    if (asiTables == null || asiTables.size() == 0) {
        return null;
    }
    var subGroups = asiTables.get(0).getSubgroups();
    for (var groupsIndex = 0; groupsIndex < subGroups.size(); groupsIndex++) {
        var subGroup = subGroups.get(groupsIndex);
        if (groupName == subGroup.getSubgroupName()) {
            var asiFields = subGroup.getFields();
            for (var fieldIndex = 0; fieldIndex < asiFields.size(); fieldIndex++) {
                var field = asiFields.get(fieldIndex);
                if (field.getFieldName() == fieldName) {
                    field.setDefaultValue(newValue);
                }
            }
        }
    }
}
*/

/**
* get the field's default value for template group
*/
function getDefaultTemplateValueByGroup(templateGroups, subGroupName, fieldName) {
    logDebug("ENTER: getDefaultTemplateValueByGroup");

    var field = getFieldAttributeByName(templateGroups, subGroupName, fieldName);
    if (field != null) {
        return field.getDefaultValue();
    }
    return null;
    logDebug("EXIT: getDefaultTemplateValueByGroup");
    
}

/**
* get the field attribute by field name
*/
function getFieldAttributeByName(templateGroups, subGroupName, fieldName) {
    logDebug("ENTER: getFieldAttributeByName");

    if (templateGroups == null || templateGroups.size() == 0) {
        return null;
    }
    var subGroups = templateGroups.get(0).getSubgroups();
    for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
        var subGroup = subGroups.get(subGroupIndex);
        //logDebug(subGroup.getSubgroupName());
        if (subGroupName == subGroup.getSubgroupName()) {
            var fields = subGroup.getFields();
            for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
                var field = fields.get(fieldIndex);
                //logDebug(field.getDisplayFieldName());
                if (field.getDisplayFieldName() == fieldName) {
                    return field;
                }
            }
        }
    }

    logDebug("EXIT: getFieldAttributeByName");
}

/**
* get the array of table value attributes about the cloumn.
*/
function getTableValueAttributesByName(templateGroups, subGroupName, fieldName) {
    var field = getFieldAttributeByName(templateGroups, subGroupName, fieldName);
    if (field == null) {
        return null;
    }

    var subGroups = templateGroups.get(0).getSubgroups();
    for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
        var subGroup = subGroups.get(subGroupIndex);
        if (subGroupName == subGroup.getSubgroupName()) {
            var postion = subGroup.getFields().indexOf(field);
            var valueAttributes = new Array();
            var rows = subGroup.getRows();
            if (rows == null || rows.size() == 0) {
                return null;
            }
            for (var rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
                valueAttributes.push(rows.get(rowIndex).getValues().get(postion));
            }
            return valueAttributes;
        }
    }

    return null;
}

//
//NEW
//
/**
* get all arrays of ASI Forms by subgroups.
*/
function getTemplateValueByFormArrays(templateModel) {
    logDebug("ENTER: getTemplateValueByFormArrays");

	if (!templateModel) return new Array();
    var templateGroups = templateModel.getTemplateForms();
    var gArray = new Array();
    if (!(templateGroups == null || templateGroups.size() == 0)) {
        var subGroups = templateGroups.get(0).getSubgroups();
        for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
            var subGroup = subGroups.get(subGroupIndex);
            var fArray = new Array();
            var fields = subGroup.getFields();
            for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
                var field = fields.get(fieldIndex);
                fArray[field.getDisplayFieldName()] = field.getDefaultValue();
            }
            gArray[subGroup.getSubgroupName()] = fArray;
        }
    }
    logDebug("EXIT: getTemplateValueByFormArrays");

    return gArray;
}

/**
* get all arrays of ASIT subgroups.
*/
function getTemplateValueByTableArrays(templateModel) {
    logDebug("ENTER: getTemplateValueByTableArrays");

    var gArray = new Array();
	
	// Jira NYELS-44461
	if (!templateModel) {
		return gArray
		}
		
    var templateGroups = templateModel.getTemplateTables();
    var subGroups = templateGroups.get(0).getSubgroups();
    for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
        var subGroup = subGroups.get(subGroupIndex);

        var valueAttributes = new Array();
        var rows = subGroup.getRows();
        if (rows == null || rows.size() == 0) {
            //Do nothing;
        } else {
            for (var rowIndex = 0; rowIndex < rows.size(); rowIndex++) {
                //debugObject(rows.get(rowIndex).getValues());
                var fields = subGroup.getFields();

                var tempArray = new Array();
                var tempObject = new Array();
                if (fields != null) {
                    var iteFields = fields.iterator();
                    while (iteFields.hasNext()) {
                        var field = iteFields.next();

                        var readOnly = 'N';
                        var postion = subGroup.getFields().indexOf(field);

                        var columnName = rows.get(rowIndex).getValues().get(postion).getFieldName();
                        var tval = rows.get(rowIndex).getValues().get(postion).getValue();
                        var fieldInfo = new asiTableValObj(columnName, tval, readOnly);

                        tempObject.push(fieldInfo);
                    }
                }
                tempArray.push(tempObject);
                valueAttributes.push(tempArray);
            }
        }
        gArray[subGroup.getSubgroupName()] = valueAttributes;
    }

    logDebug("EXIT: getTemplateValueByTableArrays");

    return gArray;
}
function setContactASI(templateModel, newAInfo) {
    logDebug("ENTER: setContactASI");
    var ignoreArr = new Array();
    var limitCopy = false;
    if (arguments.length > 1) {
        ignoreArr = arguments[1];
        limitCopy = true;
    }

    for (var item in newAInfo) {
        //Check list
        if (limitCopy) {
            var ignore = false;
            for (var i = 0; i < ignoreArr.length; i++)
                if (ignoreArr[i] == newAInfo[item].FieldName) {
                    ignore = true;
                    break;
                }
            if (ignore)
                continue;
        }
        setTemplateValueByForm(templateModel, newAInfo[item].SubGroupName, newAInfo[item].FieldName, newAInfo[item].Value);
    }

    logDebug("EXIT: setContactASI");
}
//Assumtion is both contact and rec has same columns with same name
function InsertTemplateTableRow(templateModel, tableSubgroup, tablevalue, colNames) {
    logDebug("ENTER: InsertTemplateTableRow");

    var aTable = "";
    var copyStr = " aTable = tablevalue;"
    eval(copyStr);

    var templateGroups = templateModel.getTemplateTables();
    var subGroups = templateGroups.get(0).getSubgroups();

    for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
        var subGroup = subGroups.get(subGroupIndex);
        if (tableSubgroup == subGroup.getSubgroupName()) {
            var rows = aa.util.newArrayList();

            if (typeof (aTable) == "object") {
                for (y in aTable) {
                    var fld = aa.util.newArrayList();
                    for (var idx = 0; idx < colNames.length; idx++) {
                        var v = aa.proxyInvoker.newInstance("com.accela.aa.template.field.GenericTemplateTableValue").getOutput();
                        v.setFieldName(colNames[idx]);
                        v.setValue(aTable[y][colNames[idx]]);
                        fld.add(v);
                    }

                    var t = aa.proxyInvoker.newInstance("com.accela.aa.template.subgroup.TemplateRow").getOutput();
                    t.setValues(fld);
                    rows.add(t);
                }

            }

            subGroup.setRows(rows);
            var rows = subGroup.getRows();
            logDebug(rows.size());
            if (rows == null || rows.size() == 0) {
                return null;
            }

            break;
        }
    }

    logDebug("EXIT: InsertTemplateTableRow");
}
//Assumtion is both contact and rec has same columns with same name
function copyCapASITtoContactASITTableRow(templateModel, subGroupName, groupName, tableFields) {
    logDebug("ENTER: copyCapASITtoContactASITTableRow");
    var templateGroups = templateModel.getTemplateTables();
    var subGroups = templateGroups.get(0).getSubgroups();
    for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
        var subGroup = subGroups.get(subGroupIndex);
        if (subGroupName == subGroup.getSubgroupName()) {
            //get contatct ASIT exist rows.
            /*var existRows = subGroup.getRows();
            if (existRows == null || existRows == "") {
                existRows = aa.util.newArrayList();
            }*/
            //commented out the rows above to force the truncation of the ASIT on the contact - SEA 10/14/13
            var existRows = aa.util.newArrayList();
            //get contatct ASIT exist row index.
            var existRowIndex = existRows.size();
            var maxRowIndex = tableFields.get(tableFields.size() - 1).getRowIndex();
			logDebug("copyCapASITtoContactASITTableRow maxRowIndex = " + maxRowIndex);
           //var addPointer = 1;
            for (var currentRowIndex = 1; currentRowIndex <= maxRowIndex; currentRowIndex++) {
				logDebug("copyCapASITtoContactASITTableRow currentRowIndex = " + currentRowIndex);
                var values = aa.util.newArrayList();
                var isAllFieldmatchArray = new Array();
                for (var idx = 0; idx < tableFields.size(); idx++) {
                    //Set Contact ASIT GenericTemplateTableValue from the Cap ASIT Fields
                    var appSpecificTableField = tableFields.get(idx);
                    var rowIndex = appSpecificTableField.getRowIndex();
                    if (rowIndex == currentRowIndex) {
						logDebug("copyCapASITtoContactASITTableRow rowIndex = " + rowIndex);
                        var fieldLabel = appSpecificTableField.getFieldLabel();
                        var inputValue = appSpecificTableField.getInputValue();
                        
						/*
						var mx = existRows.size();
                        for (var crix = 1; crix <= mx; crix++) {
                            isAllFieldmatchArray[crix] = false;
                            var singleTableValue = getTemplateValueByTableRow(templateModel, subGroupName, fieldLabel, crix);
                            isAllFieldmatchArray[crix] = isAllFieldmatchArray[crix] || (singleTableValue == inputValue);
                        }
						*/
                        var v = aa.proxyInvoker.newInstance("com.accela.aa.template.field.GenericTemplateTableValue").getOutput();
                        //v.setRowIndex(addPointer + existRowIndex);
						v.setRowIndex(currentRowIndex);
                        v.setGroupName(groupName);
                        v.setSubgroupName(subGroupName);
                        v.setFieldName(fieldLabel);
                        v.setValue(inputValue);
						logDebug("copyCapASITtoContactASITTableRow " + v.getGroupName() + " (" + v.getRowIndex() + ") " + v.getFieldName() + " = " + v.getValue());
                        values.add(v);
                    }
                }

                var isAllFieldmatch = false;
				/*
                for (var crix in isAllFieldmatchArray) {
                    if (isAllFieldmatchArray[crix] == true) {
                        isAllFieldmatch = true;
                        break;
                    }
                }
				*/
                if (!isAllFieldmatch) {
                    var t = aa.proxyInvoker.newInstance("com.accela.aa.template.subgroup.TemplateRow").getOutput();
                    t.setRowIndex(currentRowIndex);
                    t.setValues(values);
                    existRows.add(t);
					logDebug("copyCapASITtoContactASITTableRow adding row " + currentRowIndex);
                    //addPointer++;
                }
            }
            subGroup.setRows(existRows);
        }
    }
	logDebug("EXIT: copyCapASITtoContactASITTableRow");
}
/*----------/
| METHODS To support examples or triubleshoot
/----------*/
function GetAllASIT(gArray) {
    for (var tableName in gArray) {
        logDebug(tableName);
        var valueAttributes = gArray[tableName];
        for (var vv in valueAttributes) {
            var tempArray = valueAttributes[vv];
            for (var row in tempArray) {
                var tempObject = tempArray[row];
                for (var val in tempObject) {
                    var fieldInfo = tempObject[val];
                    logDebug(fieldInfo.columnName);
                    logDebug(fieldInfo.fieldValue);
                    logDebug(fieldInfo.readOnly);
                    logDebug('------');
                }
            }
        }
    }
}
function GetAllASI(subGroupArray) {
    for (var subGroupName in subGroupArray) {
        var fieldArray = subGroupArray[subGroupName];
        logDebug(subGroupName);
        for (var f in fieldArray) {
            logDebug(f + " : " + fieldArray[f]);
        }
    }
}
