(function(){	
	window.Config = new (function(){
		this._key = '__config__';
		this.defaults = {
			checkInterval: 180000, //3 min
			signature: 'v1.1.0.10',
		};
		
	
		this.get = function(key) {
			var val = localStorage.getItem(key);
			
			if(val == null) {
				val = this.defaults[key];
			} else {
				if(val[0] == '{' || val[0] == '[') {
					val = JSON.parse(val);
				}
			}
			return val;
		}
		
		this.set = function(key, val) {
			if (!key) {return;}

			if ( typeof val == "object") {
			  val = JSON.stringify(val);
			}
			
			localStorage.setItem(key, val);
		}
	})();
})();