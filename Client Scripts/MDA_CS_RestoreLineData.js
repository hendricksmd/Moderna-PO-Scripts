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
			var	customerId = nlapiGetLineItemValue(type, 'customer', lineNum);
			var capX = nlapiGetLineItemValue(type, 'custcol_capex_spec', lineNum);
			//var proj = nlapiGetLineItemValue(type, 'custcol_capex_spec', lineNum);
			
			var	isBillable = nlapiGetLineItemValue(type, 'isbillable', lineNum);
			var dteExRcpt = nlapiGetLineItemValue(type, 'expectedreceiptdate', lineNum);
			
			//set new values after item change post sourcing if values not null
			if (qty != null && qty != '') {
				nlapiSetCurrentLineItemValue(type, 'quantity', qty, false);
			}
			
			if (stDescription != '' && stDescription!= null) {
				nlapiSetCurrentLineItemValue(type, 'description', stDescription, false);
			}
			if (curRate != null && curRate != '') {
				nlapiSetCurrentLineItemValue(type, 'rate', curRate, false);
			}
			if (departmentId != null && departmentId != '') {
				nlapiSetCurrentLineItemValue(type, 'department', departmentId, false);
			}
			if (customerId != null && customerId != '') {
				nlapiSetCurrentLineItemValue(type, 'customer', customerId, false);
			}
			if (isBillable  == 'T') {
				nlapiSetCurrentLineItemValue(type, 'isbillable', isBillable, false);
			}
			if (dteExRcpt  != null && dteExRcpt != '') {
				nlapiSetCurrentLineItemValue(type, 'expectedreceiptdate', dteExRcpt, false);
			}
			if (capX  != null && capX != '') {
				nlapiSetCurrentLineItemValue(type, 'custcol_capex_spec', isCapX, false);
			}
			
		} catch (e) {
			nlapiLogExecution('ERROR', 'unexpected error restoring previous line values', e.toString());
		}
	}
}


//Validate Line CapX
/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord purchaseorder
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function validateLine_checkCapx(type) {
	if (type == 'item') {
		var curAmt = nlapiGetCurrentLineItemValue(type, 'amount');
		
		if (curAmt >= 3000) {
			nlapiSetFieldValue('custbody_capex', 'T');
			alert('this item is greater than $3000.00. Please fill in CAPEX SPEC');
			return false;
		}
		
	}
 
    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function save_checkCapX() {
	var curTotal = nlapiGetFieldValue('total');
	
	if (curTotal > 3000 ) {
		var lineCount = nlapiGetLineItemCount('item');
		
		return false;
	}
	
	
    return true;
}