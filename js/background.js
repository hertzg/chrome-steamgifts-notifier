/*(function(){
	chrome.extension.onConnect.addListener(function(port) {
		Ports.add(port); 
	});

	chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
		sendResponse('OK?');
	});

	var Ports = new (function(){
		var that = this;
		var arr = [];
		
		this.onMessage = function(obj, port){};	
		this.onDisconnect = function(port){};	
		
		this.add = function(port) {
		
			port.onMessage.addListener(function(obj, port){
				that.onMessage(obj, port);
			});
			
			port.onDisconnect.addListener(function(port){
				that.onDisconnect(port);
				that.remove(port);
			});
			
			arr.push(port);
		};
		
		this.remove = function(port) {		
			for(var i=0; i<arr.length; i++) {
				if(arr[i] == port) {
					arr.splice(i, 1);
					break;
				}
			}
		}
		
		this.digest = function(obj) {
			if(!arr.length) return false;
		
			arr.forEach(function(port){
				port.postMessage(obj);
			});
		};
		
		this.getArr = function() {
			return arr;
		};
	});

	var hzApi = new API();

	var _checkGiveawaysIntervalHandle;
	function resetInterval() {
		_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
		_checkGiveawaysIntervalHandle = window.setInterval(checkGiveawaysIntervalHandler, 5000);
	}
	
	var lastCrawledGifts = [];
	function checkGiveawaysIntervalHandler(cb) {
	
		stopAnimateBadgeText();
		startAnimateBadgeText();
		chrome.browserAction.setTitle({title:'Checking for new results'});
		
		hzApi.getGiveaways(API.STATUS_OPEN, 1, function(arr){
			var gifts = [],
				giftsNew = [];
			
			arr.forEach(function(gift){
				var obj = gift.toObject();
				gifts.push(obj);
				
				if(lastCrawledGifts.length) {
				
					var found = false;
					for(var i=0; i<lastCrawledGifts.length; i++) {
						var lgift = lastCrawledGifts[i];
						if(lgift.equals(gift)) {
							found = true;
							break;
						}
					};
					
					if(!found) giftsNew.push(gift);
				} else {
					giftsNew.push(gift);
				}
			});
			lastCrawledGifts = arr;
			var result = {
				type: 'digest',
				user: hzApi.getUserInfo(),
				giftsNew: giftsNew,
				gifts: gifts,
				date: new Date()
			};
			
			var res = true;
			if(cb) {
				res = cb(result);
			}
			
			if(res === false) return;
			
			Ports.digest(result);
			
			stopAnimateBadgeText();
			
			hzApi.isAlert = true;
			
			chrome.browserAction.setBadgeText({text:(hzApi.isAlert ? '! ': '')+giftsNew.length+(hzApi.isAlert ? ' !': '')});
			chrome.browserAction.setTitle({title:'Found '+giftsNew.length+' new Deals\nLast Update @ '+ result.date.toLocaleTimeString()});

			var clearBadgeHandler = null;
			if(!giftsNew.length) {

				if(api.isNewAlert) {
					notifyAlert();
					return;
				}
				
				if(api.isAlert) {
					chrome.browserAction.setBadgeText({text:'!!!'});
					return;
				}
			
				clearBadgeHandler = clearTimeout(clearBadgeHandler);
				clearBadgeHandler = setTimeout(function(){
					clearBadge();
				}, 3000);
			}
		});
	}
	
	Ports.onMessage = function(obj, port){
		
		if(obj == 'checkNow') {
			checkGiveawaysIntervalHandler(function(result){
				port.postMessage(result);
				return false;
			});
			
		} else if(obj == 'reload') {
		
			checkGiveawaysIntervalHandler(function(result){
				port.postMessage(result);
			});
			
		} else {
			port.postMessage('NotYetImplemented!');
		}
		
	};
	
	//resetInterval();
});*/


//====================================== OLD WAY ======================================

var _animationHandle;
function startAnimateBadgeText() {

	if(_animationHandle) {
		return;
	}

	var tick = 0;
	_animationHandle = setInterval(function(){		
		var sprites = [	'    ',	':   ',	'::  ',	'::: ',	'::::',	' :::',	'  ::',	'   :'];
		chrome.browserAction.setBadgeText({ text: sprites[tick++]});
		if(tick >= sprites.length) tick = 0;
	}, 100);
}

function stopAnimateBadgeText(){
	if(_animationHandle) _animationHandle = clearInterval(_animationHandle);
	chrome.browserAction.setBadgeText({text:''});
}

//Initialize the HzSGAPI
var api = new API();


function checkGiveaways(cb) {
	
	Config.set('lastUpdate', new Date().getTime());

	stopAnimateBadgeText();
	startAnimateBadgeText();
	chrome.browserAction.setTitle({title:'Checking for new results'});
	
	api.getGiveaways(API.STATUS_OPEN, 1, function(giveaways){		
		var newItemCount = 0;
		if(Config.get('posts').length != 0) {
			giveaways.forEach(function(gift){
				for(var i=0; i<Config.get('posts').length; i++) {
					if(Config.get('posts')[i].uid == gift.uid) {
						break;
					}
				}
				
				if(i == Config.get('posts').length) {
					newItemCount++;
				}
				
				gift = gift.toObject();
			});
		} else {
			newItemCount = giveaways.length;
		}
		
		Config.set('posts', giveaways);
		
		stopAnimateBadgeText();		
		var lastUpdateDate = new Date(Config.get('lastUpdate'));
		
		chrome.browserAction.setBadgeText({text:(api.isAlert ? '! ': '')+newItemCount+(api.isAlert ? ' !': '')});
		chrome.browserAction.setTitle({title:'Found '+newItemCount+' new Deals\nLast Update @ '+ lastUpdateDate.toLocaleTimeString()});
		
		var clearBadgeHandler = null;
		if(newItemCount == 0) {

			if(api.isNewAlert) {
				notifyAlert();
				return;
			}
			
			if(api.isAlert) {
				chrome.browserAction.setBadgeText({text:'!!!'});
				return;
			}
		
			clearBadgeHandler = clearTimeout(clearBadgeHandler);
			clearBadgeHandler = setTimeout(function(){
				clearBadge();
			}, 3000);
		}
		
		if(cb) cb();
	});
}

function notifyAlert() {
	
	var notification = webkitNotifications.createNotification(
		'gift.png',
		'Information', 
		api.lastAlertText
	);
	
	notification.onclick = function(){
		chrome.tabs.create({url:"http://www.steamgifts.com"+api.lastAlertHref||""}, function(){
			notification.close();
		});
	};
	
	notification.show();
}

function clearBadge() {
	chrome.browserAction.setBadgeText({text: ''});
}

var _checkGiveawaysIntervalHandle;
function resetInterval() {
	Config.set('ticks', 0);

	_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
	_checkGiveawaysIntervalHandle = window.setInterval(checkGiveaways, Config.get('checkInterval'));
}

function checkNow(cb) {
	resetInterval();
	checkGiveaways(cb);
}

//Fire it up!
checkNow();