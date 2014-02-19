var sCapStatus = expression.getValue("CAP::capModel*capStatus");

var oAsiForm = expression.getValue("ASI::FORM");
var isNew = (sCapStatus.value != null && sCapStatus.value.equals(String("")));
var isCapClosed = (sCapStatus.value != null && sCapStatus.value.equals(String("Closed")));

oAsiForm.message = "Note: Process will take 2 to 3 minutes to create all records.";
expression.setReturn(oAsiForm);

var oLicYear = expression.getValue("ASI::BASIC INFORMATION::License Year");
oLicYear.readOnly = !isNew;
expression.setReturn(oLicYear);


var o1A = expression.getValue("ASI::WMU LIST::1A");
o1A.hidden = (isNew || isCapClosed);
o1A.value = false;
expression.setReturn(o1A);

var o1C = expression.getValue("ASI::WMU LIST::1C");
o1C.hidden = (isNew || isCapClosed);
o1C.value = false;
expression.setReturn(o1C);

var o2A = expression.getValue("ASI::WMU LIST::2A");
o2A.hidden = (isNew || isCapClosed);
o2A.value = false;
expression.setReturn(o2A);

var o3A = expression.getValue("ASI::WMU LIST::3A");
o3A.hidden = (isNew || isCapClosed);
o3A.value = false;
expression.setReturn(o3A);

var o3C = expression.getValue("ASI::WMU LIST::3C");
o3C.hidden = (isNew || isCapClosed);
o3C.value = false;
expression.setReturn(o3C);

var o3F = expression.getValue("ASI::WMU LIST::3F");
o3F.hidden = (isNew || isCapClosed);
o3F.value = false;
expression.setReturn(o3F);

var o3G = expression.getValue("ASI::WMU LIST::3G");
o3G.hidden = (isNew || isCapClosed);
o3G.value = false;
expression.setReturn(o3G);

var o3H = expression.getValue("ASI::WMU LIST::3H");
o3H.hidden = (isNew || isCapClosed);
o3H.value = false;
expression.setReturn(o3H);

var o3J = expression.getValue("ASI::WMU LIST::3J");
o3J.hidden = (isNew || isCapClosed);
o3J.value = false;
expression.setReturn(o3J);

var o3K = expression.getValue("ASI::WMU LIST::3K");
o3K.hidden = (isNew || isCapClosed);
o3K.value = false;
expression.setReturn(o3K);

var o3M = expression.getValue("ASI::WMU LIST::3M");
o3M.hidden = (isNew || isCapClosed);
o3M.value = false;
expression.setReturn(o3M);

var o3N = expression.getValue("ASI::WMU LIST::3N");
o3N.hidden = (isNew || isCapClosed);
o3N.value = false;
expression.setReturn(o3N);

var o3P = expression.getValue("ASI::WMU LIST::3P");
o3P.hidden = (isNew || isCapClosed);
o3P.value = false;
expression.setReturn(o3P);

var o3R = expression.getValue("ASI::WMU LIST::3R");
o3R.hidden = (isNew || isCapClosed);
o3R.value = false;
expression.setReturn(o3R);

var o3S = expression.getValue("ASI::WMU LIST::3S");
o3S.hidden = (isNew || isCapClosed);
o3S.value = false;
expression.setReturn(o3S);

var o4A = expression.getValue("ASI::WMU LIST::4A");
o4A.hidden = (isNew || isCapClosed);
o4A.value = false;
expression.setReturn(o4A);

var o4B = expression.getValue("ASI::WMU LIST::4B");
o4B.hidden = (isNew || isCapClosed);
o4B.value = false;
expression.setReturn(o4B);

var o4C = expression.getValue("ASI::WMU LIST::4C");
o4C.hidden = (isNew || isCapClosed);
o4C.value = false;
expression.setReturn(o4C);

var o4F = expression.getValue("ASI::WMU LIST::4F");
o4F.hidden = (isNew || isCapClosed);
o4F.value = false;
expression.setReturn(o4F);

var o4G = expression.getValue("ASI::WMU LIST::4G");
o4G.hidden = (isNew || isCapClosed);
o4G.value = false;
expression.setReturn(o4G);

var o4H = expression.getValue("ASI::WMU LIST::4H");
o4H.hidden = (isNew || isCapClosed);
o4H.value = false;
expression.setReturn(o4H);

var o4J = expression.getValue("ASI::WMU LIST::4J");
o4J.hidden = (isNew || isCapClosed);
o4J.value = false;
expression.setReturn(o4J);

var o4K = expression.getValue("ASI::WMU LIST::4K");
o4K.hidden = (isNew || isCapClosed);
o4K.value = false;
expression.setReturn(o4K);

var o4L = expression.getValue("ASI::WMU LIST::4L");
o4L.hidden = (isNew || isCapClosed);
o4L.value = false;
expression.setReturn(o4L);

