function API() {
	var that = this;
	
	//== Constants
	API.STATE_WORKING = 'working';
	API.STATE_IDLE = 'idle';
	API.STATE_PROCESSING = 'processing';
	
	API.STATUS_NEW = 'new';
	API.STATUS_OPEN = 'open';
	API.STATUS_CLOSED = 'closed';
	API.STATUS_COMING_SOON = 'coming-soon';
	
	//== Fields
	this.state = 'idle';

	this.points = null;
	this.pointsDiff = null;
	
	this.username = null;
	this.userHref = null;
	
	this.isAlert = false;
	this.isNewAlert = false;
	this.lastAlertId = 0;
	this.lastAlertText = null;
	this.lastAlertHref = null;
	
	this.lastUpdate = null;
	this.isAuthorized = false;
	this.state = API.STATE_IDLE;
	
	this.xhr = new XMLHttpRequest();
	
	//== EVENTSs
	this.onStateChange = function(){};

	//== Methods
	this.init = function(){
		
	};
	
	this.parseUserInfo = function(html) {
		
		var safeHTML = this.replaceSrcs(html);
		
		var pointsEl = $('div#navigation ol li a:contains("Account")', safeHTML).last();
		var profileEl = $('div#navigation ol li a[href^="/user/"]', safeHTML);
		
		this.isAuthorized = pointsEl.length == 1;
		
		if(this.isAuthorized) {
			this.userHref = profileEl.attr("href");
			this.username = this.userHref.replace("/user/",  '');
		
		
			var newPoints = parseInt(pointsEl.text().trim().replace(/([^0-9]*)/g, ''));
			if(this.points != null) {
				this.pointsDiff = (newPoints - this.points);
			}
			
			var el = $('.alert', safeHTML);
			this.isAlert = !!el.length;
			if(this.isAlert) {
				var alertText = el.text().trim();
				var alertHref = el.find('a').attr('href');
				
				if(this.lastAlertText != alertText || this.lastAlertHref != alertHref) {
					this.isNewAlert = true;
					this.lastAlertId += 1;
					this.lastAlertText = alertText;
					this.lastAlertHref = alertHref;
				} else {
					this.isNewAlert = false;
				}
			} else {
				this.isNewAlert = false;
			}
			
			this.points = newPoints;
		}
		
	};
	
	this.replaceSrcs = function(input) {
		//dont load sources when css traversing
		return input.replace(/(src)="([^"]*)"/g, "data-src=\"$2\"");
	};
	
	this.getGiveaways = function(status, page, callback){
		this._get('http://www.steamgifts.com/'+status+'/page/'+page, function(html){
			var safeHTML = that.replaceSrcs(html);
		
			var arr = that.processGiveaways(safeHTML);
			callback(arr);
		});
	};
	

	
	this.getUserInfo = function(){
		return {
			isAuthorized: this.isAuthorized,
			username: this.username,
			usernameHref: this.usernameHref,
			points: this.points,
			pointsDiff: this.pointsDiff
		};
	};
	
	this._get = function(url, callback) {
		this.lastUpdate = new Date().getTime();
		this.onStateChange(API.STATE_WORKING);
		
		this.xhr.open("GET", url,true);
		this.xhr.send();
		this.xhr.onload = function(){			
			that.parseUserInfo(that.xhr.responseText);
			that.onStateChange(API.STATE_IDLE);
			callback(that.xhr.responseText);
		};
	};
	
	this.processGiveaways = function(html) {
		var arr = [];
		$('.post', html).each(function(idx, item){
			if($(item).children('.left').length > 0) {
				arr.push(that.processGiveaway(item.outerHTML));
			} else {
				$(item).children('div').each(function(idx, devPost) {
					arr.push(that.processGiveaway(devPost.outerHTML));
				})
			}
		});
		return arr;
	};
	
	this.processGiveaway = function(node) {
		var giveawayObject = new Giveaway();
		giveawayObject.init(node);
		return giveawayObject;
	};

}