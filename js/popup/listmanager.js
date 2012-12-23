var ListManager = function(listEl, hashFunction, gifts) {	
	var that = this;


	var elMap = Object.create(null);
		sortedMap = new SortedMap(hashFunction);

	this.append = function(boxEl) {
		boxEl.classList.add('hidden');
		elMap[boxEl.data.uid] = boxEl;
		listEl.appendChild(boxEl);
		setTimeout(function(){
			boxEl.classList.remove('hidden');
		}, 50+Math.round(Math.random()*100));
	};

	this.inserBefore = function(el, boxEl) {
		boxEl.classList.add('hidden');
		elMap[boxEl.data.uid] = boxEl;
		listEl.insertBefore(boxEl, el);
		setTimeout(function(){
			boxEl.classList.remove('hidden');
		}, 50);
	};

	this.remove = function(boxEl) {
		boxEl.classList.add('hidden');
		delete elMap[boxEl.data.uid];
		setTimeout(function(){
			listEl.removeChild(boxEl);
		}, 500);
	};
	
	this.insertAt = function(idx, boxEl) {
		var el = listEl.childNodes[idx];
		that.inserBefore(el, boxEl);

	};

	this.insertFirst = function(boxEl) {
		that.inserBefore(listEl.firstChild, boxEl);
	};

	this.insertLast = function(boxEl) {
		that.inserBefore(listEl.lastChild, boxEl);
	};
	
	this.insertAfter = function(el, boxEl) {
		that.inserBefore(el.nextSibling, boxEl);
	};

	this.appendAll = function(arr) {
		arr.forEach(function(box){
			that.append(box);
		});
	};

	this.getById = function(id) {
		//return listEl.querySelector('#'+id);
		return document.getElementById(id);
	};

	this.getMap = function() {
		return sortedMap;
	};

	this.getElMap = function(){
		return elMap;
	};

	this.replace = function(el, boxEl) {
		this.inserBefore(el, boxEl);
		this.remove(el);
	};

	this.replaceSafe = function(el, boxEl) {
		var elPrevSibling = el.previousSibling;
		that.remove(el);

		if(!elPrevSibling) {
			that.insertFirst(boxEl);
		} else {
			that.insertAfter(elPrevSibling, boxEl);
		}
	};

	this.update = function(newObj) {
		var curEl = that.getById(newObj.uid);

		curEl.setFade(newObj.isEntered);
		curEl.getInfoDiv().setEntries(newObj.entries);
		curEl.getInfoDiv().setComments(newObj.comments);
		curEl.getInfoDiv().setTimeStart(newObj.timeStart, newObj.timeStartText);
		curEl.getInfoDiv().setTimeEnd(newObj.timeEnd, newObj.timeEndText);
	};
	
	this.removeAt = function(idx) {
		var el = listEl.childNodes[idx];
		that.remove(el);
	};

	this.empty = function(){
		while(listEl.childNodes.length) {
			delete elMap[listEl.lastChild.data.uid];
			listEl.removeChild(listEl.lastChild);
		}
	};

	this.clear = function() {
		sortedMap.clear();
	};

	gifts.forEach(function(gift){
		sortedMap.put(gift.uid, gift);
		elMap[gift.uid] = BoxTemplate.render(gift);
	});

	sortedMap.onInsert = function(newObj){
		var newEl = BoxTemplate.render(newObj.val);
		that.insertAt(newObj.pos, newEl);
	};

	sortedMap.onRemove = function(obj){
		that.remove(that.getById(obj.key));
	};

	sortedMap.onReplace = function(oldObj, newObj) {
		that.update(newObj.val);
	};

	sortedMap.onClear = function(obj) {
		that.empty();
	};

	sortedMap.forEach(function(key, val,  pos, hash){
		that.append(elMap[key]);
	});
};