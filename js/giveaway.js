function Giveaway(obj) {
	var that = this;
	
	//== Constants
	// none yet
	
	//=== Fields
	this.uid = null;
	this.title = null;
	this.titleText = null;
	this.href = null;
	
	this.copies = null;
	
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
	this.contribUSD = null;
	
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
	
	this.winChance = null;
	
	//== Privates
	var postHTML = null;
	var fetchedHTML = null;
	
	var els = {
	};

	//== METHODS
	this.init = function(obj){
		var type = typeof obj;
		if(type == "string") { 
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
		
		els.post = $(post);		
		els.titleAnchor = 	els.post.find('a.giveaway__heading__name');
		
		this.title = els.titleAnchor.text();
		this.href = els.titleAnchor.attr("href");
		this.uid = this.href.replace(/^\/giveaway\/([^\/]*)\/.*$/i, "$1");
		
		//var hasNewSpan = !!els.titleDiv.has('span.new').length;
		this.isNew = false
		
		this.isEntered = els.post.find('.giveaway__row-inner-wrap').hasClass('is-faded')
		this.isContributorOnly = false;
		this.isContributorGreen = false;		
		this.isGroupOnly = false;
		
		
		if(this.isContributorOnly) {
			this.contribUSD = parseFloat(els.descriptionDiv.find('.contributor_only').text().replace(/([^0-9\.]*)/g, ''));
		}

		this.isEnterable = null; //TODO: can we enter this giveaway? (with and without fetched giveaway)
		
		this.isCommingSoon = false;
		this.isClosed = false;
		this.isOpen = true;
		
		this.isCommentable = null; //TODO: dunno how
		
		this.titleText = els.post.find('.giveaway__heading').text().trim();
		
		var copiesMatch = this.titleText.match(/\((.*)\s*copies\)/i);
		var copiesNumber = "1";
		if(copiesMatch) {
			copiesNumber = copiesMatch[1].replace(/([^0-9*])/g, '');
		}
		
		this.copies = parseInt(copiesNumber);
		this.points = parseInt(this.titleText.replace(/.*\(([0-9]*)P\).*/i, "$1"));
		this.pirceUSD = null; //TODO: process after fetch !==========
		
		this.timeStartText = els.post.find('div.giveaway__columns > div.giveaway__column--width-fill.text-right > span').text().trim();
		this.timeEndText = els.post.find('div.giveaway__columns > div:nth-child(1) > span').text().trim();
		
		this.timeStart = parseInt(els.post.find('div.giveaway__columns > div.giveaway__column--width-fill.text-right > span').attr('data-timestamp'));
		this.timeEnd = parseInt(els.post.find('.giveaway__columns > div > span[data-timestamp]').attr('data-timestamp'));
		
		this.authorName = els.post.find('.giveaway__username').text().trim();
		this.authorHref = els.post.find('.giveaway__username').attr('href');
		
		var authorAvatarStyle = els.post.find('a.global__image-outer-wrap.global__image-outer-wrap--avatar-small > div').attr('style');
		this.isPinned = false;
		this.authorAvatar = authorAvatarStyle ? authorAvatarStyle.replace(/.*url\(([^\)]*)\).*/, "$1") : "img/no-image.png";
		
		this.entries = parseInt(els.post.find('div.giveaway__links > a:nth-child(1) > span').text().trim().replace(/([^0-9]*)/g, '')) || 0;
		this.comments = parseInt(els.post.find('div.giveaway__links > a:nth-child(2) > span').text().trim().replace(/([^0-9]*)/g, ''));
		
		this.appLogo = els.post.find('a.global__image-outer-wrap.global__image-outer-wrap--game-medium > div').attr('style').replace(/.*url\(([^\)]*)\).*/, "$1")
		if(this.appLogo.indexOf('://') == -1) {
			this.appLogo = 'http://www.steamgifts.com'+this.appLogo;
		}
		
		this.winChance = ((this.copies||1) / (this.entries + (this.isEntered ? -1 : 1)));
		if(this.winChance > 1) {
			this.winChance = 1;
		}
		
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
	
	this.equals = function(gift) {
		if(gift.uid && this.uid) {
			return gift.uid == this.uid;
		}
		return false;
	};
	
	this.hasChanged = function(gift) {
		var keys = ['timeStart',  'timeEnd', 'entries', 'comments', 'isEntered'];
		for(var i=0; i<keys.length; i++) {
			if(this[keys[i]] != gift[keys[i]])
				return true;
		};
		return false;
	};
	
	this.toObject = function() {
		var obj = Object.create(null);
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

Giveaway.equals = function(obj1, obj2) {
	if(obj1.equals) return obj1.equals(obj2);
	if(obj2.equals) return obj2.equals(obj1);
	var instance = Giveaway.fromObject(obj1);
	return instance.equals(obj2);
}

Giveaway.hashChanged = function(obj1, obj2) {
	if(obj1.hashChanged) return obj1.hashChanged(obj2);
	if(obj2.hashChanged) return obj2.hashChanged(obj1);
	var instance = Giveaway.fromObject(obj1);
	return instance.hashChanged(obj2);
}