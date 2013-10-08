var ListManager = function(listEl, compareFn, gifts) {
	var that = this;

	var elMap = Object.create(null);
		sortedMap = new SortedMap(compareFn);

	this.append = function(boxEl) {
		boxEl.classList.add('hidden');
		elMap[boxEl.data.uid] = boxEl;
		listEl.appendChild(boxEl);
		setTimeout(function(){
			boxEl.classList.remove('hidden');
		}, 50+Math.round(Math.random()*100));
	};

	this.insertBefore = function(el, boxEl) {
		boxEl.classList.add('hidden');
		elMap[boxEl.data.uid] = boxEl;
		listEl.insertBefore(boxEl, el);
		setTimeout(function(){
			boxEl.classList.remove('hidden');
		}, 50);
	};

	this.remove = function(boxEl, cb) {
		boxEl.classList.add('hidden');
		setTimeout(function(){
			if(cb && cb() !== false) {
				listEl.removeChild(boxEl);
				delete elMap[boxEl.data.uid];
			}
		}, 600);
	};
	
	this.insertAt = function(idx, boxEl) {
		var el = listEl.childNodes[idx];
		that.insertBefore(el, boxEl);

	};

	this.insertFirst = function(boxEl) {
		that.insertBefore(listEl.firstChild, boxEl);
	};

	this.insertLast = function(boxEl) {
		that.insertBefore(listEl.lastChild, boxEl);
	};
	
	this.insertAfter = function(el, boxEl) {
		that.insertBefore(el.nextSibling, boxEl);
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
		this.insertBefore(el, boxEl);
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
	
	this.replace = function(oldObj, newObj) {
		var oldEl = that.getById(oldObj.uid),
			newEl;
		
		if(oldEl) {
			newEl = that.getById(newObj.uid);
			if(!newEl) {
				newEl = BoxTemplate.render(newObj);
				that.insertBefore(oldEl, newEl);
				that.remove(oldEl);
			} else {
				var oldElNextSibling = oldEl.nextSibling,
					newElNextSibling
				
				if(oldElNextSibling == newEl) {
					oldElNextSibling = newEl.nextSibling
					that.remove(oldEl, function(){
						oldElNextSibling = oldElNextSibling || listEl.lastChild
						that.insertBefore(oldElNextSibling, newEl);
					});
				} else {
					that.remove(oldEl, function(){
						oldElNextSibling = oldElNextSibling || listEl.lastChild
						newElNextSibling = newEl.nextSibling
						that.remove(newEl, function() {
							newElNextSibling = newElNextSibling || listEl.lastChild
							that.insertBefore(oldElNextSibling, newEl);
							that.insertBefore(newElNextSibling, oldEl);
							return false;
						})
						return false
					})
				}
			}
		}
	}
	
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
		that.append(elMap[gift.uid]);
	});

	sortedMap.onInsert = function(newObj){
		var newEl = BoxTemplate.render(newObj.val);
		console.log("+", newObj.pos, newObj.val.winChance, newObj, newEl);
		that.insertAt(newObj.pos, newEl);
	};

	sortedMap.onRemove = function(obj){
		that.remove(that.getById(obj.key));
	};

	sortedMap.onReplace = function(oldObj, newObj) {
		that.replace(oldObj.val, newObj.val);
	};

	sortedMap.onClear = function(obj) {
		that.empty();
	};
};