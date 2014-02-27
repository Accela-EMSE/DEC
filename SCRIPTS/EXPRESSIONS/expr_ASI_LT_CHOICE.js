var servProvCode=expression.getValue("$$servProvCode$$").value;
var onRenew =expression.getValue("ASI::LIFETIME LICENSES::Add Lifetime to Driver License on Renewal");
var onImmed =expression.getValue("ASI::LIFETIME LICENSES::Add Lifetime to Driver License Re-Issue Immediately");

if (onRenew.value == "CHECKED" && onImmed.value == "CHECKED") {
  onImmed.value = "";
  expression.setReturn(onImmed);
  }