var o4O = expression.getValue("ASI::WMU LIST::4O");
o4O.hidden = (isNew || isCapClosed);
o4O.value = false;
expression.setReturn(o4O);

var o4P = expression.getValue("ASI::WMU LIST::4P");
o4P.hidden = (isNew || isCapClosed);
o4P.value = false;
expression.setReturn(o4P);

var o4R = expression.getValue("ASI::WMU LIST::4R");
o4R.hidden = (isNew || isCapClosed);
o4R.value = false;
expression.setReturn(o4R);

var o4S = expression.getValue("ASI::WMU LIST::4S");
o4S.hidden = (isNew || isCapClosed);
o4S.value = false;
expression.setReturn(o4S);

var o4T = expression.getValue("ASI::WMU LIST::4T");
o4T.hidden = (isNew || isCapClosed);
o4T.value = false;
expression.setReturn(o4T);

var o4U = expression.getValue("ASI::WMU LIST::4U");
o4U.hidden = (isNew || isCapClosed);
o4U.value = false;
expression.setReturn(o4U);

var o4W = expression.getValue("ASI::WMU LIST::4W");
o4W.hidden = (isNew || isCapClosed);
o4W.value = false;
expression.setReturn(o4W);

var o4Y = expression.getValue("ASI::WMU LIST::4Y");
o4Y.hidden = (isNew || isCapClosed);
o4Y.value = false;
expression.setReturn(o4Y);

var o4Z = expression.getValue("ASI::WMU LIST::4Z");
o4Z.hidden = (isNew || isCapClosed);
o4Z.value = false;
expression.setReturn(o4Z);

var o5A = expression.getValue("ASI::WMU LIST::5A");
o5A.hidden = (isNew || isCapClosed);
o5A.value = false;
expression.setReturn(o5A);

var o5C = expression.getValue("ASI::WMU LIST::5C");
o5C.hidden = (isNew || isCapClosed);
o5C.value = false;
expression.setReturn(o5C);

var o5F = expression.getValue("ASI::WMU LIST::5F");
o5F.hidden = (isNew || isCapClosed);
o5F.value = false;
expression.setReturn(o5F);

var o5G = expression.getValue("ASI::WMU LIST::5G");
o5G.hidden = (isNew || isCapClosed);
o5G.value = false;
expression.setReturn(o5G);

var o5H = expression.getValue("ASI::WMU LIST::5H");
o5H.hidden = (isNew || isCapClosed);
o5H.value = false;
expression.setReturn(o5H);

var o5J = expression.getValue("ASI::WMU LIST::5J");
o5J.hidden = (isNew || isCapClosed);
o5J.value = false;
expression.setReturn(o5J);

var o5R = expression.getValue("ASI::WMU LIST::5R");
o5R.hidden = (isNew || isCapClosed);
o5R.value = false;
expression.setReturn(o5R);

var o5S = expression.getValue("ASI::WMU LIST::5S");
o5S.hidden = (isNew || isCapClosed);
o5S.value = false;
expression.setReturn(o5S);

var o5T = expression.getValue("ASI::WMU LIST::5T");
o5T.hidden = (isNew || isCapClosed);
o5T.value = false;
expression.setReturn(o5T);

var o6A = expression.getValue("ASI::WMU LIST::6A");
o6A.hidden = (isNew || isCapClosed);
o6A.value = false;
expression.setReturn(o6A);

var o6C = expression.getValue("ASI::WMU LIST::6C");
o6C.hidden = (isNew || isCapClosed);
o6C.value = false;
expression.setReturn(o6C);

var o6F = expression.getValue("ASI::WMU LIST::6F");
o6F.hidden = (isNew || isCapClosed);
o6F.value = false;
expression.setReturn(o6F);

var o6G = expression.getValue("ASI::WMU LIST::6G");
o6G.hidden = (isNew || isCapClosed);
o6G.value = false;
expression.setReturn(o6G);

var o6H = expression.getValue("ASI::WMU LIST::6H");
o6H.hidden = (isNew || isCapClosed);
o6H.value = false;
expression.setReturn(o6H);

var o6J = expression.getValue("ASI::WMU LIST::6J");
o6J.hidden = (isNew || isCapClosed);
o6J.value = false;
expression.setReturn(o6J);

var o6K = expression.getValue("ASI::WMU LIST::6K");
o6K.hidden = (isNew || isCapClosed);
o6K.value = false;
expression.setReturn(o6K);

var o6N = expression.getValue("ASI::WMU LIST::6N");
o6N.hidden = (isNew || isCapClosed);
o6N.value = false;
expression.setReturn(o6N);

var o6P = expression.getValue("ASI::WMU LIST::6P");
o6P.hidden = (isNew || isCapClosed);
o6P.value = false;
expression.setReturn(o6P);

