var deceasedDate=expression.getValue("APPLICANT::applicant*deceasedDate");
var mailStop=expression.getValue("APPLICANTTPLFORM::CNT_MASTER::ADDITIONAL INFO::Stop Mail");
var thisForm=expression.getValue("APPLICANT::FORM");
var capTypeExpr=expression.getValue("CAP::capType");

deceasedDate.hidden = true;

if (capTypeExpr.getValue() != "Licenses/DEC Internal/Enforcement/Enforcement Request") {
	var stopSale = false;
	var blockMessage = "Cannot continue sale, selected applicant ";

	if (deceasedDate.getValue() != null && deceasedDate.getValue() != "" && deceasedDate.getValue() != undefined) {
		stopSale = true;
		blockMessage += "is deceased.";
	}

	if (mailStop.getValue() == "Y" || mailStop.getValue() == "Yes") {
		stopSale = true;
		blockMessage += "currently has a Mail Stop."
	}

	if (stopSale) {
		thisForm.blockSubmit = true;
		thisForm.message = blockMessage;
		expression.setReturn(thisForm);
	}	
}

