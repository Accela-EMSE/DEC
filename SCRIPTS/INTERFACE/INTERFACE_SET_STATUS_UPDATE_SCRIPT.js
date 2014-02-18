/*------------------------------------------------------------------------------------------------------/
| Program : Set Update Status Service
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|   The following script code will attempt to read the assocaite event and invoker the proper standard choices
|    
/------------------------------------------------------------------------------------------------------*/

/* For script test testing purposes
aa.env.setValue("SET_ID","DAILY_10/17/2013_1");
aa.env.setValue("SET_STATUS","Fullfillment Processed");
aa.env.setValue("SET_STATUSCOMMENT","Fullfillment Processed");

*/

var SETID = aa.env.getValue("SET_ID");
var SETSTATUS = aa.env.getValue("SET_STATUS");
var SETCOMMENT = aa.env.getValue("SET_STATUSCOMMENT");


//get Set List by SetID.

var setResult = aa.set.getSetByPK(SETID);

try {
    if (setResult.getSuccess()) {
    
        thisSet = setResult.getOutput();
        thisSet.setSetStatus(String(SETSTATUS));
        thisSet.setSetStatusComment(String(SETCOMMENT));
        thisSet.setSetComment(String(SETCOMMENT));
        var setUpdateResult = aa.set.updateSetHeader(thisSet);
    	if (setUpdateResult.getSuccess()) {
    		aa.env.setValue("InterfaceReturnCode","0");
    		aa.env.setValue("InterfaceReturnMessage","Success"); 
    	} else {
     		aa.env.setValue("InterfaceReturnCode","1");
    		aa.env.setValue("InterfaceReturnMessage",setUpdateResult.getErrorMessage());   	    		
    	}
 
    } else {
     	aa.env.setValue("InterfaceReturnCode","1");
    	aa.env.setValue("InterfaceReturnMessage",setResult.getErrorMessage());   	
    }

} catch (err) {
    aa.env.setValue("InterfaceReturnCode","1");
    aa.env.setValue("InterfaceReturnMessage",err);

}

/* For script test testing purposes
aa.print(aa.env.getValue("InterfaceReturnCode"));
aa.print(aa.env.getValue("InterfaceReturnMessage"));
*/