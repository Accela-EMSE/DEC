var sCapStatus = expression.getValue("CAP::capModel*capStatus");
var oLicYear = expression.getValue("ASI::BASIC INFORMATION::License Year");
oLicYear.readOnly = true;
expression.setReturn(oLicYear);

var oDrawType = expression.getValue("ASI::BASIC INFORMATION::Draw Type");
oDrawType.readOnly = true;
expression.setReturn(oDrawType);

var oWMU = expression.getValue("ASI::BASIC INFORMATION::WMU");
oWMU.readOnly = true;
expression.setReturn(oWMU);

var isCapClosed = (sCapStatus.value != null && sCapStatus.value.equals(String("Closed")));
var oC1 = expression.getValue("ASI::PROBABILITY INFORMATION::C1");
oC1.readOnly = isCapClosed;
expression.setReturn(oC1);

var oC2 = expression.getValue("ASI::PROBABILITY INFORMATION::C2");
oC2.readOnly = isCapClosed;
expression.setReturn(oC2);

var oC3 = expression.getValue("ASI::PROBABILITY INFORMATION::C3");
oC3.readOnly = isCapClosed;
expression.setReturn(oC3);

var oC4 = expression.getValue("ASI::PROBABILITY INFORMATION::C4");
oC4.readOnly = isCapClosed;
expression.setReturn(oC4);

var oC5 = expression.getValue("ASI::PROBABILITY INFORMATION::C5");
oC5.readOnly = isCapClosed;
expression.setReturn(oC5);

var oC6 = expression.getValue("ASI::PROBABILITY INFORMATION::C6");
oC6.readOnly = isCapClosed;
expression.setReturn(oC6);

var oC7 = expression.getValue("ASI::PROBABILITY INFORMATION::C7");
oC7.readOnly = isCapClosed;
expression.setReturn(oC7);

var oC8 = expression.getValue("ASI::PROBABILITY INFORMATION::C8");
oC8.readOnly = isCapClosed;
expression.setReturn(oC8);

var oC9 = expression.getValue("ASI::PROBABILITY INFORMATION::C9");
oC9.readOnly = isCapClosed;
expression.setReturn(oC9);

var oC10 = expression.getValue("ASI::PROBABILITY INFORMATION::C10");
oC10.readOnly = isCapClosed;
expression.setReturn(oC10);

var oC11 = expression.getValue("ASI::PROBABILITY INFORMATION::C11");
oC11.readOnly = isCapClosed;
expression.setReturn(oC11);

var oC12 = expression.getValue("ASI::PROBABILITY INFORMATION::C12");
oC12.readOnly = isCapClosed;
expression.setReturn(oC12);

var oC13 = expression.getValue("ASI::PROBABILITY INFORMATION::C13");
oC13.readOnly = isCapClosed;
expression.setReturn(oC13);

var oC14 = expression.getValue("ASI::PROBABILITY INFORMATION::C14");
oC14.readOnly = isCapClosed;
expression.setReturn(oC14);

var oC15 = expression.getValue("ASI::PROBABILITY INFORMATION::C15");
oC15.readOnly = isCapClosed;
expression.setReturn(oC15);

var oC16 = expression.getValue("ASI::PROBABILITY INFORMATION::C16");
oC16.readOnly = isCapClosed;
expression.setReturn(oC16);

var oC17 = expression.getValue("ASI::PROBABILITY INFORMATION::C17");
oC17.readOnly = isCapClosed;
expression.setReturn(oC17);

