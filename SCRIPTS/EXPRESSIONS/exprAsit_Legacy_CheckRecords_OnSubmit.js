
var servProvCode = expression.getValue("$$servProvCode$$").value;
var form = expression.getValue("ASIT::LICENSE INFORMATION::FORM");

var totalRowCount = expression.getTotalRowCount();

var minRows = 1;
if (totalRowCount <= minRows) {
    form.message = "You must enter at least " + minRows + " row(s) on this table"; ;
    form.blockSubmit = true;
    expression.setReturn(form);
}
