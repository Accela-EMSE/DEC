
function getAGE(argbirthDate) {
	var now = new Date();
	var birthDate = new Date(argbirthDate);

	function isLeap(year) {
		return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
	}

	// days since the birthdate
	var days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
	var age = 0;
	// iterate the years
	for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
		var daysInYear = isLeap(y) ? 366 : 365;
		if (days >= daysInYear) {
			days -= daysInYear;
			age++;
			// increment the age only if there are available enough days for the year.
		}
	}
	return age;
}

function diffDate(iDate1, iDate2) {
	return expression.diffDate(iDate1, iDate2);
}

var aa = expression.getScriptRoot();
var servProvCode = expression.getValue("$$servProvCode$$").value;
var userId=expression.getValue("$$userID$$");
var oToday = expression.getValue("$$today$$");
var isCitizen = false;

var bDate = expression.getValue("APPLICANT::applicant*birthDate");
var dlParent = expression.getValue("APPLICANTTPLFORM::CNT_MASTER::ADDITIONAL INFO::Parent Driver License Number");
var dlState=expression.getValue("APPLICANT::applicant*driverLicenseState");
var dlNbr=expression.getValue("APPLICANT::applicant*driverLicenseNbr");

var userIdString = userId.getValue();
var s_publicUserResult = aa.publicUser.getPublicUserByUserId(userIdString);

dlState.required = false;

if (s_publicUserResult.getSuccess()) {
	var pUserObj = s_publicUserResult.getOutput();

	if (pUserObj.getAccountType() == "CITIZEN") {
		dlState.required = true;
	}
}	


var msg = "";
dd = diffDate(oToday.getValue(), bDate.getValue());
if (dd > 0)
	msg = "Birth Date cannot be in the future";
if (dd < -36524)
	msg = "Birth Date cannot be more than 100 years into the past";
bDate.message = msg;
if (msg != "")
	bDate.value = ""
		expression.setReturn(bDate);

if (bDate.getValue() && getAGE(bDate.getValue) < 16) {
	dlParent.required = true;
	dlNbr.required = false;
} else {
	dlParent.required = false;
	dlNbr.required = true;
}
expression.setReturn(dlParent);
expression.setReturn(dlNbr);
expression.setReturn(dlState);












