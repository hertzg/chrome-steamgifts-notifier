function API() {
	var that = this;
	
	//== Constants
	this.STATUS_NEW = 'new';
	this.STATUS_OPEN = 'open';

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
		$.get('http://www.steamgifts.com/'+status+'/'+page, function(html){
			var arr = that.processGIveaways(html);
			callback(that, arr);
		});
	};
	
	this.processGiveaways(html) {
		$('.post', html).each(function(idx, item){
			
		});
	};
	
	this.processGiveaway(postHTML) {
		
	};

}