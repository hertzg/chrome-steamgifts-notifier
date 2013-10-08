var SortedMap = function(compareFunction){
	var that = this;

	this.compareFn = null;

	var keys = [],
		vals = [];	

	function findKeyPos(key) {
		var pos = keys.indexOf(key);
		return pos !== -1 ? pos : null;
	}


	function makeObj(key, val, pos) {
		return {key:key, val:val, pos:pos};
	}

	this.onInsert = function(obj) {};
	this.onReplace = function(oldObj, newObj){};
	this.onRemove = function(obj){};
	
	this.reSort = function(compareFn) {
		this.compareFn = compareFn
		var sortedVals = vals.slice()
		sortedVals.sort(compareFn);
		var that = this;
		sortedVals.forEach(function(v, i){
			that.put(keys[i], v);
		});
		delete sortedVals;
	};

	this.put = function(key, val) {
		var pos = findKeyPos(key);
		if(pos == null) {
			vals.push(val);
			vals.sort(that.compareFn);
			keys = []
			var newPos
			vals.forEach(function(v, i){
				if(val == v) newPos = i;
				keys.push(v.uid);
			});
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
	
	this.clear = function() {
		keys = [];
		vals = [];
	}

	this.getRefs = function(){
		return {
			keys: keys,
			vals: vals
		};
	}

	this.init(compareFunction);
};