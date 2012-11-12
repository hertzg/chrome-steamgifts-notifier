function Giveaway(obj) {
	var that = this;
	
	//== Constants
	// none yet
	
	//=== Fields
	this.uid = null;
	this.title = null;
	this.titleText = null;
	this.href = null;
	
	this.isNew 					= null;
	this.isPinned				= null;
	this.isEntered 				= null;
	this.isContributorOnly 		= null;
	this.isContributorGreen 	= null;
	this.isGroupOnly 			= null;
	this.isEnterable 			= null;
	this.isCommingSoon			= null;
	this.isClosed 				= null;
	this.isOpen					= null;
	this.isCommentable 			= null;
	this.isFetched 				= false;
	this.isProcessed  			= false;
	this.isFetchedProcessed 	= false;
	
	this.points = null;
	this.pirceUSD = null;
	
	this.timeStartText = null;
	this.timeStart = null;
	this.timeEndText = null;
	this.timeEnd = null;
	
	this.authorHref = null;
	this.authorName = null;
	this.authorAvatar = null;
	
	this.entries = null;
	this.comments = null;
	
	this.appLogo = null;
	
	this.description = null;
	
	this.steamId = null;
	this.steamLink = null;
	
	this.submitKey = null;
	this.enterText = null;
	
	//== Privates
	var postHTML = null;
	var fetchedHTML = null;
	
	var els = {
	};

	//== METHODS
	this.init = function(obj){
		var type = typeof obj;
		if(type = "string") { 
			//TODO: transfer to apropriate constructor
			this.initFromPost(obj);
		} else if(type == 'object' && obj != null && obj.constructor == Object) {
			this.initFromObject(obj);
		} else {
			throw "Incorrect variable passed to Giveaway::init()";
		}
	};
	
	this.initFromObject = function(obj) {
		for(k in obj) {
			if(obj.hasOwnProperty(k) && typeof this[k] != 'undefined') {
				this[k] = obj[k];
			}
		}
	};
	
	this.initFromPost = function(post) {
	
		/* == DOMTree = */
		/*				*/
		/*+	.post		*/	els.post = $(post);
		/*|				*/
		/*|-+ .left		*/		els.leftDiv = $('.left', els.post);
		/*| |			*/
		/*| |-+	.title	*/			els.titleDiv = $('.title', els.leftDiv);
		/*| | |			*/
		/*| | |- a		*/				els.titleAnchor = 	$('a', els.titleDiv);
		/*| | 			*/
		/*| |-+	.descr	*/			els.descriptionDiv = $('.description', els.leftDiv);
		/*| | |			*/
		/*| | |- .time	*/				els.timeRemainingDiv = $('.time_remaining', els.descriptionDiv);
		/*| | |- .crea	*/				els.createdByAnchor = $('.created_by a', els.descriptionDiv)
		/*|	|			*/
		/*| |-+ .entri  */			els.entriesDiv = $('.entries', els.leftDiv);
		/*|   |			*/
		/*|   |- span 1	*/				//entries
		/*|   |- span 2	*/				//comments
		/*|				*/
		/*|-+ .center	*/		els.centerDiv = $('.center', els.post);
		/*|				*/
		/*|-+ .right	*/		els.rightDiv = $('.right', els.post);
		
		this.title = els.titleAnchor.text();
		this.href = els.titleAnchor.attr("href");
		this.uid = this.href.replace(/^\/giveaway\/([^\/]*)\/.*$/i, "$1");
		
		this.isNew = !!$('.title', $('.post')[1]).has('span.new').length;
		
		this.isPinned = null; //TODO: pinned giveaways, developer giveaways and those kinds
		
		this.isEntered = els.post.hasClass('fade');
		this.isContributorOnly = !!els.descriptionDiv.has('.contributor_only').length;
		this.isContributorGreen = this.isContributorOnly && !!els.descriptionDiv.has('.contributor_only.green').length;
		this.isGroupOnly = els.descriptionDiv.has('.group_only').length;

		this.isEnterable = null; //TODO: can we enter this giveaway? (with and without fetched giveaway)
		
		var descriptionText = els.descriptionDiv.text().trim().split("\n")[0].trim();
		this.isCommingSoon = (descriptionText.indexOf("begins") != -1);
		this.isClosed = (descriptionText.indexOf('Awaiting') != -1) || (descriptionText.indexOf('Congratulations') != -1);
		this.isOpen = (descriptionText.indexOf('Open for') != -1);
			
		this.isCommentable = null; //TODO: dunno how
		
		this.titleText = els.titleDiv.text().trim();
		this.points = parseInt(this.titleText.replace(/.*\(([0-9]*)P\).*/i, "$1"));
		this.pirceUSD = null; //TODO: process after fetch !==========
		
		this.timeStartText = els.timeRemainingDiv.find('span strong').text().trim();
		this.timeEndText = els.timeRemainingDiv.children('strong').text().trim()
		
		this.timeStart = this.stringToMs(this.timeStartText);
		this.timeEnd = this.stringToMs(this.timeEndText);
			
		this.authorName = els.createdByAnchor.text().trim();
		this.authorHref = els.createdByAnchor.attr('href');
		this.authorAvatar = els.centerDiv.children('.avatar').attr('style').replace(/.*url\(([^\)]*)\).*/i, "$1");
		
		this.entries = parseInt(els.entriesDiv.children('span').first().text().trim().replace(/([^0-9]*)/i, ''));
		this.comments = parseInt(els.entriesDiv.children('span').last().text().trim().replace(/([^0-9]*)/i, ''));
		
		this.appLogo = els.rightDiv.find('img').attr('src');
		
		this.isProcessed = true;
	};
	
	this.initFromGiveaway = function(){
		//TODO: parse giveaway page
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
	
	this.stringToMs = function(str) {
		var str = str.toLowerCase();
		var x = {  //Not great but I'm out of tea :(
			second: 1000, 
			minute: 60000, // 60 * 1000
			hour: 3600000, // 60 * 60 * 1000
			day: 86400000, // 24 * 60 * 60 * 1000
			week: 604800000, // 7 * 24 * 60 * 60 * 1000
			month: 2419200000 // 4 * 7 * 24 * 60 * 60 * 1000
		};
		
		var res = NaN;
		
		var number = parseInt(str.replace(/([^0-9]*)/, '').trim());
		if(!number) return res; //GTFO! No Digits found
		
		var text = str.replace(/([0-9]*)/, '').trim();
		
		for(j in x) {
			if(x.hasOwnProperty(j)) {
				var val = x[j];
				if(text.indexOf(j) !=-1) {
					res = number * val;
					break;
				}
			}
		}
		
		return res ? res : number;
	};
	
	this.toObject = function() {
		var obj = {};
		for(key in this) {
			if(this.hasOwnProperty(key) && typeof this[key] != 'function') {
				obj[key] = this[key];
			}
		}
		return obj;
	};
	
	
	//== Constructor
	if(obj) {
		this.init(obj);
	}
};

Giveaway.fromObject = function(obj){
	var instance = new Giveaway();
	instance.initFromObject(obj);
	return instance;
};