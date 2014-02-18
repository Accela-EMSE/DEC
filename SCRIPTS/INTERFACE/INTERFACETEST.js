var tempRows= aa.util.newArrayList();
var tempList = aa.util.newArrayList();
var v = aa.proxyInvoker.newInstance("com.accela.aa.template.field.GenericTemplateTableValue").getOutput();
v.setFieldName("Height");
v.setValue("3");
tempList.add(v);
var t = aa.proxyInvoker.newInstance("com.accela.aa.template.subgroup.TemplateRow").getOutput();
t.setValues(tempList);
tempRows.add(t);
aa.print(tempRows);

var templateRow = aa.genericTemplate.createTemplateRow(aa.util.parseLong("1"),tempRows);
aa.print(templateRow);