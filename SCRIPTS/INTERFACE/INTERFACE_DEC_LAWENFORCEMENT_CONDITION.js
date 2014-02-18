var sysuser = aa.people.getSysUserByID("ADMIN").getOutput();
var javascriptDate = new Date();
var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());
var standardConditions = aa.capCondition.getStandardConditions("Revocation","").getOutput();
var standardCondition =standardConditions[0];
aa.print ("New Condition");
aa.print(standardConditions.length);
aa.print(standardCondition);

	var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
				newCondition.setServiceProviderCode(aa.getServiceProviderCode());
				newCondition.setEntityType("CONTACT");
				newCondition.setEntityID("878910");
				newCondition.setConditionDescription(standardCondition.getConditionDesc());
aa.print(standardCondition.getConditionDesc());
				newCondition.setConditionGroup(standardCondition.getConditionGroup());
				newCondition.setConditionType(standardCondition.getConditionType());
				newCondition.setConditionComment(standardCondition.getConditionComment());
				newCondition.setImpactCode(standardCondition.getImpactCode());
				newCondition.setConditionStatus("Applied")
				newCondition.setAuditStatus("A");
				
				newCondition.setIssuedByUser(sysuser);
				newCondition.setIssuedDate(javautilDate);

				//newCondition.setEffectDate(fromDate);   //fromDate
				//newCondition.setExpireDate (toDate);	//Added New				
				
				newCondition.setAuditID("ADMIN");
				var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);

				if (addContactConditionResult.getSuccess())
					{
					aa.print("Successfully");
					}
				else
					{
					aa.print( "**ERROR");
					}