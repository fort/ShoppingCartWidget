
function addJavascript(jsname,pos) {
	var th = document.getElementsByTagName(pos)[0];
	var s = document.createElement('script');
	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);
}

addJavascript('./js/jquery-1.7.js','body');
addJavascript('./js/jquery.color.js','body');
addJavascript('./js/jquery.cookie.js','body');
addJavascript('./js/jquery.md5.js','body');
addJavascript('./js/json2.js','body');

window.onload = function () {
		//~ var ojb = {
			//~ field : 'name',
			//~ getF:function(){
				//~ return this.field;
			//~ }
		//~ };
		//~ 
		//~ var obj2 = function(code){
			//~ this._code = code;
			//~ this.getCode = function(){
				//~ return this._code;
			//~ }
		//~ };
		//~ 
		//~ var o = new obj2('123');
		//~ console.log(o.getCode());
		//~ 
		//~ console.log( ojb.field );
		//~ 
		//~ console.log( ojb.getF() );

/*!
 * Product Object
*/

var Product = function(title, price, description, image, qty) {
 
 this._title=title;
 this._price=price;
 this._description=description;
 this._image=image;
 this._qty=qty;
 
 
 this.getTitle = function() {
	 return this._title;
 }
 this.setTitle = function(title) {
	 return this._title = title ;
 }
 
 this.getPrice = function() {
	 return this._price;
 }
 this.setPrice = function(price) {
	 return this._price = price ;
 }
 this.getMd5Key = function() {
	 return jQuery.md5( this._title + this._price + this.__description );
 }
 
 this.getDescription = function(){
	 return this._description;
 }
 
 this.setDescription = function(desc){
	 return this._description = desc;
 }
 
 this.getImage = function(){
	 return this._image;
 }
 
 this.setImage = function(image){
	 return this._image = image;
 }
 
 this.getQty = function() {
	 return this._qty;
 }
 this.setQty = function(qty) {
	 return this._qty = parseInt(qty);
 }
}

/*!
 * Shopping Object
*/
var ShoppingCart =function() {
 this._products = {};
 
  /**
  * 
 */
 this.add = function(prodObj) {
	 if( prodObj instanceof Object == false ){
		 return false;
	 }
	 try{
		 var key = prodObj.getMd5Key();
		 if( this._products[key] ){
		 	 var qty = this._products[key].getQty() + prodObj.getQty();
			 this._products[key].setQty(qty);
		 }else{
			 this._products[key] = prodObj;
		 }
	 }catch(e) {
		 return false;
	 }
	 return true;
 }
 /**
  * 
 */
 this.update = function(key, qty) {
	 if ( parseInt(qty) ){
		 if( qty > 0 ){
			 if( this._products[key] ){
				 this._products[key].setQty(qty);
				 return true;
			 }
		 }else{
			 return false;
		 }
	 }else{
		 return false;
	 }
 }
 
 /**
  * 
 */
 this.del = function(key){
	 var prods = new Object();
	 jQuery.each(this._products, function(_key, _prodObj) { 
		 if( _key != key ) {
			 prods[_key] = _prodObj;
		 }
	 });
	 this._products = prods;
	 return true;
 }
  
 /**
  * 
 */
 this.getProducts = function(){
	 var products = new Array();
	 jQuery.each(this._products, function(key, prodObj) { 
		 products.push(prodObj);
	 });
	 return products;
 }
 
 /**
  * 
 */
 this.toArray = function(){
	 var products = new Array();
	 jQuery.each(this._products, function(key, prodObj) { 
		 var itemArr = {'title':prodObj.getTitle(),'price':prodObj.getTitle(), 'qty':prodObj.getQty()  };
		 products['items'].push(itemArr);
	 });
	 return products;
 }
 
 /**
  * 
 */
 this.getCountProducts = function () {
	 var qty = 0;
	 jQuery.each(this._products, function(key, prodObj) { 
		 qty += prodObj.getQty();
	 });
	 return qty;
 }
 
 /**
  * 
 */
 this.getSubTotal = function () {
	 var subTotal = 0;
	 jQuery.each(this._products, function(key, prodObj) { 
		 subTotal += prodObj.getPrice() * prodObj.getQty() ;
	 });
	 return getMoneyFormatted(subTotal);
 }
 
 /**
  * 
 */
 this.clear = function(){
	 this._products = {};
 }
 
 /**
  * 
 */
 this.isEmpty = function(){
	for ( var name in this._products ) {
		return false;
	}
	return true;
 }
 
}

var alionpayShoppingCartConfig  = function(options){
	this._data = {};
	if( typeof options == 'undefined' ){
		var options = {};
	}
	
	if( typeof options['currency'] == 'undefined' ){
		this._data['currency'] = globalConfig.get('defaultCurrency');
	}else{
		this._data['currency'] = options['currency'];
	}

	if( typeof options['shop_id'] == 'undefined' ){
		this._data['shop_id'] = '';
	}else{
		this._data['shop_id'] = options['shop_id'];
	}
	
	this.get = function(key){
		 var confVal = '';
		 try{
			 confVal =  this._data[key];
		 }catch(e){
			 confVal =  '';
		 }
		 return confVal;
	}
}

var alionpayCartWidgetConfig  = function(options){
	//TODO: set default values, check input variables type
	this._data = {};
	
	if( typeof options == 'undefined' ){
		var options = {};
	}
	
	if( typeof options['lang'] == 'undefined' ){
		options['lang'] = '';
	}
	this._data['lang'] = getAllowedLanguage(options['lang']);//getLangAllowed( options['lang'] )  
	
	if( typeof options['closeCartWhenClickAway'] == 'undefined' ){
		this._data['closeCartWhenClickAway'] = true;
	}else{
		if( options['closeCartWhenClickAway'] =='false' ){
			this._data['closeCartWhenClickAway'] = false;
		}else{
			this._data['closeCartWhenClickAway'] = true;
		}
	}
	
	if( typeof options['fadeOutTime'] == 'undefined' ){
		this._data['fadeOutTime'] = 500;
	}else{
		this._data['fadeOutTime'] = parseInt ( options['fadeOutTime'] );
	}
	
	if( typeof options['highlightColor'] == 'undefined' ){
		this._data['highlightColor'] = '#D27967';
	}else{
		this._data['highlightColor'] = options['highlightColor'];
	}
	
	if( typeof options['highlightTime'] == 'undefined' ){
		this._data['highlightTime'] = 700;
	}else{
		this._data['highlightTime'] = parseInt ( options['highlightTime'] );
	}
	
	//milliseconds
	this._data['slideUpTime'] 	= 200;
	this._data['slideDownTime'] = 200;

	this.get = function(key){
		 var confVal = '';
		 try{
			 confVal =  this._data[key];
		 }catch(e){
			 confVal =  '';
		 }
		 return confVal;
	}
};

var globalConfig = function() {
	function getBaseUrl(){
		return 'http://aiop.loc/cart';
	}
	
	this.globalConfig = {
		checkout_process_url : 'http://aiop.loc/payment/shopping-cart/init/',
		allowedLanguages : { ru:'ru', en: 'en' },
		defaultLanguage : 'ru',
		defaultCurrency : 'USD',
		baseUrl: getBaseUrl(),
		imgArrowOpened : getBaseUrl()+'/images/opened.png',
		imgArrowClosed : getBaseUrl()+'/images/closed.png'
	}
	this.get = function(key) {
		var value = '';
		try{
			value = this.globalConfig[key]
		}catch(e){
		}
		return value;
	}
};

var translations = function() {
	this.messages = {};
	
	this.messages['ru'] = {
		'open': 'Открыть',
		'close' : 'Закрыть',
		'delete' : 'Удалить',
		'view_cart' :'Корзина',
		'cnt_item' : ['шт.', 'шт.', 'шт.'],
		'checkout' : 'Оформить',
		'emptymessage' : 'Корзина пуста',
		'subTotal' : 'Сумма к оплате'
	}
	this.messages['en'] = {
		'open': 'Open',
		'close' : 'Close',
		'delete' : 'Delete',
		'view_cart' :'View Cart',
		'cnt_item' : ['item', 'items'],
		'checkout' : 'Checkout',
		'emptymessage' : 'Your shopping cart is empty',
		'subTotal' : 'SubTotal'
	}
	this.translations = {
		messages: this.messages
	}
}

//Traslator
function tt(mId){
	var mess = '';
	try{
		mess = translations.messages [alionpayCartWidgetConfigObj.get('lang')] [mId];
	}catch(e){
		mess = translations.messages ['ru'] [mId];
	}
	return mess;
}

// Get the money formatted for display
function getMoneyFormatted(val){
  return val.toFixed(2);
}

function plural_formRu(n, forms) {
	return (n%10==1 && n%100!=11 ? forms[0] : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? forms[1] : forms[2]);
}

function plural_formEn(n, forms) {
	return ( n == 1 ) ? forms[0] : forms[1];
}

function plural_form(n, forms) {
  var res = '';
  switch ( alionpayCartWidgetConfigObj.get('lang') ) {
	  case 'ru':
		res = plural_formRu(n, forms);
		break;
	  case 'en'	:
		res = plural_formEn(n, forms);
		break;
	  default: 
		res = '';	
		break;
  } 	  
  return res;
}



function getAllowedLanguage(lang){
	if( typeof globalConfig.get('allowedLanguages')[lang] == 'undefined' ){
		return globalConfig.get('defaultLanguage');
	}else{
		return globalConfig.get('allowedLanguages')[lang];
	}
}

// RegExs
//var regexPrice = /\d+\.\d{0,2}/g;
var regexPrice = /[0-9]{1,12}(\.{1}[0-9]{1,}){0,1}/;

// Labels
var lbl_CartHeader = '{LANG_VIEW-CART} '
	+ '( <div style="display:inline-block;" id="alionpaycart-widget-item-count"> {COUNT} </div>  -  '
	+ '<div style="display:inline-block;" id="alionpaycart-widget-subtotal"> $ {SUB_TOTAL} </div>  )'; 

// msg
var messageEmptyShoppingCart = ' <div class="alionpaycart-widget-emptymessage" id="alionpaycart-widget-emptymessage"> {LANG_EMPTY-MESSAGE} </div> ';

// tpls
var widgetConteiner = 
	'<div id="alionpay-cart">'
	+ '	<div id="header"> {HEADER} </div> '
	+ '	<div id="content"> {CONTENT} '
	+ '		<div id="footer"> {FOOTER} '
	+ '</div> '
	+ '</div>';
	
var templateShoppingCartItemsList =
	'<table id="alionpaycart-widget-item-list"> '
	+ '{PRODUCT_ROWS} '
	+ '</table> ';	
var templateShoppingCartItemRow = 
	'<tr id="itemRow_{PRODUCT_KEY}"> '
	//+ '		<td> <input type=\"text\" onkeyup="updateItem(\'{PRODUCT_KEY}\', this.value, this)" name=\"product_qty" id=\"qty_{PRODUCT_KEY}\" value=\"{PRODUCT_QTY}\" class="alionpaycart-widget-qty-field" > </td> '
	+ '		<td> <input type=\"text\" prod_key=\"{PRODUCT_KEY}\" name=\"product_qty" id=\"qty_{PRODUCT_KEY}\" value=\"{PRODUCT_QTY}\" class="alionpaycart-widget-qty-field" > </td> '
	+ '		<td> <span class="alionpaycart-widget-title"> {PRODUCT_TITLE} </span> </td> '
	+ '		<td> <img src="{PRODUCT_IMAGE}" class="alionpaycart-widget-image"/> </td> '
	+ '		<td> <span id="price_{PRODUCT_KEY}" class="alionpaycart-widget-price"> {PRODUCT_PRICE} </span> </td> '
	//+ '		<td> <input type=\"button\" onclick="removeItem(\'{PRODUCT_KEY}\', this)" value=\"{LANG_DELETE}\" class="alionpaycart-widget-bnt-remove"> </td> '
	+ '		<td> <input type=\"button\" prod_key=\"{PRODUCT_KEY}\" value=\"{LANG_DELETE}\" class="alionpaycart-widget-bnt-remove"> </td> '
	+ '</tr>';

var templateShoppingCartFooter =
	'<table>' 
	+ '	<tr>  '
	+ '	 <td> '
	+ '		<span class="alionpaycart-widget-subtotal-message"> {LANG_SUBTOTAL} :</span> '
	+ '		<div id="alionpaycart-widget-footer-subtotal" class="alionpaycart-widget-footer-subtotal">  </div> '
	+ '	</td> '
	//+ '  <td class="right"> <input value="{LANG_CHECKOUT}" onclick="checkout();" type="submit" class="alionpaycart-widget-btn-checkout" id="alionpaycart-widget-checkout"> </td>'
	+ '  <td class="right"> <input value="{LANG_CHECKOUT}" type="submit" class="alionpaycart-widget-btn-checkout" id="alionpaycart-widget-checkout"> </td>'
	+ '	</tr> '
	+ '</table> ';	


//Checkout Proccess
function checkout(){
	var form = jQuery('<form>').attr({
		  action: globalConfig.get('checkout_process_url'), method: 'POST'
	});
	var cnt = 1;
	jQuery.each( shoppingCartOjb._products, function(key, prodObj){
		var itemName = 'item_name_' + cnt;
		var itemDesc = 'item_description_' + cnt;
		var itemPrice = 'item_price_' + cnt;
		var itemQty = 'item_qty_' + cnt;
		jQuery('<input>').attr({
			  type: 'hidden', name: itemName, value: prodObj.getTitle()
		}).appendTo(form);
		
		jQuery('<input>').attr({
			  type: 'hidden', name: itemDesc, value: prodObj.getDescription()
		}).appendTo(form);
		
		jQuery('<input>').attr({
			  type: 'hidden', name: itemPrice, value:  prodObj.getPrice() 
		}).appendTo(form);
		
		jQuery('<input>').attr({
			  type: 'hidden', name: itemQty, value: prodObj.getQty()
		}).appendTo(form);
		
		cnt++;
	});
	
	jQuery('<input>').attr({
		  type: 'hidden', name: 'ap_currency' , value: alionpayShoppingCartConfigObj.get('currency') 
	}).appendTo(form);
	jQuery('<input>').attr({
		  type: 'hidden', name: 'ap_shop_id' , value: alionpayShoppingCartConfigObj.get('shop_id')
	}).appendTo(form);
	jQuery('<input>').attr({
		  type: 'hidden', name: 'ap_lang' , value: alionpayCartWidgetConfigObj.get('lang')
	}).appendTo(form);
	
	jQuery('<input>').attr({
		  type: 'hidden', name: 'ap_continue_shopping_url' , value: window.location.href
	}).appendTo(form);
	
	jQuery('body').append(form);
	form.submit();
}

function updateItem(key, qty, el) {
	try{
		var status = shoppingCartOjb.update(key, qty);
		if(!status){
			el.value = shoppingCartOjb._products[key].getQty();
		}else{
			updateItemRow(key);
			updateCart();
		}
	}catch(e){
		return false;
	}
}

function removeItem(key,el) {
	try{
		shoppingCartOjb.del(key);
		jQuery('#alionpaycart-widget #itemRow_' + key).remove();
		updateCart();
	}catch(e){
		return false;
	}
}

function highlightRow(key){
	var hightlightColor = jQuery.Color(alionpayCartWidgetConfigObj.get('highlightColor')); 
	var noHightlightColor = jQuery.Color('#FFFFFF'); 
	 //$('#alionpaycart-widget #itemRow_' + key).animate({ backgroundColor : hightlightColor }, 'fast').animate({ backgroundColor : noHightlightColor }, 'slow');
	jQuery('#alionpaycart-widget #itemRow_' + key).css('background-color',hightlightColor);
	jQuery('#alionpaycart-widget #itemRow_' + key).animate(
		{ backgroundColor : noHightlightColor }, alionpayCartWidgetConfigObj.get('highlightTime')
	);
}

function updateCartHeader(){
	var cnt = shoppingCartOjb.getCountProducts() + ' ' + plural_form( shoppingCartOjb.getCountProducts(), tt('cnt_item') );
	jQuery('#alionpaycart-widget #alionpaycart-widget-item-count').html( cnt );
	jQuery('#alionpaycart-widget #alionpaycart-widget-subtotal').html( '<b>' + shoppingCartOjb.getSubTotal()+' '+alionpayShoppingCartConfigObj.get('currency') + '</b>' );
}

function updateContent(){
	if(shoppingCartOjb.isEmpty() ){
		jQuery('#alionpaycart-widget #alionpaycart-widget-item-list').empty();
		jQuery('#alionpaycart-widget #alionpaycart-widget-item-list').after( messageEmptyShoppingCart );
	}else{
		jQuery('#alionpaycart-widget #alionpaycart-widget-emptymessage').remove();
	}
}

function updateCart(){
	updateCartHeader();
	updateContent();
	updateCartFooter();
	
	//Write products to cookie
	var date = new Date();
	date.setTime(date.getTime() + (30 * 60 * 1000));
	//TODO: value expires move to the config 
	jQuery.cookie('alionpaycart-items', JSON.stringify( shoppingCartOjb._products ), { path:'/', expires:date } );
}

function updateCartFooter() {
	jQuery('#alionpaycart-widget #alionpaycart-widget-footer-subtotal').html( '<b>' + shoppingCartOjb.getSubTotal()+' '+alionpayShoppingCartConfigObj.get('currency') + '</b>');
	if( shoppingCartOjb.isEmpty() ){
		jQuery('#alionpaycart-widget #alionpaycart-widget-checkout').css('display','none');
	}else{
		jQuery('#alionpaycart-widget #alionpaycart-widget-checkout').css('display','block');
		jQuery('#alionpaycart-widget #alionpaycart-widget-checkout').show();
	}
}

function addItemRow(prodObj){
	var row = templateShoppingCartItemRow.replace(/{PRODUCT_KEY}/g, prodObj.getMd5Key() );
	row = row.replace(/{PRODUCT_QTY}/, prodObj.getQty() );
	row = row.replace(/{PRODUCT_TITLE}/g, prodObj.getTitle() );
	row = row.replace(/{PRODUCT_PRICE}/g, prodObj.getPrice() );
	row = row.replace(/{PRODUCT_IMAGE}/g, prodObj.getImage() );
	row = row.replace(/{LANG_DELETE}/g, tt('delete') );
	jQuery('#alionpaycart-widget #alionpaycart-widget-item-list').append(row);
}
	
function updateItemRow(key){
	var prod = shoppingCartOjb._products[key];
	jQuery('#alionpaycart-widget #qty_' + prod.getMd5Key()).val( prod.getQty() );
	jQuery('#alionpaycart-widget #price_' + prod.getMd5Key()).text ( getMoneyFormatted ( prod.getPrice() * prod.getQty() ) );
}

function parseItemRows(products){
	var resStr = '';
	jQuery.each( shoppingCartOjb.getProducts(), function(key, prodObj) {
		var row = templateShoppingCartItemRow.replace(/{PRODUCT_KEY}/g, prodObj.getMd5Key() );
		row = row.replace(/{PRODUCT_QTY}/g, prodObj.getQty() );
		row = row.replace(/{PRODUCT_TITLE}/g, prodObj.getTitle() );
		row = row.replace(/{PRODUCT_PRICE}/g, getMoneyFormatted( prodObj.getPrice() * prodObj.getQty() ) );
		row = row.replace(/{PRODUCT_IMAGE}/g, prodObj.getImage() );
		row = row.replace(/{LANG_DELETE}/g, tt('delete') );
		resStr += row;
	});
	return resStr;
}

//Show or Hide Content block for Cart widget
function toggleCartWidgetContent(status){
	switch (status) {
	  case 'open':
		jQuery('.alionpaycart-widget-content').css('visibility','inherit');
		jQuery('.alionpaycart-widget-content').css('height','auto');
		jQuery('.alionpaycart-widget-content').slideDown(alionpayCartWidgetConfigObj.get('slideDownTime'), function(){
			
		});
		
		//change to image arrow for header secion
		jQuery('#alionpaycart-widget-arrow').attr('src',getImgArrowByStatus('open') );
		
		break;
	  case 'close':
		jQuery('.alionpaycart-widget-content').slideUp(alionpayCartWidgetConfigObj.get('slideUpTime'), function(){
			jQuery('.alionpaycart-widget-content').css('visibility','hidden');
			jQuery('.alionpaycart-widget-content').css('height','1px;');
			
			//change to image arrow for header secion
			jQuery('#alionpaycart-widget-arrow').attr('src',getImgArrowByStatus('close') );
		});
		break;
	  default: 
		jQuery('.alionpaycart-widget-content').css('visibility','inherit');
		jQuery('.alionpaycart-widget-content').css('height','auto');
		jQuery('.alionpaycart-widget-content').slideDown(alionpayCartWidgetConfigObj.get('slideDownTime'), function(){
			
		});
		
		//change to image arrow for header secion
		jQuery('#alionpaycart-widget-arrow').attr('src',getImgArrowByStatus('open') );
		break;
   }
}

function saveToCookieCartWidgetContentState(status){
	switch (status) {
	  case 'open':
		jQuery.cookie('alionpaycart_widget_state', 'open', { path:'/' } );
		break;
	  case 'close':
		jQuery.cookie('alionpaycart_widget_state', 'close', { path:'/' } );
		break;
	  default: 
		jQuery.cookie('alionpaycart_widget_state', 'open', { path:'/' } );
		break;
   }
}

function getImgArrowByStatus(status){
	switch (status) {
	  case 'open':
		return globalConfig.get('imgArrowOpened');
		break;
	  case 'close':
		return globalConfig.get('imgArrowClosed');
		break;
	  default: 
		return globalConfig.get('imgArrowOpened');
		break;
   }
}

function createShoppingCart(){
	//Load products form cookie
	var productsFromCookie = JSON.parse(jQuery.cookie('alionpaycart-items'));
	var itemsListContent = '';
	
	if( productsFromCookie ){
		shoppingCartOjb.clear();
		jQuery.each( productsFromCookie, function(key, val) {
			var price = val._price;
			var qty = val._qty;
			var prodObj = new Product( val._title, price  , val._description, val._image, qty );
			shoppingCartOjb.add(prodObj);
		});
		itemsListContent = parseItemRows(productsFromCookie);
	}
	var itemsListContent = templateShoppingCartItemsList.replace(/{PRODUCT_ROWS}/, itemsListContent ); 
	
	if ( jQuery('#alionpaycart-widget-control').length ){
		var elmHeader = '';
	}else{
		lbl_CartHeader =  lbl_CartHeader.replace(/{COUNT}/, shoppingCartOjb.getCountProducts() + ' ' + plural_formEn(shoppingCartOjb.getCountProducts(), new Array('item', 'items') )  );
		lbl_CartHeader =  lbl_CartHeader.replace(/{SUB_TOTAL}/ , shoppingCartOjb.getSubTotal() );
		
		var elmHeader = jQuery('<div id="haeder" class="alionpaycart-widget-header">');
		
		var arrowSrc = getImgArrowByStatus( jQuery.cookie('alionpaycart_widget_state') );
		elmHeader.append('<img src="'+arrowSrc+'" id="alionpaycart-widget-arrow" class="alionpaycart-widget-arrow" alt="arrow" /> ' );
		elmHeader.append(lbl_CartHeader);
	}
	
	var elmContent = jQuery('<div id="content" class="alionpaycart-widget-content" ></div>');
	
	//Hide Content element
	if( jQuery.cookie('alionpaycart_widget_state') == 'close' ) {
		elmContent.css( 'visibility', 'hidden' );
		elmContent.css( 'display', 'none' );
	}
	
	var elmFooter = jQuery('<div id="footer" class="alionpaycart-widget-footer"></div>');
	
	elmFooter.prepend(templateShoppingCartFooter);
	elmContent.prepend(itemsListContent).append(elmFooter);
	
	var alionpaycartWrapper = jQuery('<div class="alionpaycart-widget-wrapper"></div>');
	alionpaycartWrapper.append(elmHeader).append(elmContent);
	jQuery('#alionpaycart-widget').append(alionpaycartWrapper);
	//jQuery('#alionpaycart-widget').append(elmHeader).append(elmContent);
	updateCart();
}

function main(){
	var alionpaycartScriptElement = jQuery('#alionpaycart-script');
	
	this.shoppingCartOjb = new ShoppingCart();
	
	var widgetOptions = {};
	widgetOptions.lang = alionpaycartScriptElement.attr('lang').toLowerCase();
	widgetOptions.currency = alionpaycartScriptElement.attr('currency').toLowerCase();
	widgetOptions.closeCartWhenClickAway = alionpaycartScriptElement.attr('close_cart_when_click_away');
	widgetOptions.fadeOutTime = alionpaycartScriptElement.attr('fade_out_time');
	widgetOptions.highlightColor = alionpaycartScriptElement.attr('highlight_color');
	widgetOptions.highlightTime = alionpaycartScriptElement.attr('highlight_time');
	
	this.alionpayCartWidgetConfigObj = new alionpayCartWidgetConfig(widgetOptions);
	
	
	var shoppingCartOptions = {};
	shoppingCartOptions.shop_id = alionpaycartScriptElement.attr('shop_id');
	shoppingCartOptions.currency = alionpaycartScriptElement.attr('currency');
	
	this.alionpayShoppingCartConfigObj = new alionpayShoppingCartConfig(shoppingCartOptions);
	
	//
	replaceLanguageVars();
	createShoppingCart();
}

function replaceLanguageVars() {
	lbl_CartHeader = lbl_CartHeader.replace('{LANG_VIEW-CART}', tt('view_cart') );
	messageEmptyShoppingCart = messageEmptyShoppingCart.replace(/{LANG_EMPTY-MESSAGE}/, tt('emptymessage') ); 
	templateShoppingCartFooter = templateShoppingCartFooter.replace(/{LANG_CHECKOUT}/, tt('checkout') );
	templateShoppingCartFooter = templateShoppingCartFooter.replace(/{LANG_SUBTOTAL}/, tt('subTotal') );
}

jQuery.noConflict();

//Set current mouse coursor. Needs for hide/show Shopping Cart widget if user click widget outside
//and config value of close_cart_when_click_away equale TRUE
var mouse_is_inside = false;

jQuery('.alionpaycart-add-button').hover(function(){ 
	mouse_is_inside=true; 
}, function(){ 
	mouse_is_inside=false; 
});

jQuery('#alionpaycart-widget').hover(function(){ 
	mouse_is_inside=true;
}, function(){ 
	mouse_is_inside=false; 
});

jQuery('#alionpaycart-widget-control').hover(function(){ 
	mouse_is_inside=true;
}, function(){ 
	mouse_is_inside=false; 
});

// init global object
var globalConfig = new globalConfig();

//init Translation object
var translations = new translations();

//load the css file
jQuery('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: globalConfig.get('baseUrl') + '/css/style.css'
}).appendTo('head');
	
