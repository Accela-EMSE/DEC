/**
 * Accela Automation
 * $Id: ReportRunAfterInACA.js 2013-06-28 BEYOND SOFT\kay.li $
 *
 * Description:
 * ReportRunAfterInACA.js the EMSE Script for 12ACC-00792 Support for Authorized Agent Role in ACA
 *
 * Notes:
 *
 * Revision History:
 * 2013-06-28     Kay Li	Initial Version
 */

var reportInfo = aa.env.getValue("ReportInfoModel");
var currentUserID = aa.env.getValue("CurrentUserID");
var rePrintLogTableName = "REPRINT LOG";
var reportName = "TEST";
var capIDModel;


//if(isReprint(reportInfo))
//{
	var edmsEntityModel = reportInfo.getEDMSEntityIdModel();
	if(edmsEntityModel)
	{
		capIDModel = getCapID(edmsEntityModel.getCapId());
		if(capIDModel)
		{			
			// get existing print log.
			var asitResult = aa.appSpecificTableScript.getAppSpecificTableModel(capIDModel,rePrintLogTableName);
			var rePrintTimes = "0";
			var reprintReason = reportInfo.getReprintReason();
			var timeOfReprint = aa.util.now();
			var timeOfReprint = aa.util.formatDate(timeOfReprint, "yyyy-MM-dd HH:mm:ss") + "";
			
			if(asitResult.getSuccess())
			{
				var asit = asitResult.getOutput().getAppSpecificTableModel();
				
				// caculate the latest reprint times.
				if(asit.getTableField() != null && asit.getTableField().size() > 0)
				{
					rePrintTimes = asit.getTableField().size()/asit.getColumns().size() + "";
				}
				else 
				{
					rePrintTimes = "0";					
				}
			}
			
			var tableValueArray =  
				{
					"Report Name": reportName,
					"Reprint Times" : rePrintTimes,
					"Time of Reprint" : timeOfReprint,
					"Reprint Reason" : reprintReason
				};	
				
				//save the latest reprint log to ASIT.
				addToASITable(rePrintLogTableName, tableValueArray);			
		}
	}
//}

function getCapID(capIDString)
{
	var capID;
	if(capIDString)
	{
		var capIDArray = capIDString.split("-");
		if(capIDArray.length == 3)
		{
			var capIDResult = aa.cap.getCapID(capIDArray[0],capIDArray[1],capIDArray[2]);
			if(capIDResult.getSuccess())
			{
				capID = capIDResult.getOutput();
			}
		}
	}
	return capID;
}

/**
 * check whether the request is reprint.
 *
**/
function isReprint(reportInfo)
{
	if(reportInfo)
	{
		if(reportInfo.getReprintReason())
		{
				return true;
		}
	}
	return false;
}

function addToASITable(tableName,tableValues) // optional capId
{
	var itemCap = capIDModel;
	var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap,tableName)

	if (!tssmResult.getSuccess())
	{ 
		logDebugReport("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage()) ; return false 
	}

	var tssm = tssmResult.getOutput();
	var tsm = tssm.getAppSpecificTableModel();
	var fld = tsm.getTableField();
	var col = tsm.getColumns();
	var fld_readonly = tsm.getReadonlyField(); //get ReadOnly property
	var coli = col.iterator();

	while (coli.hasNext())
	{
		colname = coli.next();
		fld.add(tableValues[colname.getColumnName()]);
		fld_readonly.add(null);		
	}

	tsm.setTableField(fld);
	tsm.setReadonlyField(fld_readonly); // set readonly field

	addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, currentUserID);
	if (!addResult .getSuccess())
	{ 
		logDebugReport("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage()) ; return false 
	}
	else
	{
		logDebugReport("Successfully added record to ASI Table: " + tableName);
	}
}

function logDebugReport(errorMsg)
{
	aa.debug("error>>>>>>>>>",errorMsg);	
}