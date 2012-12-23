$(function(){
	
	var overlayEl = document.createElement('div'),
		listEl = document.getElementById('list'),
		pointsEl = document.getElementById('userPoints'),
		pointsDiffEl = document.getElementById('userPointsDiff'),
		userLink = document.getElementById('userLink'),
		statusEl = document.getElementById('status');
		
	var filterOrderBy = document.getElementById('filterOrderBy'),
		filterText = document.getElementById('filterText'),
		filterDoFilterButton = document.getElementById('filterDoFilter');
	
	overlayEl.classList.add('loading');
	overlayEl.innerHTML = "Loading...";
	overlayEl.style.height = document.body.clientHeight;
	overlayEl.style.lineHeight = document.body.clientHeight+20+'px';
	document.body.appendChild(overlayEl);
	

	window.ListMan = new ListManager(listEl);

	function searchInList() {
		var search = filterText.value;
		if(!search) return;
	
		filterDoFilterButton.onclick = null;
		ListMan.runFilter(function(obj){
			return obj.title.indexOf(search) != -1;
		}, function(){
			function reset() {
				filterDoFilterButton.onclick = null;
				ListMan.reset(function(){
					filterDoFilterButton.onclick = searchInList;
				});
			}


			filterDoFilterButton.onclick = reset;
		});
	};
	filterDoFilterButton.onclick = searchInList;
	
	var _autoFilterTimeoutHandler = null;
	filterText.onkeyup = function(){
		_autoFilterTimeoutHandler = clearTimeout(_autoFilterTimeoutHandler);
		_autoFilterTimeoutHandler = setTimeout(function(){
			
			
			
		}, 3000);
	};
	
	
	

	var firstSortKeyMap = {
		"soonest": 'timeEnd',
		"cheapest": 'points',
		"newest": 'timeStart'
	};

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
			
			$(pointsDiffEl).animate({
				opacity: 1
			}, 500, function(){
				setTimeout(function(){
					$(pointsDiffEl).animate({
						opacity: 0,
					}, 500, function(){
						pointsDiffEl.innerText = '';
					});
				}, 4000);
			});
		}
		
		userLink.innerText = user.username;
		userLink.href = "http://www.steamgifts.com"+user.userHref;
	}
	
	function processStatus(obj) {
		statusEl.innerText = obj.msg;
	}
	
	
	var port = chrome.extension.connect({name: "interop"});
	port.onMessage.addListener(function(obj){
		if(obj.request.op == 'init') {
			updateUserBar(obj.response.user);

			ListMan.addObjRange(obj.response.gifts);	

			$(overlayEl).animate({
				opacity: 0
			}, 500, function(){
				overlayEl.classList.add('hide');
			});
		}
		
	});
	
	port.onDisconnect.addListener(function(){
		overlayEl.innerHTML = 'Connection lost...';
		overlayEl.classList.remove('hide');
	});
	port.postMessage({op:'init'});
	
	var digestPort = chrome.extension.connect({name:"digest"});
	digestPort.onMessage.addListener(function(obj){

		//If its a Status Update
		if(obj.type == 'status') {
			processStatus(obj);
			return;
		};
		
		if(obj.user) {
			updateUserBar(obj.user);
		}
		
		
		if(obj.add.length) {
			obj.add.forEach(function(gift){
				var el = BoxTemplate.render(gift);
				el.opacity = 0; //Hide the element after insertion
				ListMan.addBoxFirst(el);
				$(el).animate({ //Animate fade in effect
					opacity: 1
				}, 500);
			});
		}
	});
	
	digestPort.onDisconnect.addListener(function(){
		overlayEl.innerHTML = 'Connection lost...';
		overlayEl.classList.remove('hide');
	});
});	