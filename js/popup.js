function loadVariables() {

	var defaultConfig = {
			checkInterval: 120000, //2 * 60 * 1000 = 2 min
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


var backgroundThread = chrome.extension.getBackgroundPage();
if(!backgroundThread) {
	throw "Something went wrong NO BACKGROUND PAGE?!";
}

$(document).ready(function(){
	render();
	
	backgroundThread.clearBadge();
	
	
	$('#reloadData').click(function(){
		$.mobile.loading( 'show', {
			text: 'Loading new Data...',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		
		backgroundThread.checkNow(function(){
			$.mobile.loading('hide');
			render();
		});
		
	});
	
	$('#refreshData').click(function(){
		render();
	});
	
});

function updateHeader() {
	var username = "Guest";
	var points = '---';
	
	if(backgroundThread.api.isAuthorized) {
		username = '<a href="http://www.steamgifts.com'+backgroundThread.api.userHref+'" target="_blank">'+backgroundThread.api.username+'</a>';
		points = backgroundThread.api.points+"P";
		
		var positive = backgroundThread.api.pointsDiff > 0;
		if(backgroundThread.api.pointsDiff) {
			
			
			points += ' <span style="color:'+(positive ? "green" : "red")+';">'+(positive ? "+" : "")+backgroundThread.api.pointsDiff+"</span>";
		}
	}
	
	$("#user").html(username);
	$("#points").html(points);
}

function render(){
	loadVariables();
	updateHeader();
	
	var listEl = $('#list');
	
	$.mobile.loading( 'show', {
		text: 'Rendering Page...',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	
	_posts.sort(function(a, b){	
		var ac = Math.round((1/(a.entries ? a.entries+1 : NaN))*10000)/100,
			bc = Math.round((1/(b.entries ? b.entries+1 : NaN))*10000)/100;
		
		if(a.timeEnd == b.timeEnd) {
			if(ac == bc || isNaN(ac) || isNaN(bc)) {
				return 0;
			}
			return ac > bc ? -1 : 1;
		}
		return a.timeEnd < b.timeEnd ? -1 : 1;
	});
	
	listEl.html("");
	setTimeout(function(){ //Sorry for this but some think clicking refresh is not working :)))
		_posts.forEach(function(v){
			/*listEl.append('<li><a href="index.html">\
						<h3>Stephen Weber</h3>\
						<p><strong>You\'ve been invited to a meeting at Filament Group in Boston, MA</strong></p>\
						<p>Hey Stephen, if you\'re available at 10am tomorrow, we\'ve got a meeting with the jQuery team.</p>\
						<p class="ui-li-aside"><strong>6:24</strong>PM</p>\
				</a></li>');*/
				
			var chance = (Math.round((1/(v.entries ? v.entries+1 : NaN))*10000)/100);
			var color = "", keyword = "";
			if(chance < 1) {
				color = "255, 0, 0, 0.15";
				keyword = ":low :bad :red";
			} else if(1 < chance && chance < 10) {
				color = "255, 255, 0, 0.15";
				keyword = ":medium :normal :yellow";
			} else if(chance >= 10) {
				color = "0, 255, 0, 0.15";
				keyword = ":high :green :good";
			} else {
				color = "0, 0, 255, 0.15";
				keyword = ":unknown :blue :?";
			}
			
			listEl.append('\
				<li>\
					<a href="http://www.steamgifts.com'+v.href+'" target="_blank" style="background-color: rgba('+color+') !important;">\
						<img src="'+v.authorAvatar+'" title="'+v.authorName+'" style="margin-top: 14px; margin-left: 8px;">\
						<h3>'+v.title+'</h3>\
						<p>Points: <strong>'+v.points+'</strong> &bull; by <strong>'+v.authorName+'</strong> <p>\
						<p>Entries: <strong>'+v.entries+'</strong> &bull; Comments: <strong>'+v.comments+'</strong></p>\
						<span class="ui-li-count">'+((Math.round((1/(v.entries ? v.entries : NaN))*10000)/100)||"?")+'%</span>\
						<p class="ui-li-aside"><strong>'+v.timeEndText+'</strong> left</p>\
						<div style="display: none;">'+keyword+'</div>\
					</a>\
					<a data-icon="'+(v.isEntered ? "check" : "star")+'" id="" href="#act-'+v.uid+'"></a>\
				</li>'
			);
		});
		listEl.listview('refresh');
		$.mobile.loading('hide');
	}, 200);
	listEl.listview('refresh');
}