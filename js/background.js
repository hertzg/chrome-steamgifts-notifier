function loadVariables() {

	var defaultConfig = {
			checkInterval: 180000, //3 * 60 * 1000 = 3 min
	};

	window._config 		= localStorage.config 		? JSON.parse(localStorage.config) 		: defaultConfig;
	window._lastUpdate 	= localStorage.lastUpdate 	? JSON.parse(localStorage.lastUpdate) 	: 0;
	window._ticks 		= localStorage.ticks 		? JSON.parse(localStorage.ticks) 		: 0;
	window._posts 		= localStorage.posts 		? JSON.parse(localStorage.posts) 		: [];
}

function saveVariables() {
	localStorage.config 		= JSON.stringify(window._config);
	localStorage.lastUpdate 	= JSON.stringify(window._lastUpdate);
	localStorage.ticks 		= JSON.stringify(window._ticks);
	localStorage.posts 		= JSON.stringify(window._posts);
}

var _animationHandle;
function startAnimateBadgeText() {

	if(_animationHandle) {
		return;
	}

	var tick = 0;
	_animationHandle = setInterval(function(){
		
		switch(tick++) {
			case 0 :
				chrome.browserAction.setBadgeText({ text: '.  '});
			break;
			case 1 :
				chrome.browserAction.setBadgeText({ text: '.. '});
			break;
			case 2 :
				chrome.browserAction.setBadgeText({ text: '...'});
			break;
			case 3 :
				chrome.browserAction.setBadgeText({ text: ' ..'});
			break;
			case 4 :
				chrome.browserAction.setBadgeText({ text: '  .'});
			break;
			case 5 :
				chrome.browserAction.setBadgeText({ text: '   '});
			break;
			case 6 :
				chrome.browserAction.setBadgeText({ text: ':  '});
			break;
			case 7 :
				chrome.browserAction.setBadgeText({ text: ':: '});
			break;
			case 8 :
				chrome.browserAction.setBadgeText({ text: ':::'});
			break;
			case 9 :
				chrome.browserAction.setBadgeText({ text: ' ::'});
			break;
			case 10 :
				chrome.browserAction.setBadgeText({ text: '  :'});
			break;
			case 11 :
				chrome.browserAction.setBadgeText({ text: '   '});
			break;
		}
		
		if(tick > 11) tick = 0;
		
	}, 100);
}

function stopAnimateBadgeText(){
	if(_animationHandle) _animationHandle = clearInterval(_animationHandle);
	chrome.browserAction.setBadgeText({text:''});
}


//Load global variables
loadVariables();

//Initialize the HzSGAPI
var api = new API();


function checkGiveaways(cb) {
	
	_ticks++;
	_lastUpdate = new Date().getTime();

	stopAnimateBadgeText();
	startAnimateBadgeText();
	chrome.browserAction.setTitle({title:'Checking for new results'});
	
	api.getGiveaways(API.STATUS_OPEN, 1, function(giveaways){		
		var newItemCount = 0;
		if(_posts.length != 0) {
			giveaways.forEach(function(gift){
				for(var i=0; i<_posts.length; i++) {
					if(_posts[i].uid == gift.uid) {
						break;
					}
				}
				
				if(i == _posts.length) {
					newItemCount++;
				}
			});
		} else {
			newItemCount = giveaways.length;
		}
		
		_posts = giveaways;
		
		stopAnimateBadgeText();		
		var lastUpdateDate = new Date(_lastUpdate);
		
		chrome.browserAction.setBadgeText({text:''+newItemCount});
		chrome.browserAction.setTitle({title:'Found '+newItemCount+' new Deals\nLast Update @ '+ lastUpdateDate.toLocaleTimeString()});
		
		var clearBadgeHandler;
		if(newItemCount == 0) {
			clearBadgeHandler = clearTimeout(clearBadgeHandler);
			clearBadgeHandler = setTimeout(function(){
				clearBadge();
			}, 3000);
		}
		
		saveVariables();
		
		if(cb) cb();
	});
}

function clearBadge() {
	chrome.browserAction.setBadgeText({text: ''});
}

var _checkGiveawaysIntervalHandle;
function resetInterval() {
	
	_ticks = 0;

	_checkGiveawaysIntervalHandle = window.clearInterval(_checkGiveawaysIntervalHandle);
	_checkGiveawaysIntervalHandle = window.setInterval(checkGiveaways, _config.checkInterval);
}

function checkNow() {
	resetInterval();
	checkGiveaways();
}

//Fire it up!
checkNow();