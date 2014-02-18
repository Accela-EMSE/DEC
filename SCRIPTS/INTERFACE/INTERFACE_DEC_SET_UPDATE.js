/*------------------------------------------------------------------------------------------------------/
| Program : Set Update Status Service
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|   The following script code will attempt to read the assocaite event and invoker the proper standard choices
|    
/------------------------------------------------------------------------------------------------------*/

/*
aa.env.setValue("SETID","5008-7");
aa.env.setValue("STATUS","Sweep Pending");
aa.env.setValue("SETCOMMENT","SET Comments");
*/


var SETID = aa.env.getValue("SETID");;
var SETSTATUS = aa.env.getValue("STATUS");
var SETCOMMENT = aa.env.getValue("SETCOMMENT");
//var SETSTATUSCOMMENT = aa.env.getValue("STATUSCOMMENT");


//get Set List by SetID.

var setResult = aa.set.getSetByPK(SETID);

try {
    if (setResult.getSuccess()) {
    
        thisSet = setResult.getOutput();
        thisSet.setSetStatus(String(SETSTATUS));
        //thisSet.setSetStatusComment(String(SETSTATUSCOMMENT));
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
/*
aa.print(aa.env.getValue("InterfaceReturnCode"));
aa.print(aa.env.getValue("InterfaceReturnMessage"));
*/