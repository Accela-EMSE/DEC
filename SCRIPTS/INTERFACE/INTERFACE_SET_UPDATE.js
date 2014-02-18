//var setID = aa.env.getValue("SETID");
//var ALTIDLIST = aa.env.getValue("ALTIDLIST");
 
try {
        var setTest = new capSet("####-091613","####-091613");
        setTest.status = "Sweep Pending";  // update the set header status
        setTest.update();  // commit changes to the set
    }
    catch (err) {
        aa.print("Exception in updateSetStatus:" + err.message);
    }

function capSet(desiredSetId) {
    this.refresh = function () {
        var theSet = aa.set.getSetByPK(this.id).getOutput();
        this.status = theSet.getSetStatus();
        this.setId = theSet.getSetID();
        this.name = theSet.getSetTitle();
        this.comment = theSet.getSetComment();
        this.model = theSet.getSetHeaderModel();
        this.statusComemnt = theSet.getSetStatusComment();

        var memberResult = aa.set.getCAPSetMembersByPK(this.id);

        if (!memberResult.getSuccess()) { aa.print("**WARNING** error retrieving set members " + memberResult.getErrorMessage()); }
        else {
            this.members = memberResult.getOutput().toArray();
            this.size = this.members.length;
            if (this.members.length > 0) this.empty = false;
            aa.print("capSet: loaded set " + this.id + " of status " + this.status + " with " + this.size + " records");
        }
    }

    this.add = function (addCapId) {
        var setMemberStatus;
        if (arguments.length == 2) setMemberStatus = arguments[1];

        var addResult = aa.set.add(this.id, addCapId)

        // Update a SetMember Status for a Record in SetMember List.

        var setUpdateScript = aa.set.getSetDetailsScriptModel().getOutput();
        setUpdateScript.setSetID(this.id);          //Set ID
        setUpdateScript.setID1(addCapId.getID1());
        setUpdateScript.setID2(addCapId.getID2());
        setUpdateScript.setID3(addCapId.getID3());
        if (setMemberStatus) {
            setUpdateScript.setSetMemberStatus(setMemberStatus);
            setUpdateScript.setSetMemberStatusDate(aa.date.getCurrentDate());
        }
        setUpdateScript.setServiceProviderCode(aa.getServiceProviderCode());

        addResult = aa.set.updateSetMemberStatus(setUpdateScript);

        if (!addResult.getSuccess()) {
            aa.print("**WARNING** error adding record to set " + this.id + " : " + addResult.getErrorMessage());
        }
        else {
            aa.print("capSet: added record " + addCapId + " to set " + this.id);
        }
    }

    this.remove = function (removeCapId) {
        var removeResult = aa.set.removeSetHeadersListByCap(this.id, removeCapId)
        if (!removeResult.getSuccess()) {
            aa.print("**WARNING** error removing record from set " + this.id + " : " + removeResult.getErrorMessage());
        }
        else {
            aa.print("capSet: removed record " + removeCapId + " from set " + this.id);
        }
    }

    this.update = function () {
        var sh = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.SetBusiness").getOutput();
        this.model.setSetStatus(this.status)
        this.model.setSetID(this.setId);
        this.model.setSetTitle(this.name);
        this.model.setSetComment(this.comment);
        this.model.setSetStatusComment(this.statusComment);

        aa.print("capSet: updating set header information");
        try {
            updateResult = sh.updateSetBySetID(this.model);
        }
        catch (err) {
            aa.print("**WARNING** error updating set header failed " + err.message);
        }

    }

    this.id = desiredSetId;
    this.name = desiredSetId;
    if (arguments.length > 1 && arguments[1]) this.name = arguments[1];

    this.comment = null;

    this.size = 0;
    this.empty = true;
    this.members = new Array();
    this.status = "";
    this.statusComment = "";
    this.model = null;
    var theSetResult = aa.set.getSetByPK(this.id);

    if (theSetResult.getSuccess()) {
        this.refresh();
    }

    else  // add the set
    {
        theSetResult = aa.set.createSet(this.id, this.name);
        if (!theSetResult.getSuccess()) {
            aa.print("**WARNING** error creating set " + this.id + " : " + theSetResult.getErrorMessage);
        }
        else {
            aa.print("capSet: Created new set " + this.id);
            this.refresh();
        }
    }
}