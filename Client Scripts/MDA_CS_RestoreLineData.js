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
			var lineNum = nlapiGetCurrentLineItemIndex(type); 							//get the current line id
			var	qty = nlapiGetLineItemValue(type, 'quantity', lineNum); 				//get quantity
			var	stDescription = nlapiGetLineItemValue(type, 'description', lineNum); 	//get item description
			var	curRate = nlapiGetLineItemValue(type, 'rate', lineNum); 				//get unit rate
			var	customerId = nlapiGetLineItemValue(type, 'customer', lineNum);			//get customer/project ID
			
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
			if (customerId!= null && customerId!= '') {
				nlapiSetCurrentLineItemValue(type, 'customer', projId, false);
			}
		} catch (e) {
			nlapiLogExecution('ERROR', 'unexpected error restoring previous line values', e.toString());
		}
	}
}