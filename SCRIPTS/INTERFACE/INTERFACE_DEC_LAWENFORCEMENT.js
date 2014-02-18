var SCRIPT_VERSION = 2.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));

showMessage = true; showDebug = true;

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
var feet="";
var inches="";
var conditionType = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_CONDITION_TYPE").toString();
var conditionDesc = lookup("INTERFACE:CONFIGS","DEC_LAWENFORCEMENT_CONDITION_DESC").toString();
var dlState = aa.env.getValue("DL_STATE");
if(dlState.equals("null")){
dlState="";
}
var dlNumber = aa.env.getValue("DL_NUMBER");
if(dlNumber.equals("null")){
dlNumber="";
}

var fname = aa.env.getValue("FNAME");
var mname = aa.env.getValue("MNAME");
if(mname.equals("null")){
mname="";
}

var lname = aa.env.getValue("LNAME");
var bdate = aa.env.getValue("BIRTH_DATE");
if(bdate.equals("null")){
bdate="";
}

var phcountrycode = aa.env.getValue("PHONE_COUNTRY_CODE");
if(phcountrycode.equals("null")){
phcountrycode="";
}

var phone = aa.env.getValue("PHONE_NUMBER");
if(phone.equals("null")){
phone="";
}

var suffix = aa.env.getValue("NAME_SUFFIX");
if(suffix.equals("null")){
suffix="";
}

var address1 = aa.env.getValue("ADDRESS1");
var address2 = aa.env.getValue("ADDRESS2");
if(address2.equals("null")){
address2="";
}

var city = aa.env.getValue("CITY");
var state = aa.env.getValue("STATE");
var country = aa.env.getValue("COUNTRY");
var zipcode = aa.env.getValue("POSTAL_CODE");
var eyecolor = aa.env.getValue("EYE_COLOR");
if(eyecolor.equals("null")){
eyecolor="";
}else if(eyecolor.equals("BLU")){
eyecolor="Blue";
}else if(eyecolor.equals("BRO")){
eyecolor="Brown";
}else if(eyecolor.equals("GRN")){
eyecolor="Green";
}else if(eyecolor.equals("HAZ")){
eyecolor="Hazel";
}else if(eyecolor.equals("null")){
eyecolor="Gray";
}else if(eyecolor.equals("null")){
eyecolor="Black";
}else if(eyecolor.equals("null")){
eyecolor="Blue Green";
}else {
eyecolor="Other";
}
var gender = aa.env.getValue("GENDER");
if(gender.equals("null")){
gender="";
}
var height = aa.env.getValue("HEIGHT");
if(height.equals("null")){
height="";
}else{
feet=height.substring(0,2);
inches=height.substring(3,5);
}

var desc = aa.env.getValue("DESCRIPTION");
if(desc.equals("null")){
desc="";
}

