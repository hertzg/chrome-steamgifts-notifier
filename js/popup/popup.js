var hashers = {
	soonest: function hashSoonest(a, b) {
		if(a.timeEnd == b.timeEnd) {
			if(a.winChance == b.winChance) {
				return 0;
			}
			return a.winChance > b.winChance ? -1 : 1;
		}
		return a.timeEnd > b.timeEnd ? 1 : -1;
	},

	newest: function hashNewest(a, b) {
		if(a.timeStart == b.timeStart) {
			if(a.winChance == b.winChance) {
				return 0;
			}
			return a.winChance > b.winChance ? -1 : 1;
		}
		return a.timeStart > b.timeStart ? 1 : -1;
	},

	cheapest: function hashCheapest(a, b) {
		if(a.points == b.points) {
			if(a.winChance == b.winChance) {
				return 0;
			}
			return a.winChance > b.winChance ? -1 : 1;
		}
		return a.points > b.points ? 1 : -1;
	},

	winChance: function hashWinChance(a, b) {
		//console.log(a.winChance, (a.winChance == b.winChance ? '=' : (a.winChance > b.winChance ? ">" : "<")), b.winChance, a.uid, b.uid)
		if(a.winChance == b.winChance) {
			return 0;
		}
		return a.winChance > b.winChance ? -1 : 1;
	}
};

var hashFunction = hashers.soonest;
var ListMan = null,
	port = chrome.extension.connect();

$(function(){
	//Grab the main elements
	var overlayEl = document.createElement('div'),
		listEl = document.getElementById('list'),
		pointsEl = document.getElementById('userPoints'),
		pointsDiffEl = document.getElementById('userPointsDiff'),
		userLink = document.getElementById('userLink'),
		statusEl = document.getElementById('status'),
		gotoTopEl =document.getElementById('gotoTop');

	//TODO (move this to a better place): global overlay div
	overlayEl.classList.add('loading');
	overlayEl.classList.add('hide');
	overlayEl.style.height = document.body.clientHeight;
	overlayEl.style.lineHeight = (document.body.clientHeight+20)+'px';
	document.body.appendChild(overlayEl);

	gotoTopEl.onclick = function(){
		document.body.scrollTop = 0;
		this.classList.add('hide');
	};

	window.onmousewheel = function(){
		if(document.body.scrollTop >= 550) {
			gotoTopEl.classList.remove('hide');
		} else {
			gotoTopEl.classList.add('hide');
		}
	};

	//Fire up the overlay
	showOverlay('Initializing....');
	
	//Grab the filter elements
	var filterOrderBy = document.getElementById('filterOrderBy'),
		filterDoStort  = document.getElementById('filterSort'),
		filterText = document.getElementById('filterText'),
		filterDoFilterButton = document.getElementById('filterDoFilter');
	
	//Initialize list manager (Animation, Sorting and all the crap)
	ListMan = new ListManager(listEl, hashFunction, []);
	
	filterDoStort.onclick = function() {
		var newHashFunction = hashers[filterOrderBy.value]
		
		if(hashFunction !== newHashFunction) {
			hashFunction = newHashFunction;
			ListMan.getMap().reSort(newHashFunction) //TODO: Fix node refference error
		}
	}

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