var hashers = {
	hashSoonest: function hashSoonest(uid, gift) {
		var timeEnd = gift.timeEnd,
			winChance = gift.winChance;

		return ((1 - winChance)*1000)*timeEnd;
	},

	hashNewest: function hashNewest(uid, gift) {
		return ((1 - gift.winChance)*1000)*gift.timeStart
	},

	hashCheapest: function hashCheapest(uid, gift) {
		return ((1 - gift.winChance)*1000)*gift.points;
	},

	hashWinChance: function hashWinChance(uid, gift) {
		return (1-gift.winChance)*1000;
	}
};

var hashFunction = hashers.hashWinChance;
var ListMan = null,
	port = chrome.extension.connect();

$(function(){
	//Grab the main elements
	var overlayEl = document.createElement('div'),
		listEl = document.getElementById('list'),
		pointsEl = document.getElementById('userPoints'),
		pointsDiffEl = document.getElementById('userPointsDiff'),
		userLink = document.getElementById('userLink'),
		statusEl = document.getElementById('status');

	//TODO (move this to a better place): global overlay div
	overlayEl.classList.add('loading');
	overlayEl.classList.add('hide');
	overlayEl.style.height = document.body.clientHeight;
	overlayEl.style.lineHeight = (document.body.clientHeight+20)+'px';
	document.body.appendChild(overlayEl);

	//Fire up the overlay
	showOverlay('Initializing....');
	
	//Grab the filter elements
	var filterOrderBy = document.getElementById('filterOrderBy'),
		filterText = document.getElementById('filterText'),
		filterDoFilterButton = document.getElementById('filterDoFilter');
	
	//Initialize list manager (Animation, Sorting and all the crap)
	ListMan = new ListManager(listEl, hashFunction, []);

	function showOverlay(innerHTML) {
		if(overlayEl.classList.contains('hide')) {
			overlayEl.innerHTML = innerHTML;
			overlayEl.classList.remove('hide');
		}
	}

	function hideOverlay() {
		if(!overlayEl.classList.contains('hide')) {
			overlayEl.classList.add('hide');
		}
	}

	//Function that updates header bar with user info
	function updateUserBar(user) {
		pointsEl.innerText = user.points;
		
		if(user.pointsDiff) {
			pointsDiffEl.style.opacity = 0;
			
			if(user.pointsDiff > 0) {
				pointsDiffEl.classList.remove('red');
				pointsDiffEl.classList.add('green');
				pointsDiffEl.innerText =  "+"+user.pointsDiff;
			} else {
				pointsDiffEl.classList.remove('green');
				pointsDiffEl.classList.add('red');
				pointsDiffEl.innerText =  user.pointsDiff;
			}
			
			pointsDiffEl.style.opacity = 1;
			setTimeout(function(){
				pointsDiffEl.style.opacity = 0;
				setTimeout(function(){
					pointsDiffEl.innerText = '';
				}, 50);
			}, 3000);
		}
		
		userLink.innerText = user.username;
		userLink.href = "http://www.steamgifts.com"+user.userHref;
	}

	//Hook the port message analyzer
	port.onMessage.addListener(function(obj){
		hideOverlay();

		if(obj.user) {
			updateUserBar(obj.user);
		}

		var upsertArr = obj.add.concat(obj.update);
		if(upsertArr.length) {
			upsertArr.forEach(function(gift){
 				ListMan.getMap().put(gift.uid, gift);
			});
		}

		if(obj.remove.length) {
			obj.remove.forEach(function(gift){
				ListMan.getMap().remove(gift.uid);
			});
		}
	});
	
	//Smth went wrong
	port.onDisconnect.addListener(function(port){
		showOverlay('Connection lost...');
	});
});