var flag =false;
try{
var RecordID =String(aa.env.getValue("RECORDID"));//String("13CAP-00000-00A5K");
var capId = aa.cap.getCapID(RecordID).getOutput();
aa.print(capId);
var tssm = aa.appSpecificTableScript.getAppSpecificTableModel(capId,"SET_STATUS").getOutput();
var tsm = tssm.getAppSpecificTableModel();
var fld = tsm.getTableField();
aa.print(fld);
if(fld.size() > 0){
var returnList = new Array();
for(var i = 0; i < fld.size(); i++) {
returnList.push(String(fld.get(i)));
}
var returnJSON = JSON.stringify(returnList, replacer);
aa.env.setValue("ASITLIST",returnJSON);
aa.env.setValue("ScriptReturnCode","0"); 
aa.env.setValue("ScriptReturnMessage","Record Found");
}else{
aa.env.setValue("ScriptReturnCode","0");
aa.env.setValue("ScriptReturnMessage","No Record Found");
}
}
catch(err){
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage",err);
}


function replacer(key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}