var param = new Array();
param[0] ="SLA";
param[1] ="0";  
methodName = "getLicenseInfo";
var url = "http://170.123.234.42:80/NYSELS-SLA-WS-TEST/services/InformixDBTEST?wsdl";
var result = aa.wsConsumer.consume(url,methodName,param).getOutput();
aa.print(result[0]);