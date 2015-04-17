/**
 * 
 * Version    Date            Author         
 * 1.00       17 Apr 2015     McGladrey
 *
 *Module Description
 *If a user has to change the item on a PO, the previously committed values are captured
 *and filled back in after the new item post sourcing event.
 */
function postSource_restoreLine(type, name) {
	/*
	 * if the item field on the item sublist is changed (on a previously committed line)
	 * then execute
	 */
	if (type == 'item' && name == 'item') {
		
		try {
			//Get committed line values
			var lineNum = nlapiGetCurrentLineItemIndex(type); 							
			var	qty = nlapiGetLineItemValue(type, 'quantity', lineNum); 				
			var	stDescription = nlapiGetLineItemValue(type, 'description', lineNum); 	
			var	curRate = nlapiGetLineItemValue(type, 'rate', lineNum); 		
			var departmentId = nlapiGetLineItemValue(type, 'department', lineNum);
			var classId = nlapiGetLineItemValue(type, 'class', lineNum);
			var locationId = nlapiGetLineItemValue(type, 'location', lineNum);
			var	customerId = nlapiGetLineItemValue(type, 'customer', lineNum);
			
			//may not need these
			var	isBillable = nlapiGetLineItemValue(type, 'isbillable', lineNum);
			var isMatch = nlapiGetLineItemValue(type, 'matchbilltoreceipt', lineNum);
			var dteExRcpt = nlapiGetLineItemValue(type, 'expectedreceiptdate', lineNum);
			var projId = nlapiGetLineItemValue(type, 'custcol_proj', lineNum);
			var assetId = nlapiGetLineItemValue(type, 'custcol_far_trn_relatedasset', lineNum);
			
			//set new values after item change post sourcing if values not null
			if (qty!= null) {
				nlapiSetCurrentLineItemValue(type, 'quantity', qty, false);
			}
			
			if (stDescription != '' && stDescription!= null) {
				nlapiSetCurrentLineItemValue(type, 'description', stDescription, false);
			}
			if (curRate != null && curRate!= '') {
				nlapiSetCurrentLineItemValue(type, 'rate', curRate, false);
			}
			if (departmentId!= null && departmentId!= '') {
				nlapiSetCurrentLineItemValue(type, 'customer', departmentId, false);
			}
			if (classId!= null && classId!= '') {
				nlapiSetCurrentLineItemValue(type, 'customer', classId, false);
			}
			if (locationId!= null && locationId!= '') {
				nlapiSetCurrentLineItemValue(type, 'customer', locationId, false);
			}
			if (customerId!= null && customerId!= '') {
				nlapiSetCurrentLineItemValue(type, 'customer', customerId, false);
			}
			
		} catch (e) {
			nlapiLogExecution('ERROR', 'unexpected error restoring previous line values', e.toString());
		}
	}
}