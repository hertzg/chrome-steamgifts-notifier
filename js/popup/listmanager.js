var ListManager = function(listEl) {	
	var that = this;
	
	this.compareFn = function(){};
	
	var elList = [];
		idMap = {},
		sortMap = {};
	

	this.addObjRange = function(arr) {
		arr.forEach(function(obj){
			var box = BoxTemplate.render(obj);
			that.addBox(box);
		});
	};

	this.addBoxRange = function(arr, soft) {
		arr.forEach(function(box){
			that.addBox(box, soft);
		});
	};
	
	this.addBox = function(boxEl, soft) {
		var boxData = boxEl.data;
		
		if(!soft) {
			idMap[boxData.uid] = boxEl;
			elList.oush(]
		}
		
		listEl.appendChild(boxEl);
	};
	
	this.addBoxAt = function(idx, boxEl) {
		var el = listEl.childNodes[idx];
		that.addBoxBefore(el, boxEl);
	};

	this.addBoxFirst = function(boxEl) {
		that.addBoxBefore(listEl.firstChild, boxEl);
	};

	this.addBoxLast = function(boxEl) {
		that.addBoxBefore(listEl.lastChild, boxEl);
	};
	
	this.addBoxBefore = function(el, boxEl) {
		if(!el) throw 'el not found!';
		listEl.insertBefore(boxEl, el);
	};
	
	this.addBoxAfter = function(el, boxEl) {
		that.addBoxBefore(el.nextSibling, boxEl);
	};
	
	this.replaceBox = function(el, boxEl) {
		this.addBoxBefore(el, boxEl);
		this.removeBox(el);
	};
	
	this.removeBoxAt = function(idx) {
		var el = listEl.childNodes[idx];
		that.removeBox(el);
	};
	
	this.removeBox = function(boxEl, soft) {
		if(soft.constructor == Function) {
			delete idMap[boxEl.data.uid];
			$(boxEl).animate({
				opacity: 0
			}, 500, function(){
				listEl.removeChild(boxEl);
				soft();
			});
		} else {
			if(!soft) delete idMap[boxEl.data.uid];
			listEl.removeChild(boxEl);
		}
	};
	
	this.getIdMap = function() {
		return boxMap;
	};

	this.getBoxList = function() {
		var boxList = [];
		for(uid in boxMap) {
			if(boxMap.hasOwnProperty(uid)) {
				boxList.push(boxMap[uid]);
			}
		}
		return boxList;
	};

	//=== Other
	this.sort = function(compareFn, showFn) {
		var list = this.getBoxList();
		list.sort(compareFn);

		that.toggle(function(){
			this.empty();
			list.forEach(function(el){
				that.addBox(el, true);
			});
			return true;
		}, showFn, true);
	};
	
	this.runFilter = function(compareFn, showFn) {
		that.toggle(function(){
			var list = [], searchList = that.getBoxList();
			for (var i = 0; i < searchList.length; i++) {
				if(compareFn(searchList[i].data)) {
					list.push(searchList[i]);
				}
			};
			that.empty();
			that.addBoxRange(list, true);
			return true;
		}, showFn, true);
	};

	this.reset = function(afterShow) {
		//that.empty();
		that.hide(function(){
			that.addBoxRange(that.getBoxList(), true);
			that.show(afterShow);
		});

	};

	this.hide = function(cb) {
		if(listEl.classList.contains('hide')) return cb && cb();

		$(listEl).stop().animate({
			opacity: 0,
		}, 500, function(){
			listEl.classList.add('hide');
			cb && cb();
		});
	};

	this.show = function(cb) {
		if(!listEl.classList.contains('hide')) return cb && cb();
		listEl.style.opacity = 0;
		listEl.classList.remove('hide');
		$(listEl).stop().animate({
			opacity: 1,
		}, 500, function(){
			cb && cb();
		});
	};

	this.toggle = function(retoggleFn, afterRetoggle, startShown) {
		var isHidden = listEl.classList.contains('hide');
		function afterFirstToggle() {
			if(retoggleFn) {
				if(retoggleFn() === true) {
					if(!isHidden) {
						that.show(afterRetoggle);
					} else {
						that.hide(afterRetoggle);
					}
				}
			}
		}

		if(startShown) {
			this.show(function(){
				that.hide(afterFirstToggle);
			});
		} else {
			if(isHidden) {
				that.show(afterFirstToggle);
			} else {
				that.hide(afterFirstToggle);
			}
		}


	};

	this.empty = function() {
		that.clear(false);
	};

	this.clear = function(alterMap) {
		that.getBoxList().forEach(function(el){
			that.removeBox(el, !alterMap);
		});
	};
};