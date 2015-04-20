/**
 * Version    Date            Author         
 * 1.00       17 Apr 2015     McGladrey
 */
/*
 *Module Description
 *Contains client event functions that allow a user to change line items on a PO
 *while maintaining previously entered information. 
 *
 *Also, a validation ensures that if line items are over 3000, the header CAPEX field
 *is checked and the lines require a CAPEX SPEC
 */

/*
 * Post-sourcing function
 * If a user has to change the item on a PO, the previously committed values are captured
 *and filled back in after the new item post sourcing event.
 */
function postSource_restoreLine(type, name) {
	
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
			var	isBillable = nlapiGetLineItemValue(type, 'isbillable', lineNum);
			var dteExRcpt = nlapiGetLineItemValue(type, 'expectedreceiptdate', lineNum);
			
			//Set new values after item change post sourcing if values not null
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

/*
 * Validate Line CapX. if the line is > 3,000, the capx field is checked
 * and if there is no CAPEX SPEC value, the user is alerted to select one before
 * continuing.
 */
function validateLine_checkCapx(type) {
	if (type == 'item' || type == 'expense') {
		var customerId = nlapiGetCurrentLineItemValue(type, 'customer');
		var curAmt = nlapiGetCurrentLineItemValue(type, 'amount');
		var capXline = nlapiGetCurrentLineItemValue(type, 'custcol_capex_spec');
		
		if (curAmt >= 3000) {
			nlapiSetFieldValue('custbody_capex', 'T');
			if (capXline == null || capXline == '') {
				alert('this item is greater than $3000.00. Please fill in CAPEX SPEC');
				return false;
			}
		}
		/*
		 * Felix: this is your script. i shortened it and adjusted it to make it functional with both expenses and items
		 */
		if (customerId != null && customerId != '') {
			nlapiSetCurrentLineItemValue(type,'custcol_proj', customerId);
		}
	}
    return true;
}

/*
 * If any line is over 3,000 Dollars, this function ensures that the capex box is checked
 * and alerts users if they need to select a CAPEX SPEC before saving.
 */
function save_checkCapX() {
	var curTotal = nlapiGetFieldValue('total');
	if (curTotal > 3000 ) {
		var lineCount = nlapiGetLineItemCount('item');
		
		//loop through line items and validate the amount
		for (var i = 1; i <= lineCount; i++) {
			var stItem = nlapiGetLineItemText('item', 'item', i);
			var curAmount = nlapiGetLineItemValue('item', 'amount', i);
			var capXline = nlapiGetLineItemValue('item', 'custcol_capex_spec', i);
			
			//if the amount is > 3,000 then set the capx box
			if (curAmount >= 3000) {
				var isCapX = nlapiGetFieldValue('custbody_capex');
				if (isCapX =='F') {
					nlapiSetFieldValue('custbody_capex', 'T');
				} 
				//if the CAPEX SPEC field is empty then alert the user and falsify the save
				if (capXline == null  || capXline == '') {
					alert('Line: ' + stItem + ' requires CAPEX SPEC to be filled in.' + '\n' +
							' Please select an option before saving');
					return false;
				}
			}
		}		
	}		
    return true;
}