var errorMessage = "Please enter valid number";

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var isValid = true;

var oAsiForm = expression.getValue("ASI::FORM");
oAsiForm.blockSubmit = !isValid;
expression.setReturn(oAsiForm);
