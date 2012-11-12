function API() {
	var that = this;
	
	//== Constants
	API.STATE_WORKING = 'working';
	API.STATE_IDLE = 'idle';
	API.STATE_WAITING = 'waiting';
	
	API.STATUS_NEW = 'new';
	API.STATUS_OPEN = 'open';
	API.STATUS_CLOSED = 'closed';
	API.STATUS_COMING_SOON = 'coming-soon';
	
	//== Fields
	this.state = 'idle';

	this.points = null;
	this.pointsDiff = null;
	this.user = null;
	this.lastUpdate = null;
	
	//== EVENTS
	this.onStateChange = function(){};

	//== Methods
	this.init = function(){
		
	};
	
	this.getGiveaways = function(status, page, callback){
		$.get('http://www.steamgifts.com/'+status+'/page/'+page, function(html){
			var arr = that.processGiveaways(html);
			callback(arr);
		});
	};
	
	this.processGiveaways = function(html) {
		var arr = [];
		$('.post', html).each(function(idx, item){
			arr.push(that.processGiveaway(item));
		});
		return arr;
	};
	
	this.processGiveaway = function(node) {
		var giveawayObject = new Giveaway();
		giveawayObject.init(node);
		return giveawayObject;
	};

}