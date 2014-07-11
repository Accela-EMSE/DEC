var capidstring = aa.env.getValue("capidstring");
var boolIncrementUsedCount = ""+aa.env.getValue("boolIncrementUsedCount");
var boolIsClosed = "" + aa.env.getValue("boolIsClosed");
var boolUpdateEffectiveDate = "" + aa.env.getValue("boolUpdateEffectiveDate");

aa.debug("UPDATE_WMU_RECORD_ASYNC", "Enter for record" + capidstring);


try {
	var capIdResult = aa.cap.getCapID(capidstring);
	if (capIdResult.getSuccess()) {
		var editCapId = capIdResult.getOutput();
		if (editCapId) {
		
			var retval = "Enter for record" + capidstring;

			if ("YES".equals(boolIncrementUsedCount)) {
				var value = getSingleAsiValue(editCapId, "Used Count");
				if (value) {
					value = parseInt(value) + 1;
					aa.appSpecificInfo.editSingleAppSpecific(editCapId, "Used Count", value, null);
					aa.debug("UPDATE_WMU_RECORD_ASYNC", "Incremented Used Count to " + value);
					retval += "Incremented Used Count to " + value + " " + boolIncrementUsedCount + " " + boolIncrementUsedCount.length;
				}
			}

			if ("YES".equals(boolIsClosed)) {
				aa.appSpecificInfo.editSingleAppSpecific(editCapId, "Status", "Closed", null);
				aa.debug("UPDATE_WMU_RECORD_ASYNC", "Updated status to Closed");
				retval += "Updated status to Closed "+ boolIsClosed + " " + boolIsClosed.length;
			}

			if ("YES".equals(boolUpdateEffectiveDate)) {
				aa.appSpecificInfo.editSingleAppSpecific(editCapId, "Status Effecctive Date", formatMMDDYYYY(new Date()), null);
				aa.debug("UPDATE_WMU_RECORD_ASYNC", "Updated Effecctive Date to now");
				retval += "Updated Effecctive Date to now " + boolUpdateEffectiveDate + " " + boolUpdateEffectiveDate.length;
			}
			
			aa.env.setValue("RETURNMSG",retval);
			
		} else {
			aa.env.setValue("RETURNMSG", "ERROR cap id not valid");
		}
	} else {
		aa.env.setValue("RETURNMSG", "ERROR retrieving record (" + capidstring + ") " + capIdResult.getErrorMessage());
	}
} catch (err) {
	aa.env.setValue("RETURNMSG", "ERROR in UPDATE_WMU_RECORD_ASYNC " + err); 
	}

function formatMMDDYYYY(pDate) {
	var dDate = new Date(pDate);

	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}

function getSingleAsiValue(itemCapId, fieldName) {
	var getASIItemResult = aa.appSpecificInfo.getAppSpecificInfos(itemCapId, null, fieldName);
	if (getASIItemResult.getSuccess()) {
		var asiItems = getASIItemResult.getOutput();
		if (asiItems[0]) {
			return asiItems[0].getChecklistComment();
		}
	}
	return false;
}