main();
//Handles

//Add product to shopping cart
jQuery('.alionpaycart-add-button').live('click', function() {
	var productConteiner = jQuery(this).parents('.product');
	if( productConteiner.length ) {
		var title = jQuery(productConteiner).find( jQuery('.product-title')).text();
		var price = jQuery(productConteiner).find( jQuery('.product-price')).text().replace(',','.');
		price = price.match(regexPrice);
		if( price instanceof Array ){
			if( price[0] ==='undefined' ){
				price = 0.00;
			}else{
				price = price[0];
			}
		}else{
			price = 0.00;
		}
		
		var description = jQuery(productConteiner).find( jQuery('.product-description')).text();
		var image = jQuery(productConteiner).find( jQuery('.product-image')).attr('src');
		
		var prodObj = new Product( title, price , description, image, 1 );
		
		shoppingCartOjb.add(prodObj);
		
		if( jQuery('#alionpaycart-widget #qty_'+prodObj.getMd5Key()).val() ){
			updateItemRow(prodObj.getMd5Key());
		}else{
			addItemRow(prodObj);
		}
		updateCart();
		
		highlightRow(prodObj.getMd5Key());
		
		//Every click to add-button opens Content block for Cart widget
		toggleCartWidgetContent('open');
		saveToCookieCartWidgetContentState('open');
	}
});

