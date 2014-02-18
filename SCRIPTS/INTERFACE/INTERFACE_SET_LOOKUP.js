/*------------------------------------------------------------------------------------------------------/
| Program : Set Lookup Service
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|   The following script code will attempt to read the assocaite event and invoker the proper standard choices
|    
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("SET_ID","DAILY");
//aa.env.setValue("SET_TYPE","");
//aa.env.setValue("SET_STATUS","Ready For Fullfillment");

var SETID = aa.env.getValue("SET_ID");
var SETTYPE = aa.env.getValue("SET_TYPE");
var SETSTATUS = aa.env.getValue("SET_STATUS");


var setScriptSearch = aa.set.getSetHeaderScriptModel().getOutput();
    
setScriptSearch.setSetID(SETID);
setScriptSearch.setSetStatus(SETSTATUS);
setScriptSearch.setRecordSetType(SETTYPE);
setScriptSearch.setServiceProviderCode(aa.getServiceProviderCode());

var setHeaderList = aa.set.getSetHeaderListByModel(setScriptSearch);


try {
    if (setHeaderList.getSuccess()) {
    
        var returnList = new Array();

        var setList = setHeaderList.getOutput();
        for(var i = 0; i < setList.size(); i++) {
            returnList.push(String(setList.get(i).getSetID()));
            //aa.print(String(setList.get(i).getSetID()));
        }
        var returnJSON = JSON.stringify(returnList, replacer);
        aa.env.setValue("SETIDLIST",returnJSON);
        aa.env.setValue("InterfaceReturnCode","0"); 
    }
} catch (err) {
    aa.env.setValue("InterfaceReturnCode","1");
    aa.env.setValue("InterfaceReturnMessage","Request failed");
}

 
function replacer(key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}