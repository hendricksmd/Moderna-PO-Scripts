/**
 * 
 * Version    Date            Author         
 * 1.00       17 Apr 2015     McGladrey
 *
 *Module Description
 *If a user has to change the item on a PO, the previously committed values are captured
 *and filled back in after the new item post sourcing event.
 */

/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Apr 2015     McGladrey
 *
 */


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord purchaseorder
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function postSource_restoreLine(type, name) {
	if (type == 'item' && name == 'item') {
		
		try {
			//Get committed line values
			var lineId = nlapiGetCurrentLineItemIndex(type);
			var	qty = nlapiGetLineItemValue(type, 'quantity', lineId);
			var	stDescription = nlapiGetLineItemValue(type, 'description', lineId);
			var	curRate = nlapiGetLineItemValue(type, 'rate', lineId);
			var	customerId = nlapiGetLineItemValue(type, 'customer', lineId);
			
			//set new values after post sourcing if not null
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
			nlapiLogExecution('ERROR', 'unexpected error', e.toString());
		}
	}
}