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

function resetInterval() {
	_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
	_checkGiveawaysIntervalHandle = window.setInterval(checkGiveawaysIntervalHandler, 10000);
}

function checkGiveawaysIntervalHandler(cb) {
	stopAnimateBadgeText();
	startAnimateBadgeText();

	chrome.browserAction.setTitle({title:'Checking for new results'});

	hzApi.getGiveaways(API.STATUS_OPEN, 1, function(arr, code, text){

		//TODO: restrict to maximum retries
		if(code != 200) {
			console.log('Received code', code, 'retrying...');
			checkGiveawaysIntervalHandler();
			return;
		}

		var giftsAdd = [],
			giftsUpdate = [],
			giftsRemove = [];
		
		arr.forEach(function(gift){
			var obj = gift.toObject();
			
			if(lastCrawledGifts.length) {
				
				var found = false,
					changed = false;
				for(var i=0; i<lastCrawledGifts.length; i++) {
					if(lastCrawledGifts[i].equals(gift)) {
						found = true;
						changed = lastCrawledGifts[i].hasChanged(gift);
						break;
					}
				}

				var remove = true;
				for(var i=0; i<lastCrawledGifts.length; i++) {
					if(lastCrawledGifts[i].uid == gift.uid){
						remove = false;
						break;
					}
				}
				
				if(!found) {
					giftsAdd.push(gift);
				}
				
				if(changed) {
					giftsUpdate.push(gift);
				}

				if(remove) {
					giftsRemove.push(gift);
				}
			} else {
				giftsAdd.push(gift);
			}
		});
		
		lastCrawledGifts = arr;
		
		stopAnimateBadgeText();
		
		newItemsCount += giftsAdd.length;
		
		lastResult = {
			type: 'state',
			user: hzApi.getUserInfo(),
			add: giftsAdd,
			update: giftsUpdate,
			remove: giftsRemove,
			time: new Date().getTime()
		};

		if(cb && cb(lastResult, arr) === false) return;

		var badgeText = '';
		if(hzApi.isAlert) {
			badgeText += ' ! '+newItemsCount+' ! ';
		} else {
			badgeText += newItemsCount;
			if(newItemsCount <= 0) {
				setTimeout(function(){
					chrome.browserAction.setBadgeText({text:''});
				}, 2500);
			}
		}
		chrome.browserAction.setBadgeText({text:badgeText});

		Digest.digest(lastResult);
	});
}

var Digest = new PortManager(),
	hzApi = new API();

var lastCrawledGifts = [],
	lastResult = null;

var newItemsCount = 0;

var _animationHandle = null,
	_checkGiveawaysIntervalHandle = null,
	_blinkState = null;

Digest.onConnect = function(port) {
	checkGiveawaysIntervalHandler(function(result, all){ //Send him init
		result.type = 'init';
		result.add = all;
		result.update = [];
		result.remove = [];
		newItemsCount = 0;
		port.postMessage(result);
		return false;
	});
};

Digest.onReceive = function(obj, port) {
	if(obj.type == 'refresh') {
		checkGiveawaysIntervalHandler(function(obj){
			obj.type = 'refresh';
		});
	} else if(obj.type == 'enterGiveaway') {
		console.log('enterGiveaway', obj);
		hzApi.enterGiveaway(obj.uid, function(responseText, code, statusText){
			checkGiveawaysIntervalHandler(function(obj){
				obj.type = 'enterGiveaway'
			});
		})
	} else {
		port.postMessage('NotYetImplemented!');
	}
};

resetInterval();
checkGiveawaysIntervalHandler();

Digest.onDisconnect = function(port){
	if(Digest.getPorts().length == 1) { //If this was the last client
		//console.log('last client disconnected');
		//_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
	}
	//console.log('Disconnect', port.portId_);
};