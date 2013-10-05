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
		this.uid = this.href.toLowerCase().replace(/^\/giveaway\/([^\/]*)\/.*$/, "$1");
		
		var hasNewSpan = !!els.titleDiv.has('span.new').length;
		this.isNew = hasNewSpan && els.titleDiv.find('span.new').text().toLowerCase().indexOf('new') != -1;
		
		this.isEntered = els.post.hasClass('fade');
		this.isContributorOnly = !!els.descriptionDiv.has('.contributor_only').length;
		this.isContributorGreen = !!els.descriptionDiv.has('.contributor_only.green').length;		
		this.isGroupOnly = !!els.descriptionDiv.has('.group_only').length;
		
		
		if(this.isContributorOnly) {
			this.contribUSD = parseFloat(els.descriptionDiv.find('.contributor_only').text().replace(/([^0-9\.]*)/g, ''));
		}

		this.isEnterable = null; //TODO: can we enter this giveaway? (with and without fetched giveaway)
		
		var descriptionText = els.descriptionDiv.text().trim().split("\n")[0].trim();
		this.isCommingSoon = (descriptionText.indexOf("begins") != -1);
		this.isClosed = (descriptionText.indexOf('Awaiting') != -1) || (descriptionText.toLowerCase().indexOf('congratulations') != -1);
		this.isOpen = (descriptionText.indexOf('Open for') != -1);
		
		this.isCommentable = null; //TODO: dunno how
		
		this.titleText = els.titleDiv.text().trim();
		
		var copiesMatch = this.titleText.toLowerCase().match(/\((.*)\s*copies\)/);
		var copiesNumber = "1";
		if(copiesMatch) {
			copiesNumber = copiesMatch[1].replace(/([^0-9*])/g, '');
		}
		
		this.copies = parseInt(copiesNumber);
		this.points = parseInt(this.titleText.replace(/.*\(([0-9]*)P\).*/i, "$1"));
		this.pirceUSD = null; //TODO: process after fetch !==========
		
		this.timeStartText = els.timeRemainingDiv.find('span strong').text().trim();
		this.timeEndText = els.timeRemainingDiv.children('strong').text().trim()
		
		this.timeStart = this.stringToMs(this.timeStartText);
		this.timeEnd = this.stringToMs(this.timeEndText);
		
		this.authorName = els.createdByAnchor.text().trim();
		this.authorHref = els.createdByAnchor.attr('href');
		
		var authorAvatarStyle = els.centerDiv.children('.avatar').attr('style');
		this.isPinned = !authorAvatarStyle;
		this.authorAvatar = authorAvatarStyle ? authorAvatarStyle.replace(/.*url\(([^\)]*)\).*/, "$1") : "img/no-image.png";
		
		this.entries = parseInt(els.entriesDiv.children('span').first().text().trim().replace(/([^0-9]*)/g, '')) || 0;
		this.comments = parseInt(els.entriesDiv.children('span').last().text().trim().replace(/([^0-9]*)/g, ''));
		
		this.appLogo = els.rightDiv.find('img').attr('data-src');
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
		
		var number = parseInt(str.replace(/([^0-9]*)/g, '').trim());
		if(!number) return res;
		
		var text = str.replace(/([0-9]*)/g, '').trim();
		
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