var comment = aa.env.getValue("COMMENT");
if(comment.equals("null")){
comment ="";
}
var startDate = aa.env.getValue("START_DATE");
var endDate= aa.env.getValue("END_DATE");
var peopS =aa.people.createPeopleModel().getOutput();
var peopModelS = peopS.getPeopleModel();
peopModelS.setFirstName(fname);
peopModelS.setLastName(lname);
peopModelS.setBirthDate(aa.util.parseDate(bdate));
var r = aa.people.getPeopleByPeopleModel(peopModelS);
if (r.getSuccess())
{
var peopResultS = r.getOutput();
if(peopResultS.length > 0)
{
aa.env.setValue("seqNumber","00000");
aa.env.setValue("scriptResult","MATCHED");
}
else{
var peop =aa.people.createPeopleModel().getOutput();
var peopModel = peop.getPeopleModel();
peopModel.setFirstName(fname);
peopModel.setMiddleName(mname);
peopModel.setLastName(lname);
peopModel.setNamesuffix(suffix);
peopModel.setContactType("Individual");
peopModel.setAuditStatus("A");
peopModel.setServiceProviderCode("DEC");
peopModel.setPhone1CountryCode(phcountrycode);
peopModel.setPhone1(phone);
peopModel.setDriverLicenseState(dlState);
peopModel.setDriverLicenseNbr(dlNumber);
peopModel.setGender(gender);
peopModel.setBirthDate(aa.util.parseDate(bdate));
var result = aa.people.createPeople(peopModel);
var seqNumber = peop.getContactSeqNumber();
//Adding Contact Address
var contactAddressScriptModel = aa.address.createContactAddressModel().getOutput();
contactAddressScriptModel.setServiceProviderCode("DEC");
contactAddressScriptModel.setAuditStatus("A");
var contactAddressModel = contactAddressScriptModel.getContactAddressModel();
contactAddressModel.setEntityID(aa.util.parseLong(seqNumber));
contactAddressModel.setEntityType("CONTACT");
contactAddressModel.setAddressType("Mailing");
contactAddressModel.setAddressLine1(address1);
contactAddressModel.setAddressLine2(address2);
contactAddressModel.setCity(city);
contactAddressModel.setState(state);
contactAddressModel.setCountryCode(country);
contactAddressModel.setZip(zipcode);
var contactAddressModel = contactAddressScriptModel.getContactAddressModel();
aa.address.createContactAddress(contactAddressModel);
//Adding Condition for New Records Only
addEnforcementCondition(seqNumber,conditionType,conditionDesc,startDate,endDate,"Revocation in Force",desc,comment);
var pModel = creatDraftTemplate(seqNumber);

        if (pModel.getTemplate() != null) {
            //Update Remaining Fields
            var newAInfo = new Array();
            var subGroupName = "ADDITIONAL INFO";
            newAInfo.push(new NewTblDef("Preference Points", 0, subGroupName));
            newAInfo.push(new NewTblDef("Parent Driver License Number", null, subGroupName));
            newAInfo.push(new NewTblDef("NY Resident Proof Document", null, subGroupName));
            newAInfo.push(new NewTblDef("Are You New York Resident?", null, subGroupName));
            newAInfo.push(new NewTblDef("Lifetime No", null, subGroupName));
            newAInfo.push(new NewTblDef("Lifetime Inscription", null, subGroupName));
            newAInfo.push(new NewTblDef("Stop Mail", null, subGroupName));
            newAInfo.push(new NewTblDef("Unique Back Tag", null, subGroupName));

            subGroupName = "APPEARANCE";
            newAInfo.push(new NewTblDef("Height", feet, subGroupName));
            newAInfo.push(new NewTblDef("Height - inches", inches, subGroupName));
            newAInfo.push(new NewTblDef("Eye Color", eyecolor, subGroupName));
            newAInfo.push(new NewTblDef("Native American?", null, subGroupName));
            newAInfo.push(new NewTblDef("Legally Blind", null, subGroupName));
            newAInfo.push(new NewTblDef("Permanent Disability", null, subGroupName));
            newAInfo.push(new NewTblDef("Permanent Disability", null, subGroupName));

            subGroupName = "MILITARY ACTIVE SERVICE STATUS";
            newAInfo.push(new NewTblDef("Military Serviceman", 'N', subGroupName));
            newAInfo.push(new NewTblDef("NY Organized Militia", null, subGroupName));
            newAInfo.push(new NewTblDef("NY Organized Militia Type", null, subGroupName));
            newAInfo.push(new NewTblDef("U.S. Reserve Member", null, subGroupName));
            newAInfo.push(new NewTblDef("U.S. Reserve Member Type", null, subGroupName));
            newAInfo.push(new NewTblDef("Full-time U.S. Armed Service", null, subGroupName));
            newAInfo.push(new NewTblDef("Full-time U.S. Armed Service Type", null, subGroupName));
            newAInfo.push(new NewTblDef("Grade / Rank", null, subGroupName));
            newAInfo.push(new NewTblDef("Unit Name", null, subGroupName));
            newAInfo.push(new NewTblDef("Location", null, subGroupName));
            newAInfo.push(new NewTblDef("Name of Commanding Officer", null, subGroupName));
            newAInfo.push(new NewTblDef("Phone of Commanding Officer", null, subGroupName));
            newAInfo.push(new NewTblDef("Affirmation", null, subGroupName));
            newAInfo.push(new NewTblDef("Affidavit Date", null, subGroupName));

            setContactASI(pModel.getTemplate(), newAInfo);
        } else {
            logDebug("**Error: unable to create draft template");
        }
        aa.people.editPeople(pModel);

aa.env.setValue("seqNumber",seqNumber);
aa.env.setValue("scriptResult","NEWCONTACT");
}//end else
}//end r.getSuccess()
else
{
aa.env.setValue("seqNumber","00000");
aa.env.setValue("scriptResult","ERROR");
}


function creatDraftTemplate(peopleSequenceNumber) {
    logDebug("ENTER: creatDraftTemplate");
    var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
    if (peopleModel.getTemplate() == null) {
        var tmpl = getAnonymousTemplate();
        if (tmpl != null) {
            var e = tmpl.getEntityPKModel();
            e.setEntitySeq1(peopleSequenceNumber * 1);
            tmpl.setEntityPKModel(e);
            var ne = tmpl.getEntityPKModel()
            peopleModel.setTemplate(tmpl);
        } else {
            logDebug("**Error: not found dummy template");
        }
    }
    logDebug("EXIT: creatDraftTemplate");
    return peopleModel;
}
/*
Assumption is customer with Anonymous, Anonymous will always there
*/
function getAnonymousTemplate() {
    logDebug("ENTER: getAnonymousTemplate");
    var retTemplate = null;
    var peopleSequenceNumber = null;
    var firstname = 'Anonymous';
    var lastname = null;
    var resultPeopleArray = getPeoplesByFnameLnameDOB(lastname, firstname, null);
    for (var cp in resultPeopleArray) {
        peopleSequenceNumber = resultPeopleArray[cp].getContactSeqNumber();
        break;
    }
    if (peopleSequenceNumber != null) {
        var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");
        retTemplate = peopleModel.getTemplate();
    }
    logDebug("EXIT: getAnonymousTemplate");
    return retTemplate;
}

function logDebug(dstr) {
    if (showDebug) {
        aa.print(dstr)
    }
}


