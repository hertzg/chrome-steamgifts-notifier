(function(){
	console.log("Init...");
	chrome.extension.onConnect.addListener(function(port) {
		if(port.name == "digest") {
			
			Ports.add(port);
			
		} else if(port.name == 'interop') {
			
			port.onMessage.addListener(function(message, port){
				var op;
				if(typeof message == 'object') {
					var op = message.op;
				}
				
				switch(op) {
					case "getPosts":
						
						if(lastCrawledGifts && !lastCrawledGifts.length) {
							console.log("empty");
							_checkGiveawaysIntervalHandle(function(){
								console.log('crawled');
								sendResponse(lastCrawledGifts);
								return false;
							});
						} else {
							console.log('send last');
							sendResponse(lastCrawledGifts);
						}
						
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
				console.log('interop client disconnected');
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

	console.log("Init API...");
	var hzApi = new API();

	var _checkGiveawaysIntervalHandle;
	function resetInterval() {
		_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
		_checkGiveawaysIntervalHandle = window.setInterval(checkGiveawaysIntervalHandler, 5000);
	}
	
	var lastCrawledGifts = [];
	function checkGiveawaysIntervalHandler(cb) {
		console.log('Tick..');
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
			
			if(result.giftsNew.length) Ports.digest(result);
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
	
	console.log("First Crawl");
	checkGiveawaysIntervalHandler();
	console.log("Start interval");
	resetInterval();
})();