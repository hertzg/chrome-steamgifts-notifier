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
		
		
		lastResult = {
			type: 'state',
			user: hzApi.getUserInfo(),
			add: giftsAdd,
			update: giftsUpdate,
			remove: giftsRemove,
			time: new Date().getTime()
		};

		if(cb && cb(lastResult, arr) === false) return;

		Digest.digest(lastResult);
	});
}

var Digest = new PortManager(),
	hzApi = new API();

var lastCrawledGifts = [],
	lastResult = null;

var _animationHandle = null,
	_checkGiveawaysIntervalHandle = null;

Digest.onConnect = function(port) {
	//console.log('Connected', port.portId_);
	if(Digest.getPorts().length == 0) { //If he is the first client
		//console.log('Start the interval');
		resetInterval();
	}
	//console.log('Sending init');
	checkGiveawaysIntervalHandler(function(result, all){ //Send him init
		result.type = 'init';
		result.add = all;
		result.update = [];
		result.remove = [];
		port.postMessage(result);
		//console.log('Sent!', result);
		return false;
	});
};

Digest.onDigest = function(obj, ports){
	//console.log('Digest', ports, obj);
};

Digest.onMessage = function(obj, port) {
	if(obj.type == 'refresh') {
		checkGiveawaysIntervalHandler(function(obj){
			obj.type = 'refresh';
		});
	} else {
		port.postMessage('NotYetImplemented!');
	}
};


Digest.onDisconnect = function(port){
	if(Digest.getPorts().length == 1) { //If this was the last client
		//console.log('last client disconnected');
		//_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
	}
	//console.log('Disconnect', port.portId_);
};

