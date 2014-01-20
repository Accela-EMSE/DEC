function getAGE(argbirthDate) {
        var now = new Date();
        var birthDate = new Date(argbirthDate);

        function isLeap(year) {
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        }

        // days since the birthdate    
        var days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
        var age = 0;
        // iterate the years
        for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
            var daysInYear = isLeap(y) ? 366 : 365;
            if (days >= daysInYear) {
                days -= daysInYear;
                age++;
                // increment the age only if there are available enough days for the year.
            }
        }
        return age;
    }

function diffDate(iDate1,iDate2){
	return expression.diffDate(iDate1,iDate2);
}



var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("APPLICANT::applicant*birthDate");
var variable1=expression.getValue("APPLICANTTPLFORM::CNT_MASTER::ADDITIONAL INFO::Parent Driver License Number");

var oToday = expression.getValue("$$today$$");

var totalRowCount = expression.getTotalRowCount();

var msg = "";
dd =  diffDate(oToday.getValue(), variable0.getValue());
if (dd > 0)	msg =  "Birth Date cannot be in the future";
if (dd < -36524) msg =  "Birth Date cannot be more than 100 years into the past" ;
variable0.message = msg;
if (msg != "") variable0.value = ""
expression.setReturn(variable0);

if (variable0.getValue() && getAGE(variable0.getValue) <= 13) 
	variable1.required = true;
else 
	variable1.required = false;

expression.setReturn(variable1);