$(function(){
	
	var pointsEl = document.getElementById('userPoints'),
		pointsDiffEl = document.getElementById('userPointsDiff'),
		userLink = document.getElementById('userLink'),
		statusEl = document.getElementById('status');
		
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
	
	
	var listEl = document.getElementById('list');
	
	var overlayEl = document.createElement('div');
	overlayEl.classList.add('loading');
	overlayEl.style.height = document.body.clientHeight;
	overlayEl.style.lineHeight = document.body.clientHeight+20+'px';
	
	document.body.appendChild(overlayEl);
	
	overlayEl.innerHTML = "Loading...";
	
	var port = chrome.extension.connect({name: "interop"});
	port.onMessage.addListener(function(obj){
		if(obj.request.op == 'init') {
			updateUserBar(obj.response.user);
			obj.response.gifts.forEach(function(gift){
				var el = BoxTemplate.render(gift), spacerEl = BoxTemplate.renderSpacer();
				
				listEl.insertBefore(spacerEl, listEl.firstChild);
				listEl.insertBefore(el, spacerEl);
			});
			
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
		
		console.log('digest', obj);
		
		if(obj.type == 'status') {
			processStatus(obj);
			return;
		};
		
		if(obj.user) {
			updateUserBar(obj.user);
		}
		
		
		if(obj.add.length) {
			obj.add.forEach(function(gift){
				var el = BoxTemplate.render(gift), spacerEl = BoxTemplate.renderSpacer();
				el.style.opacity = 0;
				
				listEl.insertBefore(el, listEl.firstChild);
				if(el.nextSibling) {
					listEl.insertBefore(spacerEl, el.nextSibling);
				} else {
					listEl.appendChild(spacerEl);
				}
				
				$(el).animate({
					opacity: 1	
				}, 500);
				
			});
		}
	});
	
	digestPort.onDisconnect.addListener(function(){
		console.log('digest port disconnected');
	});
});	