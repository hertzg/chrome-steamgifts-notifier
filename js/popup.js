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

function render(){
	updateHeader();
	
	var listEl = $('#list');
	
	$.mobile.loading( 'show', {
		text: 'Rendering Page...',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	
	Config.get('posts').sort(function(a, b){	
		var ac = (1/(a.entries ? a.entries+1 : NaN)),
			bc =((1/(b.entries ? b.entries+1 : NaN)));
		
		if(a[Config.get('firstSortKey')] == b[Config.get('firstSortKey')]) {
			if(ac == bc || isNaN(ac) || isNaN(bc)) {
				return 0;
			}
			return ac > bc ? -1 : 1;
		}
		return a[Config.get('firstSortKey')] < b[Config.get('firstSortKey')] ? -1 : 1;
	});
	
	listEl.html("");
	setTimeout(function(){ //Sorry for this but some think clicking refresh is not working :)))
		Config.get('posts').forEach(function(v){
			/*listEl.append('<li><a href="index.html">\
						<h3>Stephen Weber</h3>\
						<p><strong>You\'ve been invited to a meeting at Filament Group in Boston, MA</strong></p>\
						<p>Hey Stephen, if you\'re available at 10am tomorrow, we\'ve got a meeting with the jQuery team.</p>\
						<p class="ui-li-aside"><strong>6:24</strong>PM</p>\
				</a></li>');*/
			
			var rawChance = 1/(v.entries ? v.entries+1 : 1);
			var chance = (Math.round(rawChance*10000)/100);
			
			var color = "", keyword = "";
			if(rawChance < 0.01) {
				color = "255, 0, 0, 0.15";
				keyword = ":low :bad :red";
			} else if(0.01 <= rawChance && rawChance < 0.10) {
				color = "255, 255, 0, 0.15";
				keyword = ":medium :normal :yellow";
			} else if(rawChance >= 0.10) {
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
							<h3 title="'+v.title+'">'+v.title+'</h3>'+(v.isNew ? '<span class="icon icon-new" title="New">&nbsp;</span>' : '')+''+(v.isPinned ? '<span class="icon icon-pinned" title="Pinned">&nbsp;</span>' : '')+'<br />\
							<span class="icon icon-copies" title="Copies">'+v.copies+'</span> &bull; <span class="icon icon-points" title="Points">'+(v.points || '???')+'</span> &bull;\
							<span class="icon icon-comments" title="Comments">'+v.comments+'</span> &bull; <span class="icon icon-entries" title="Entries">'+v.entries+'</span> &bull; <span class="icon icon-gold" title="Winning odds">'+chance+'%</span><br/>\
							<span class="icon icon-timestarted" title="Time Started">'+v.timeStartText+' ago</span> &bull; <span class="icon icon-timeleft" title="Time left">'+v.timeEndText+' left</span>\
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
	}, 200);
	listEl.listview('refresh');
}