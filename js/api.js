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

	this.currentToken = null;
	
	this.xhr = new XMLHttpRequest();
	
	//== EVENTSs
	this.onStateChange = function(){};

	//== Methods
	this.init = function(){
		
	};

	this.parseUserInfo = function(html) {
		
		var safeHTML = this.replaceSrcs(html);
		
		this.currentToken = $('input[name="xsrf_token"]', safeHTML).last().attr('value').trim();
		var pointsEl = $('div.nav__right-container a > span.nav__points', safeHTML).last();
		var profileEl = $('div.nav__right-container  a[href^="/user/"]', safeHTML);
		
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

	this.enterGiveaway = function(uid, callback) {
		var data = new FormData();
		data.append('xsrf_token', this.currentToken)
		data.append('do', 'entry_insert')
		data.append('code', uid)
		this._post('https://www.steamgifts.com/ajax.php', data, true, function(responseText, code, statusText){
			callback(responseText, code, statusText)
		})
	}
	
	this.getGiveaways = function(status, page, callback){
		this._get('https://www.steamgifts.com/giveaways/search?page=' + encodeURIComponent(page), function(html, code, text){
			var safeHTML = that.replaceSrcs(html);
		
			var arr = that.processGiveaways(safeHTML);
			callback(arr, code, text);
		});
	};
	
	this.getUserInfo = function(){
		return {
			isAuthorized: this.isAuthorized,
			username: this.username,
			userHref: this.userHref,
			points: this.points,
			pointsDiff: this.pointsDiff
		};
	};
	
	this._get = function(url, callback) {
		this.lastUpdate = new Date().getTime();
		this.onStateChange(API.STATE_WORKING);
		
		this.xhr.open("GET", url,true);
		this.xhr.send();
		this.xhr.onreadystatechange = function() {
			if (that.xhr.readyState != 4)  { return; }
			
			that.parseUserInfo(that.xhr.responseText);
			that.onStateChange(API.STATE_IDLE);
			callback(that.xhr.responseText, that.xhr.status, that.xhr.statusText);
		};
	};

	this._post = function(url, formData, urlEncoded, callback) {
		var xhr = new XMLHttpRequest()
		xhr.open("POST", url, true);
		if(urlEncoded) {
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
			xhr.send(urlencodeFormData(formData))
		} else {
			xhr.send(formData);
		}
		xhr.onreadystatechange = function() {
			if (that.xhr.readyState != 4)  { return; }
			callback(that.xhr.responseText, that.xhr.status, that.xhr.statusText);
		};
	};
	
	this.processGiveaways = function(html) {
		var arr = [];
		$('.giveaway__row-outer-wrap', html).each(function(idx, item){
			arr.push(that.processGiveaway(item.outerHTML))
		});
		return arr;
	};
	
	this.processGiveaway = function(node) {
		var giveawayObject = new Giveaway();
		giveawayObject.init(node);
		return giveawayObject;
	};

}

function urlencodeFormData(fd){
	var s = '';
	function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
	for(var pair of fd.entries()){
		if(typeof pair[1]=='string'){
			s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
		}
	}
	return s;
}	