var o6R = expression.getValue("ASI::WMU LIST::6R");
o6R.hidden = (isNew || isCapClosed);
o6R.value = false;
expression.setReturn(o6R);

var o6S = expression.getValue("ASI::WMU LIST::6S");
o6S.hidden = (isNew || isCapClosed);
o6S.value = false;
expression.setReturn(o6S);

var o7A = expression.getValue("ASI::WMU LIST::7A");
o7A.hidden = (isNew || isCapClosed);
o7A.value = false;
expression.setReturn(o7A);

var o7F = expression.getValue("ASI::WMU LIST::7F");
o7F.hidden = (isNew || isCapClosed);
o7F.value = false;
expression.setReturn(o7F);

var o7H = expression.getValue("ASI::WMU LIST::7H");
o7H.hidden = (isNew || isCapClosed);
o7H.value = false;
expression.setReturn(o7H);

var o7J = expression.getValue("ASI::WMU LIST::7J");
o7J.hidden = (isNew || isCapClosed);
o7J.value = false;
expression.setReturn(o7J);

var o7M = expression.getValue("ASI::WMU LIST::7M");
o7M.hidden = (isNew || isCapClosed);
o7M.value = false;
expression.setReturn(o7M);

var o7P = expression.getValue("ASI::WMU LIST::7P");
o7P.hidden = (isNew || isCapClosed);
o7P.value = false;
expression.setReturn(o7P);

var o7R = expression.getValue("ASI::WMU LIST::7R");
o7R.hidden = (isNew || isCapClosed);
o7R.value = false;
expression.setReturn(o7R);

var o7S = expression.getValue("ASI::WMU LIST::7S");
o7S.hidden = (isNew || isCapClosed);
o7S.value = false;
expression.setReturn(o7S);

var o8A = expression.getValue("ASI::WMU LIST::8A");
o8A.hidden = (isNew || isCapClosed);
o8A.value = false;
expression.setReturn(o8A);

var o8C = expression.getValue("ASI::WMU LIST::8C");
o8C.hidden = (isNew || isCapClosed);
o8C.value = false;
expression.setReturn(o8C);

var o8F = expression.getValue("ASI::WMU LIST::8F");
o8F.hidden = (isNew || isCapClosed);
o8F.value = false;
expression.setReturn(o8F);

var o8G = expression.getValue("ASI::WMU LIST::8G");
o8G.hidden = (isNew || isCapClosed);
o8G.value = false;
expression.setReturn(o8G);

var o8H = expression.getValue("ASI::WMU LIST::8H");
o8H.hidden = (isNew || isCapClosed);
o8H.value = false;
expression.setReturn(o8H);

var o8J = expression.getValue("ASI::WMU LIST::8J");
o8J.hidden = (isNew || isCapClosed);
o8J.value = false;
expression.setReturn(o8J);

var o8M = expression.getValue("ASI::WMU LIST::8M");
o8M.hidden = (isNew || isCapClosed);
o8M.value = false;
expression.setReturn(o8M);

var o8N = expression.getValue("ASI::WMU LIST::8N");
o8N.hidden = (isNew || isCapClosed);
o8N.value = false;
expression.setReturn(o8N);

var o8P = expression.getValue("ASI::WMU LIST::8P");
o8P.hidden = (isNew || isCapClosed);
o8P.value = false;
expression.setReturn(o8P);

var o8R = expression.getValue("ASI::WMU LIST::8R");
o8R.hidden = (isNew || isCapClosed);
o8R.value = false;
expression.setReturn(o8R);

var o8S = expression.getValue("ASI::WMU LIST::8S");
o8S.hidden = (isNew || isCapClosed);
o8S.value = false;
expression.setReturn(o8S);

var o8T = expression.getValue("ASI::WMU LIST::8T");
o8T.hidden = (isNew || isCapClosed);
o8T.value = false;
expression.setReturn(o8T);

var o8W = expression.getValue("ASI::WMU LIST::8W");
o8W.hidden = (isNew || isCapClosed);
o8W.value = false;
expression.setReturn(o8W);

var o8X = expression.getValue("ASI::WMU LIST::8X");
o8X.hidden = (isNew || isCapClosed);
o8X.value = false;
expression.setReturn(o8X);

var o8Y = expression.getValue("ASI::WMU LIST::8Y");
o8Y.hidden = (isNew || isCapClosed);
o8Y.value = false;
expression.setReturn(o8Y);

var o9A = expression.getValue("ASI::WMU LIST::9A");
o9A.hidden = (isNew || isCapClosed);
o9A.value = false;
expression.setReturn(o9A);

var o9C = expression.getValue("ASI::WMU LIST::9C");
o9C.hidden = (isNew || isCapClosed);
o9C.value = false;
expression.setReturn(o9C);

