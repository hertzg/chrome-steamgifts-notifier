var SortedArray = function(){
	
	var keys = [],
		vals = [],
		hashes = [];
		
	var hashFn;
	
	function calculateHash(val) {
		return hashFn(val);
	}
	
	function calculatePosition(hash) {
		var pos = null;
		for(var i=0; i<hashes.length; i++) {
			if(hashes[i] >= hash) { //Then this new item needs to be before that position
				pos = i;
				break;
			}
		}
		if(!pos) return hashes.length;
		return pos-1;
	};
		
	this.add = function(key, val){
		var hash = calculateHash(val);
		var newPos = calculatePosition(hash);
		
		hashes.splice(newPos, 0, hash);
		keys.splice(newPos, 0,  key);
		vals.splice(newPos, 0,  val);
		return newPos;
	};
	
	this.remove = function(key) {
		var pos = keys.indexOf(key);
		if(pos == -1) return pos;
		
		hashes.splice(pos, 1);
		keys.splice(pos, 1);
		vals.splice(pos, 1);
		
		return pos;
	};
	
	this.forEach = function(fn) {
		for(var i=0; i<hashes.length; i++) {
			if(fn(keys[i], vals[i], i, hashes[i]) === false) {
				break;
			}
		}
	};
	
	this.swap = function(oldPos, newPos) {
		keys[oldPos] = keys.splice(oldPos, 1, keys[newPos])[0];
		vals[oldPos] = vals.splice(oldPos, 1, vals[newPos])[0];
		hashes[oldPos] = hashes.splice(oldPos, 1, hashes[newPos])[0];
	};
	
	this.clear = function() {
		keys = [];
		hashes = [];
		values = [];
	};
	
	this.setHashFn = function(fn) {
		var that = this;
		this.forEach(function(key, val, pos, hash){
			
		});
	};
};