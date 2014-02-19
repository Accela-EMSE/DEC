var errorMessage = "Order number cannot be same for two categories.";
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValidOrder(val) {
    var isValid = true;
    if (isNumber(val)) {
        var num = parseInt(val);
        isValid = !(xArray[num] > 1);
    }
    return isValid;
}

function setOrderArray(val) {
    if (isNumber(val)) {
        var num = parseInt(val);
        xArray[num] = xArray[num] + 1;
    }
}

var xArray = new Array();
for (var idx = 0; idx < 18; idx++) {
    xArray[xArray.length] = 0;
}

var oC1 = expression.getValue("ASI::PREFERENCE ORDER::C1");
var oC2 = expression.getValue("ASI::PREFERENCE ORDER::C2");
var oC3 = expression.getValue("ASI::PREFERENCE ORDER::C3");
var oC4 = expression.getValue("ASI::PREFERENCE ORDER::C4");
var oC5 = expression.getValue("ASI::PREFERENCE ORDER::C5");
var oC6 = expression.getValue("ASI::PREFERENCE ORDER::C6");
var oC7 = expression.getValue("ASI::PREFERENCE ORDER::C7");
var oC8 = expression.getValue("ASI::PREFERENCE ORDER::C8");
var oC9 = expression.getValue("ASI::PREFERENCE ORDER::C9");
var oC10 = expression.getValue("ASI::PREFERENCE ORDER::C10");
var oC11 = expression.getValue("ASI::PREFERENCE ORDER::C11");
var oC12 = expression.getValue("ASI::PREFERENCE ORDER::C12");
var oC13 = expression.getValue("ASI::PREFERENCE ORDER::C13");
var oC14 = expression.getValue("ASI::PREFERENCE ORDER::C14");
var oC15 = expression.getValue("ASI::PREFERENCE ORDER::C15");
var oC16 = expression.getValue("ASI::PREFERENCE ORDER::C16");
var oC17 = expression.getValue("ASI::PREFERENCE ORDER::C17");

setOrderArray(oC1.value);
setOrderArray(oC2.value);
setOrderArray(oC3.value);
setOrderArray(oC4.value);
setOrderArray(oC5.value);
setOrderArray(oC6.value);
setOrderArray(oC7.value);
setOrderArray(oC8.value);
setOrderArray(oC9.value);
setOrderArray(oC10.value);
setOrderArray(oC11.value);
setOrderArray(oC12.value);
setOrderArray(oC13.value);
setOrderArray(oC14.value);
setOrderArray(oC15.value);
setOrderArray(oC16.value);
setOrderArray(oC17.value);

var isValid = true;
if (isValidOrder(oC1.value)) {
    oC2.message = "";
} else {
    oC1.message = errorMessage;
    expression.setReturn(oC1);
    isValid = false;
}

if (isValidOrder(oC2.value)) {
    oC2.message = "";
} else {
    oC2.message = errorMessage;
    expression.setReturn(oC2);
    isValid = false;
}

if (isValidOrder(oC3.value)) {
    oC3.message = "";
} else {
    oC3.message = errorMessage;
    expression.setReturn(oC3);
    isValid = false;
}

if (isValidOrder(oC4.value)) {
    oC4.message = "";
} else {
    oC4.message = errorMessage;
    expression.setReturn(oC4);
    isValid = false;
}

if (isValidOrder(oC5.value)) {
    oC5.message = "";
} else {
    oC5.message = errorMessage;
    expression.setReturn(oC5);
    isValid = false;
}

if (isValidOrder(oC6.value)) {
    oC6.message = "";
} else {
    oC6.message = errorMessage;
    expression.setReturn(oC6);
    isValid = false;
}

if (isValidOrder(oC7.value)) {
    oC7.message = "";
} else {
    oC7.message = errorMessage;
    expression.setReturn(oC7);
    isValid = false;
}

if (isValidOrder(oC8.value)) {
    oC8.message = "";
} else {
    oC8.message = errorMessage;
    expression.setReturn(oC8);
    isValid = false;
}

if (isValidOrder(oC9.value)) {
    oC9.message = "";
} else {
    oC9.message = errorMessage;
    expression.setReturn(oC9);
    isValid = false;
}

if (isValidOrder(oC10.value)) {
    oC10.message = "";
} else {
    oC10.message = errorMessage;
    expression.setReturn(oC10);
    isValid = false;
}

if (isValidOrder(oC11.value)) {
    oC11.message = "";
} else {
    oC11.message = errorMessage;
    expression.setReturn(oC11);
    isValid = false;
}

if (isValidOrder(oC12.value)) {
    oC12.message = "";
} else {
    oC12.message = errorMessage;
    expression.setReturn(oC12);
    isValid = false;
}

if (isValidOrder(oC13.value)) {
    oC13.message = "";
} else {
    oC13.message = errorMessage;
    expression.setReturn(oC13);
    isValid = false;
}

if (isValidOrder(oC14.value)) {
    oC14.message = "";
} else {
    oC14.message = errorMessage;
    expression.setReturn(oC14);
    isValid = false;
}

if (isValidOrder(oC15.value)) {
    oC15.message = "";
} else {
    oC15.message = errorMessage;
    expression.setReturn(oC15);
    isValid = false;
}

if (isValidOrder(oC16.value)) {
    oC16.message = "";
} else {
    oC16.message = errorMessage;
    expression.setReturn(oC16);
    isValid = false;
}

if (isValidOrder(oC17.value)) {
    oC17.message = "";
} else {
    oC17.message = errorMessage;
    expression.setReturn(oC17);
    isValid = false;
}

var oAsiForm = expression.getValue("ASI::FORM");
oAsiForm.blockSubmit = !isValid;
expression.setReturn(oAsiForm);
