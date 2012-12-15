var backgroundThread = chrome.extension.getBackgroundPage();
if(!backgroundThread) {
	throw "Something went wrong NO BACKGROUND PAGE?!";
}

$(document).ready(function(){
	render();
	
	backgroundThread.clearBadge();
	
	$('#sort-'+Config.get('firstSortKey')).addClass('ui-btn-active')
	
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
	
	$('#sort-timeStart').click(function(){
		Config.set('firstSortKey', 'timeStart');
		render();
	});
	
	$('#sort-timeEnd').click(function(){
		Config.set('firstSortKey', 'timeEnd');
		render();
	});
	
	$('#sort-points').click(function(){
		Config.set('firstSortKey', 'points');
		render();
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

function shortenNumber(n) {
	if(!n) {
		return n;
	}
	
	if(n > 0 && n < 1) {
		return ((Math.round(n*100)/100)+'').substr(1);
	}
	

	if(n < 1000) {
		return (Math.round(n*100)/100)+'';
	}
	
	var k = n /1000;
	if(k < 1000) {
		return (Math.round(k*100)/100)+'k';
	} else {
		return (Math.round((k/1000)*100)/100)+'M';
	}	
}

function render(){
	updateHeader();
	
	var listEl = $('#list');
	
	if(!Config.get('posts').length) {
		$.mobile.loading( 'show', {
			text: 'SG Notifier is booting Up',
			textVisible: true,
			theme: 'a',
			html: "<h1>No Giveaways Found</h1><br/>Please try again later or reopen this popup.<br/><br/>Possible resons:<br/><ul><li>Running first time</li><li>Slow connection</li><li>Steamgifts lagging</li><li>Old Version</li></ul><br/><br/><br/>If this issue persists Please report on <a href=\"https://github.com/hertzg/chrome-steamgifts-notifier/issues/new\">GitHub</a>"
		});
		return;
	}
	
	Config.get('posts').sort(function(a, b){		
		if(a[Config.get('firstSortKey')] == b[Config.get('firstSortKey')]) {
			if(a.winChance == b.winChance || isNaN(a.winChance) || isNaN(b.winChance)) {
				return 0;
			}
			return a.winChance > b.winChance ? -1 : 1;
		}
		return a[Config.get('firstSortKey')] < b[Config.get('firstSortKey')] ? -1 : 1;
	});
	
	listEl.html("");
	
	if(!Config.get('posts').length) {
		listEl.append('<h1>Please wait....</h1>');
		return;
	}
	
	setTimeout(function(){

			
		Config.get('posts').forEach(function(v){
			/*listEl.append('<li><a href="index.html">\
						<h3>Stephen Weber</h3>\
						<p><strong>You\'ve been invited to a meeting at Filament Group in Boston, MA</strong></p>\
						<p>Hey Stephen, if you\'re available at 10am tomorrow, we\'ve got a meeting with the jQuery team.</p>\
						<p class="ui-li-aside"><strong>6:24</strong>PM</p>\
				</a></li>');*/
			var chance = (Math.round(v.winChance*10000)/100);
			
			var color = "", keyword = "";
			if(v.winChance < 0.01) {
				color = "255, 0, 0, 0.15";
				keyword = ":low :bad :red";
			} else if(0.01 <= v.winChance && v.winChance < 0.10) {
				color = "255, 255, 0, 0.15";
				keyword = ":medium :normal :yellow";
			} else if(v.winChance >= 0.10) {
				color = "0, 255, 0, 0.15";
				keyword = ":high :green :good";
			} else {
				color = "0, 0, 255, 0.15";
				keyword = ":unknown :blue :?";
			}
			
			listEl.append('\
				<li>\
					<a href="http://www.steamgifts.com'+v.href+'" target="_blank" style="background-color: rgba('+color+') !important;" class="details">\
						<img src="'+v.appLogo+'" alt="by '+v.authorName+'" title="by '+v.authorName+'" class="logo">\
						<div class="content-container">\
							<h3 title="'+v.title+'">'+v.title+'</h3><span class="icon'+(v.isNew ? ' icon-new' : '')+'" title="New"></span> <span class="icon'+(v.isPinned ? ' icon-pinned' : '')+'" title="Pinned"></span><br />\
							<span class="icon icon-copies" title="Copies">'+shortenNumber(v.copies)+'</span><span class="icon icon-points" title="Points">'+(v.points || '?')+'</span>\
							<span class="icon icon-comments" title="Comments">'+shortenNumber(v.comments)+'</span> <span class="icon icon-entries" title="'+v.entries+'">'+shortenNumber(v.entries)+'</span>\
							<span class="icon icon-gold" title="Winning odds">'+chance+'%</span>\
							'+(v.isContributorOnly ? '<span class="icon icon-contrib-'+(v.isContributorGreen ? 'green' : 'red')+'" title="'+v.contribUSD+'">$'+shortenNumber(v.contribUSD)+'</span>' : '' )+'<br/>\
							<span class="icon icon-timestarted" title="Time Started">'+v.timeStartText+' ago</span> <span class="icon icon-timeleft" title="Time left">'+v.timeEndText+' left</span>\
						</div>\
						<div style="clear: both !important;"></div>\
						<div style="display: none;">'+keyword+'</div>\
					</a>\
					<a data-icon="'+(v.isEntered ? "check" : "star")+'" id="" href="#act-'+v.uid+'"></a>\
				</li>'
			);
		});
		listEl.listview('refresh');
		$.mobile.loading('hide');
	}, 100);
	listEl.listview('refresh');
}