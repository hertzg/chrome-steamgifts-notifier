(function(){
	var hzApi = new API();
	
	chrome.extension.onConnect.addListener(function(port) {
		if(port.name == "digest") {
			Ports.add(port);
			
		} else if(port.name == 'interop') {
			
			port.onMessage.addListener(function(message, port){
				
				var op;
				if(typeof message == 'object') {
					var op = message.op;
				}
				
				function sendResponse(response, err) {
					port.postMessage({
						request: message,
						response: response,
						err: err
					});
				}
				
				switch(op) {
					case "init":
						sendResponse({
							user: hzApi.getUserInfo(),
							gifts: lastCrawledGifts
						});
					break;
					
					case 'enterGiveaawy' :
						sendResponse('soon');
					break;
					
					case 'commentGiveaway' :
						sendResponse('soon');
					break;
					
					default: 
						sendResponse('NotImplemented');
					break;
				}
			});
			
			port.onDisconnect.addListener(function(port){
				console.log('disconnected', port);
			});
		}
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
			if(!arr.length) return;
		
			arr.forEach(function(port){
				port.postMessage(obj);
			});
		};
		
		this.getArr = function() {
			return arr;
		};
	});

	var _checkGiveawaysIntervalHandle;
	function resetInterval() {
		_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
		_checkGiveawaysIntervalHandle = window.setInterval(checkGiveawaysIntervalHandler, 5000);
	}
	
	var lastCrawledGifts = [];
	function checkGiveawaysIntervalHandler(cb) {
		Ports.digest({
			type: 'status',
			code: 1,
			msg: 'Loading...'
		});
		
		setTimeout(function(){
			startAnimateBadgeText();
		}, 0);
		chrome.browserAction.setTitle({title:'Checking for new results'});

		hzApi.getGiveaways(API.STATUS_OPEN, 1, function(arr){
			var giftsAdd = [],
				giftsUpdate = [];
			
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
					};
					
					if(!found) {
						giftsAdd.push(gift);
					}
					
					if(changed) {
						giftsUpdate.push(gift);
					}
					
				} else {
					giftsAdd.push(gift);
				}
			});
			
			lastCrawledGifts = arr;
			
			setTimeout(function(){
				stopAnimateBadgeText();
			}, 1000);
			
			
			var result = {
				type: 'digest',
				user: hzApi.getUserInfo(),
				add: giftsAdd,
				update: giftsUpdate,
				//del: giftsDel,
				time: new Date().getTime()
			};			
			
			var res = true;
			if(cb) {
				res = cb(result);
			}
			
			if(res === false) return;
			
			var msg = "Waiting...";
			if(result.add.length) {
				msg = 'Found '+result.add.length + " new gift(s)";
			}
			
			Ports.digest({
				type: 'status',
				code: 0,
				msg: msg
			});
			Ports.digest(result);
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
	
	checkGiveawaysIntervalHandler();
	resetInterval();
	
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
})();