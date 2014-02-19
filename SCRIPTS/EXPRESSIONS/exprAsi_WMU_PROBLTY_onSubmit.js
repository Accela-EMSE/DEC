var errorMessage = "Please enter valid number";

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValidProbability(val) {
    var isValid = true;
    if (isNumber(val)) {
        var num = parseFloat(val);
        isValid = !(num >= 0 && num <= 1);
    }
    return isValid;
}

var isValid = true;
var oC1 = expression.getValue("ASI::PROBABILITY INFORMATION::C1");
if (isValidProbability(oC1.value)) {
    oC1.message = errorMessage;
    expression.setReturn(oC1);
    isValid = false;
}

var oC2 = expression.getValue("ASI::PROBABILITY INFORMATION::C2");
if (isValidProbability(oC2.value)) {
    oC2.message = errorMessage;
    expression.setReturn(oC2);
    isValid = false;
}

var oC3 = expression.getValue("ASI::PROBABILITY INFORMATION::C3");
if (isValidProbability(oC3.value)) {
    oC3.message = errorMessage;
    expression.setReturn(oC3);
    isValid = false;
}

var oC4 = expression.getValue("ASI::PROBABILITY INFORMATION::C4");
if (isValidProbability(oC4.value)) {
    oC4.message = errorMessage;
    expression.setReturn(oC4);
    isValid = false;
}

var oC5 = expression.getValue("ASI::PROBABILITY INFORMATION::C5");
if (isValidProbability(oC5.value)) {
    oC5.message = errorMessage;
    expression.setReturn(oC5);
    isValid = false;
}

var oC6 = expression.getValue("ASI::PROBABILITY INFORMATION::C6");
if (isValidProbability(oC6.value)) {
    oC6.message = errorMessage;
    expression.setReturn(oC6);
    isValid = false;
}

var oC7 = expression.getValue("ASI::PROBABILITY INFORMATION::C7");
if (isValidProbability(oC7.value)) {
    oC7.message = errorMessage;
    expression.setReturn(oC7);
    isValid = false;
}

var oC8 = expression.getValue("ASI::PROBABILITY INFORMATION::C8");
if (isValidProbability(oC8.value)) {
    oC8.message = errorMessage;
    expression.setReturn(oC8);
    isValid = false;
}

var oC9 = expression.getValue("ASI::PROBABILITY INFORMATION::C9");
if (isValidProbability(oC9.value)) {
    oC9.message = errorMessage;
    expression.setReturn(oC9);
    isValid = false;
}

var oC10 = expression.getValue("ASI::PROBABILITY INFORMATION::C10");
if (isValidProbability(oC10.value)) {
    oC10.message = errorMessage;
    expression.setReturn(oC10);
    isValid = false;
}

var oC11 = expression.getValue("ASI::PROBABILITY INFORMATION::C11");
if (isValidProbability(oC11.value)) {
    oC11.message = errorMessage;
    expression.setReturn(oC11);
    isValid = false;
}

var oC12 = expression.getValue("ASI::PROBABILITY INFORMATION::C12");
if (isValidProbability(oC12.value)) {
    oC12.message = errorMessage;
    expression.setReturn(oC12);
    isValid = false;
}

var oC13 = expression.getValue("ASI::PROBABILITY INFORMATION::C13");
if (isValidProbability(oC13.value)) {
    oC13.message = errorMessage;
    expression.setReturn(oC13);
    isValid = false;
}

var oC14 = expression.getValue("ASI::PROBABILITY INFORMATION::C14");
if (isValidProbability(oC14.value)) {
    oC14.message = errorMessage;
    expression.setReturn(oC14);
    isValid = false;
}

var oC15 = expression.getValue("ASI::PROBABILITY INFORMATION::C15");
if (isValidProbability(oC15.value)) {
    oC15.message = errorMessage;
    expression.setReturn(oC15);
    isValid = false;
}

var oC16 = expression.getValue("ASI::PROBABILITY INFORMATION::C16");
if (isValidProbability(oC16.value)) {
    oC16.message = errorMessage;
    expression.setReturn(oC16);
    isValid = false;
}

var oC17 = expression.getValue("ASI::PROBABILITY INFORMATION::C17");
if (isValidProbability(oC17.value)) {
    oC17.message = errorMessage;
    expression.setReturn(oC17);
    isValid = false;
}

var oAsiForm = expression.getValue("ASI::FORM");
oAsiForm.blockSubmit = !isValid;
expression.setReturn(oAsiForm);