var o9F = expression.getValue("ASI::WMU LIST::9F");
o9F.hidden = (isNew || isCapClosed);
o9F.value = false;
expression.setReturn(o9F);

var o9G = expression.getValue("ASI::WMU LIST::9G");
o9G.hidden = (isNew || isCapClosed);
o9G.value = false;
expression.setReturn(o9G);

var o9H = expression.getValue("ASI::WMU LIST::9H");
o9H.hidden = (isNew || isCapClosed);
o9H.value = false;
expression.setReturn(o9H);

var o9J = expression.getValue("ASI::WMU LIST::9J");
o9J.hidden = (isNew || isCapClosed);
o9J.value = false;
expression.setReturn(o9J);

var o9K = expression.getValue("ASI::WMU LIST::9K");
o9K.hidden = (isNew || isCapClosed);
o9K.value = false;
expression.setReturn(o9K);

var o9M = expression.getValue("ASI::WMU LIST::9M");
o9M.hidden = (isNew || isCapClosed);
o9M.value = false;
expression.setReturn(o9M);

var o9N = expression.getValue("ASI::WMU LIST::9N");
o9N.hidden = (isNew || isCapClosed);
o9N.value = false;
expression.setReturn(o9N);

var o9P = expression.getValue("ASI::WMU LIST::9P");
o9P.hidden = (isNew || isCapClosed);
o9P.value = false;
expression.setReturn(o9P);

var o9R = expression.getValue("ASI::WMU LIST::9R");
o9R.hidden = (isNew || isCapClosed);
o9R.value = false;
expression.setReturn(o9R);

var o9S = expression.getValue("ASI::WMU LIST::9S");
o9S.hidden = (isNew || isCapClosed);
o9S.value = false;
expression.setReturn(o9S);

var o9T = expression.getValue("ASI::WMU LIST::9T");
o9T.hidden = (isNew || isCapClosed);
o9T.value = false;
expression.setReturn(o9T);

var o9W = expression.getValue("ASI::WMU LIST::9W");
o9W.hidden = (isNew || isCapClosed);
o9W.value = false;
expression.setReturn(o9W);

var o9X = expression.getValue("ASI::WMU LIST::9X");
o9X.hidden = (isNew || isCapClosed);
o9X.value = false;
expression.setReturn(o9X);

var o9Y = expression.getValue("ASI::WMU LIST::9Y");
o9Y.hidden = (isNew || isCapClosed);
o9Y.value = false;
expression.setReturn(o9Y);

var oCloseDt = expression.getValue("ASI::CONFIGURATION::Close Date");
oCloseDt.hidden = (isNew || isCapClosed);
oCloseDt.required = !(isNew || isCapClosed);
//oCloseDt.value = '';
expression.setReturn(oCloseDt);

var oOpenDt = expression.getValue("ASI::CONFIGURATION::Open Date");
oOpenDt.hidden = (isNew || isCapClosed);
oOpenDt.required = !(isNew || isCapClosed);
//oOpenDt.value = '';
expression.setReturn(oOpenDt);

var oPermitTarget = expression.getValue("ASI::CONFIGURATION::Permit Target");
oPermitTarget.hidden = (isNew || isCapClosed);
oPermitTarget.required = !(isNew || isCapClosed);
//oPermitTarget.value = '';
expression.setReturn(oPermitTarget);

var oSex = expression.getValue("ASI::CONFIGURATION::Sex");
oSex.hidden = (isNew || isCapClosed);
//oSex.value = '';
expression.setReturn(oSex);

var oStatus = expression.getValue("ASI::CONFIGURATION::Status");
oStatus.hidden = (isNew || isCapClosed);
oStatus.required = !(isNew || isCapClosed);
//oStatus.value = '';
expression.setReturn(oStatus);

var oStatusApplicableTo = expression.getValue("ASI::CONFIGURATION::Status Applicable To");
oStatusApplicableTo.hidden = (isNew || isCapClosed);
oStatusApplicableTo.required = !(isNew || isCapClosed);
//oStatusApplicableTo.value = '';
expression.setReturn(oStatusApplicableTo);

var oStatuseffectiveDt = expression.getValue("ASI::CONFIGURATION::Status Effecctive Date");
oStatuseffectiveDt.hidden = (isNew || isCapClosed);
oStatuseffectiveDt.required = !(isNew || isCapClosed);
oStatuseffectiveDt.readOnly = true;
//oStatuseffectiveDt.value = '';
expression.setReturn(oStatuseffectiveDt);

var oWeapon = expression.getValue("ASI::CONFIGURATION::Weapon");
oWeapon.hidden = (isNew || isCapClosed);
//oWeapon.value = '';
expression.setReturn(oWeapon);
