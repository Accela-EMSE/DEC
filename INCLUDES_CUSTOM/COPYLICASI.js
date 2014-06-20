var cap = aa.env.getValue("cap");
var info = aa.env.getValue("info");

copyLicASI(cap,info);

function copyLicASI(newCap, newAInfo) {
    var ignoreArr = new Array();
    var limitCopy = false;
    if (arguments.length > 1) {
        ignoreArr = arguments[1];
        limitCopy = true;
    }
    for (var item in newAInfo) {
        //Check list
        if (limitCopy) {
            var ignore = false;
            for (var i = 0; i < ignoreArr.length; i++)
                if (ignoreArr[i] == newAInfo[item].FieldName) {
                    ignore = true;
                    break;
                }
            if (ignore)
                continue;
        }
		aa.appSpecificInfo.editSingleAppSpecific(newCap,newAInfo[item].FieldName,newAInfo[item].Value,null);
    }
}