//handler to click by html element
// mouse_is_inside global var
jQuery('body').click(function() {
	if( alionpayCartWidgetConfigObj.get('closeCartWhenClickAway') && mouse_is_inside == false ){
		//show or hide Content Element
		toggleCartWidgetContent('close');
		//Write state to cookie
		saveToCookieCartWidgetContentState('close');
	}
});

jQuery('.alionpaycart-widget-header').live('click', function() {
	if( jQuery('.alionpaycart-widget-content').css('visibility') == 'hidden' ){
		//show or hide Content Element
		toggleCartWidgetContent('open');
		//Write state to cookie
		saveToCookieCartWidgetContentState('open');
	}else{
		toggleCartWidgetContent('close');
		//Write state to cookie
		saveToCookieCartWidgetContentState('close');
	}
	return false;
});

jQuery('#alionpaycart-widget-control').live('click', function() {
	if( jQuery('.alionpaycart-widget-content').css('visibility') == 'hidden' ){
		//show or hide Content Element
		toggleCartWidgetContent('open');
		//Write state to cookie
		saveToCookieCartWidgetContentState('open');
	}else{
		toggleCartWidgetContent('close');
		//Write state to cookie
		saveToCookieCartWidgetContentState('close');
	}
	return false;
});

jQuery('#alionpaycart-widget-checkout').live('click', function(){
	checkout();
});

jQuery('.alionpaycart-widget-bnt-remove').live('click', function(){
	var prodKey = jQuery(this).attr('prod_key');
	removeItem(prodKey);
});

jQuery('.alionpaycart-widget-qty-field').live('keyup', function(){
	var prodKey = jQuery(this).attr('prod_key');
	var qty = jQuery(this).val();
	updateItem(prodKey, qty, this);
});
	
//Usege global function

//~ console.log( getAllowedLanguage('en') );

//Usege translator
//~ console.log( tt('open') );
//~ console.log( tt('close') );
//~ console.log( tt('cnt_item') );

}
