var aa = expression.getScriptRoot();

var userId=expression.getValue("$$userID$$");
var dlState=expression.getValue("APPLICANT::applicant*driverLicenseState");
var dlNbr=expression.getValue("APPLICANT::applicant*driverLicenseNbr");
var resProofDocument=expression.getValue("APPLICANTTPLFORM::CNT_MASTER::ADDITIONAL INFO::NY Resident Proof Document");
var parentDLNbr=expression.getValue("APPLICANTTPLFORM::CNT_MASTER::ADDITIONAL INFO::Parent Driver License Number");
var stateIDNbr=expression.getValue("APPLICANT::applicant*stateIDNbr");

var userIdString = userId.getValue();

var s_publicUserResult = aa.publicUser.getPublicUserByUserId(userIdString);


if (s_publicUserResult.getSuccess()) {
	var pUserObj = s_publicUserResult.getOutput();

	if (pUserObj.getAccountType() == "CITIZEN") {
		
		var resProofDocumentString = resProofDocument.getValue();
		if (matches(resProofDocumentString,"Driver License")) {
			dlState.required = true;
			dlNbr.required = true;
			parentDLNbr.required = false;
			stateIDNbr.required = false;
		} else if (matches(resProofDocumentString,"Parents Drivers License")) {
			dlState.required = true;
			dlNbr.required = false;
			parentDLNbr.required = true;
			stateIDNbr.required = false;
		} else if (matches(resProofDocumentString,"Non-Driver ID")) {
			dlState.required = true;
			dlNbr.required = false;
			parentDLNbr.required = false;
			stateIDNbr.required = true;
		} else {
			dlState.required = false;
			dlNbr.required = false;
			parentDLNbr.required = false;
			stateIDNbr.required = false;			
		}
		expression.setReturn(dlState);
		expression.setReturn(dlNbr);
		expression.setReturn(parentDLNbr);
		expression.setReturn(stateIDNbr);
	}
}


function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)
   	if (arguments[i] == eVal)
   		return true;

}