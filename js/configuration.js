(function(){
	function clone(obj, deep) {
		return $.extend(!!deep, {}, obj);
	}
		
	function Config(userDefaults){	
		//== Constants
		//none
	
		//== Fields
		this._key = '__config__';
		this._data = {};
		this.defaults = {
			checkInterval: 180000, //3 min
			lastUpdate: 0,
			ticks: 0,
			posts: []
		};
		
		//== Methods
		this.init = function(){
			
			if(!localStorage[this._key]) {
				this.initDefaults();
			} else {
				this.initStorage();
			}
			
			if(!this._data) {
				this.initDefaults();
			}
		};
		
		this.initDefaults = function() {
			this.write(this.defaults);
			this.load(clone(this.defaults));
		};
		
		this.initStorage = function() {
			this.load();
		};
		
		this.get = function(key) {
			return this._data[key];
		}
		
		this.set = function(key, val) {
			if(key) {
				this._data[key] = val;
			}
			this.save();
			
			return this;
		}
		
		this.load = function(object) {
			loaded = true;
			var object = object ? object : this.read();
			this._data = object;
			return this;
		}
		
		this.save = function(object) {
			var object = object ? object : this._data;
			this.write(object);
			return this;
		}
		
		this.read = function() {
			return JSON.parse(localStorage[this._key]);
		}
		
		this.write = function(data) {
			localStorage[this._key] = JSON.stringify(data);
		}
		
		//== Constructor
		this.init();	
	}

	var instance = null;
	Config.instance = function(){
		if(!instance) {
			instance = new Config();
		}
		return instance;
	}
	
	function _Config(object) {
	
		var protectedKeys = ['__makeObject', 'defaults', 'reset', 'save', 'set', 'get', 'getRef', 'load'];
		var newObjectLength = 0;
		var loaded = false;
		
		
		//Updates and saves
		this.get = function(){
			return Config.instance().get.apply(Config.instance(), $.makeArray(arguments)); 
		};
		
		this.set = function(){
			Config.instance().set.apply(Config.instance(), $.makeArray(arguments)); 
			return this; 
		};
		
		this.save = function(andReset) {
			var args;
			
			if(loaded) {
				args = [this.__makeObject()];
			} else {
				args = $.makeArray(arguments);
			}
			
			Config.instance().save.apply(Config.instance(), args); 
			
			return andReset ? this.reset() : this; 
		};
		
		this.getRef = function() {
			return Config.instance()._data; 
		};
		
		this.defaults = function() {
			Config.instance().initDefaults(); 
			return this; 
		};
		
		this.load = function(forceReload) {
			var raw;
			if(forceReload || !loaded) { 
				raw = clone(this.getRef(), true);			
			}
			
			loaded = true;
			
			for(key in raw) {
				if(raw.hasOwnProperty(key) && protectedKeys.indexOf(key) == -1) {
					this[key] = raw[key];
				}
			}
		
			return this;
		};
		
		this.reset = function() {
			return window.Config = new _Config();
		};
		
		this.__makeObject = function(nullIfEmpty) {
			var newObj = {};
			var length = 0;
			for(k in this) {
				if(this.hasOwnProperty(k) && protectedKeys.indexOf(k) == -1) {
					length++;
					newObj[k] = this[k];
				}
			}
			
			if(nullIfEmpty) {
				return length ? newObj : null;
			}
			
			return newObj;
		}
	}
	
	
	window.Config = new _Config();
})();