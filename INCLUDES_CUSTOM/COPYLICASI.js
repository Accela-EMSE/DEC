var capidstring = aa.env.getValue("cap");
var item = aa.env.getValue("item");
var value = aa.env.getValue("value");

var capIdResult = aa.cap.getCapID(capidstring);
if (capIdResult.getSuccess()) {
	var editCapId = capIdResult.getOutput();
	if (editCapId) {
		aa.appSpecificInfo.editSingleAppSpecific(editCapId,item,value,null);
		}
	}
	