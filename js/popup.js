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


var backgroundThread = chrome.extension.getBackgroundPage();
if(!backgroundThread) {
	throw "Something went wrong NO BACKGROUND PAGE?!";
}

$(document).ready(function(){
	render();
	
	backgroundThread.clearBadge();
	
	
	$('#reloadData').click(function(){
		backgroundThread.checkNow(function(){
			render();
		});
	});
	
	$('#refreshData').click(function(){
		render();
	});		
	
});

function render(){
	loadVariables();
	
	var listEl = $('#list');
	
	listEl.html("");
	_posts.forEach(function(v){
		/*listEl.append('<li><a href="index.html">\
					<h3>Stephen Weber</h3>\
					<p><strong>You\'ve been invited to a meeting at Filament Group in Boston, MA</strong></p>\
					<p>Hey Stephen, if you\'re available at 10am tomorrow, we\'ve got a meeting with the jQuery team.</p>\
					<p class="ui-li-aside"><strong>6:24</strong>PM</p>\
			</a></li>');*/
			
		var chance = (Math.round((1/(v.entries ? v.entries+1 : NaN))*10000)/100);
		var color = "";
		if(chance < 1) {
			color = "255, 0, 0, 0.15";
		} else if(1 < chance && chance < 10) {
			color = "255, 255, 0, 0.15";
		} else if(chance >= 10) {
			color = "0, 255, 0, 0.15";
		} else {
			color = "0, 0, 255, 0.15";
		}
		
		listEl.append('\
							<li>\
						<a href="http://www.steamgifts.com'+v.href+'" target="_blank" style="background-color: rgba('+color+') !important;">\
							<h3>'+v.title+'</h3>\
							<p>Points: <strong>'+v.points+'</strong><p>\
							<p>Entries: <strong>'+v.entries+'</strong> &bull; Comments: <strong>'+v.comments+'</strong></p>\
							<span class="ui-li-count">'+((Math.round((1/(v.entries ? v.entries : NaN))*10000)/100)||"?")+'%</span>\
							<p class="ui-li-aside">Ends: <strong>'+v.timeEndText+'</strong></p>\
						</a>\
						<a data-icon="'+(v.isEntered ? "check" : "star")+'" style="background-color: rgba('+(v.isEntered ? "0, 255, 0, 0.15" : "0, 255, 255, 0.15")+') !important;" href="#"></a>\
					</li>'
		);
	});
	
	listEl.listview('refresh');
}



/*





var _data;
var _user;
var _sortOn = "newest";
var backgroundPage = chrome.extension.getBackgroundPage();

$(document).ready(function(){		
	_data = JSON.parse(localStorage["data"]);
	_user = JSON.parse(localStorage["user"]);
	
	// resort
	if( typeof localStorage['sort'] == 'undefined' ){
		localStorage['sort'] = _sortOn;
	}else{
		_sortOn = localStorage['sort'] ;
	}
	
	if( _sortOn == "ending" ){
		resortByEnd();
	}else{
		resortByNew();
	}
	
	// trim to 20 last
	if( _data.length > 20 ){
		_data = _data.slice(0,20);
	}
	
	// reset counter
	backgroundPage.resetCounter();
	
	/*var newCount = localStorage["newcounter"];
	if( newCount > 0 ){
		console.log('new items: '+newCount);
		_data[0].newItems = 1;
		_data[newCount].newItems = -1;
		console.log(_data[0]);
		console.log(_data[newCount]);
	}*
	
	
	function template(data) {
			/*if typeof newItems != 'undefined' && newItems == 1}}
				<li data-role="list-divider">New giveaways</li>
			{{else typeof newItems != 'undefined' && newItems == -1}}
				<li data-role="list-divider">Old giveaways</li>
			{{/if}}*
			
			var entries = parseInt(data.entries.replace(/([^0-9]*)/g, ''));
			var chance = (1/(entries || 1));
			var winPrcnt = Math.round(chance*10000)/100;
			
			if(chance < 0.1) {
				rgba = "255, 0, 0, .3";
			} else if(0.09 < chance && chance < 0.35) {
				rgba = "255, 255, 0, .3";
			} else if(chance >= 0.35) {
				rgba = "0, 255, 0, .3";
			}
			
			return '\
			<li>\
				<a href="http://www.steamgifts.com'+data.link+'">\
					<h3>'+data.title+' (Win:'+winPrcnt+'%)</h3>\
					<p class="ui-li-count" style="width: 20px;">'+data.cost+'</p>\
					<p>Ends: <strong>'+data.time_left_text+' @ '+data.end_date+'</strong></p>\
					<p>Created by '+data.created_by_name+', at '+data.created_date+'</p>\
					<p style="font-size: 11px;">Giveaway has '+data.entries+' and '+data.comments+'.</p>\
				</a>\
			</li>';
	}
	
	// render data
	
	_data.forEach(function(v){
		$('#list').append(template(v));
	});
	
	//$( "#gaTemplate" ).tmpl( _data ).appendTo( "#list" );  //!____________________________________!!!!!_______________
	
	$("#creds").text(_user.points);
	
	// set external click handler
	$("a.external").live('click', function(){
		chrome.tabs.create({'url': $(this).attr('href')});
		window.close();
	});
	
	// resort handlers
	$("#slider").change(function(){
		if( $(this).val() == _sortOn ) return;
		
		switch( $(this).val() ){
			case "newest":
				resortByNew();
				break;
			case "ending":
				resortByEnd();
				break;
		}
		
		$( "#list" ).empty();
		
		_data.forEach(function(v){
			$('#list').append(template(v));
		});
		
		//$( "#gaTemplate" ).tmpl( _data ).appendTo( "#list" ); //!____________________________________!!!!!_______________
		
		$( "#list" ).listview("refresh");
	});
	
	// refresh
	$("#refresh").click(function(){
		backgroundPage.checkDeals();
		window.close();
	});
	
});

function resortByNew(){
	_sortOn = localStorage['sort'] = "newest";

	$("#newest").addClass("selected");
	$("#ending").removeClass("selected");

	_data = _data.sort(function(a,b){
		return a.time_created > b.time_created ? -1 : 1	;
	});
}

function resortByEnd(){
	_sortOn = localStorage['sort'] = "ending";

	$("#ending").addClass("selected");
	$("#newest").removeClass("selected");

	_data = _data.sort(function(a,b){
		return a.time_left > b.time_left ? 1 : -1;
	});
}*/