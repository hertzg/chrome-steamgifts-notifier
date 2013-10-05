var SortedMap = function(compareFunction){
	var that = this;

	this.compareFn = null;
	
	/*
	const IN_LEFT = -1;
	const IN_RIGHT = 1;
	const EQUAL = 0;*/

	var keys = [],
		vals = [];	

	function findKeyPos(key) {
		var pos = keys.indexOf(key);
		return pos != -1 ? pos : null;
	}

	/*function findNewPos(key, val) {
		var pLow = 0,
			pHigh = vals.length-1,
			pMid = null;

		while(pLow <= pHigh) {
			pMid = Math.floor((pLow+pHigh)/2);
			cmp = that.compareFn(vals[pMid], val);

			if(cmp == IN_LEFT || cmp == EQUAL) { pHigh = pMid -1;  continue; }
			if(cmp == IN_RIGHT) { pLow = pMid + 1; continue; }
		}
	}*/

	function makeObj(key, val, pos) {
		return {key:key, val:val, pos:pos};
	}

	this.onInsert = function(obj) {};
	this.onReplace = function(oldObj, newObj){};
	this.onRemove = function(obj){};
	this.onClear = function(objects){};

	this.put = function(key, val) {
		var pos = findKeyPos(key);
		if(pos == null) {
			vals.push(val);
			vals.sort(that.compareFn);
			var newPos = vals.indexOf(val);
			keys.splice(newPos, 0, key);
			this.onInsert(makeObj(key, val, newPos));
		} else {
			if(this.onReplace(makeObj(keys[pos], vals[pos], pos), makeObj(key, val, pos)) !== false) {
				keys[pos] = key;
				vals[pos] = val;
			}
		}
	};

	this.get = function(key) {
		var pos = findKeyPos(key);
		if(pos == null) return pos;
		return vals[pos];
	};

	this.remove = function(key) {
		var pos = findKeyPos(key);
		if(pos == null) return pos;

		if(this.onRemove(makeObj(key, vals[pos], pos)) !== false) {
			keys.splice(pos, 1);
			vals.splice(pos, 1);
		}
	};

	this.size = function(){
		return keys.length == vals.length ? keys.length : null;
	};

	this.init = function(compareFn) {
		this.compareFn = compareFn;
	};

	this.getRefs = function(){
		return {
			keys: keys,
			vals: vals
		};
	}

	this.init(compareFunction);
};