function Giveaway(html) {

	//=== FIELDS
	this.uid = null;
	this.title = null;
	this.href = null;
	
	this.isNew 				= null;
	this.isEntered 			= null;
	this.isContributorOnly 	= null;
	this.isGroupOnly 		= null;
	this.isEnterable 		= null;
	this.isClosed 			= null;
	this.isCommentable 		= null;
	this.isFetched 			= false;
	this.isProcessed  		= false;
	
	this.points = null;
	this.pirceUSD = null;
	
	this.timeStartText = null;
	this.timeStart = null;
	this.timeEndText = null;
	this.timeEnd = null;
	
	this.authorLink = null;
	this.authorName = null;
	this.authorAvatar = null;
	
	this.entries = null;
	this.comments = null;
	
	this.description = null;
	
	this.steamId = null;
	this.steamLink = null;
	
	this.submitKey = null;
	this.enterText = null;
	
	this.postHTML = null;
	this.fetchedHTML = null;
	
	//== Constants
	


	//== METHODS
	this.init = function(html) {
		//TODO: processing here
	};
	
	this.enter = function(callback) {
		//TODO: enter giveaway
	};
	
	this.fetch = function(callback) {
		//TODO: fetch giveaway html
	};
	
	this.leave = function(callback) {
		//TODO: leave giveaway
	};
	
}