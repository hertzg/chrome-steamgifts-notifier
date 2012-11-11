var _data;
var _user;
var _sortOn = "newest";
var backgroundPage = chrome.extension.getBackgroundPage();

$(document).ready(function(){		
	_data = $.parseJSON(localStorage["data"]);
	_user = $.parseJSON(localStorage["user"]);
	
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
	}*/
	
	
	function template(data) {
			/*if typeof newItems != 'undefined' && newItems == 1}}
				<li data-role="list-divider">New giveaways</li>
			{{else typeof newItems != 'undefined' && newItems == -1}}
				<li data-role="list-divider">Old giveaways</li>
			{{/if}}*/
			
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
				<a class="external" href="http://www.steamgifts.com'+data.link+'" style="background-color: rgba('+rgba+');">\
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
}