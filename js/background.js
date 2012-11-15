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
	
	Config.set('ticks', Config.get('ticks')+1);
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
			});
		} else {
			newItemCount = giveaways.length;
		}
		
		Config.set('posts', giveaways);
		
		stopAnimateBadgeText();		
		var lastUpdateDate = new Date(Config.get('lastUpdate'));
		
		chrome.browserAction.setBadgeText({text:(api.isAlert ? '! ': '')+newItemCount+(api.isAlert ? ' !': '')});
		chrome.browserAction.setTitle({title:'Found '+newItemCount+' new Deals\nLast Update @ '+ lastUpdateDate.toLocaleTimeString()});
		
		var clearBadgeHandler;
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
		
		Config.save();
		
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