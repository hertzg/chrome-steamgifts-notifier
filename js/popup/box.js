var BoxTemplate;
(function(){
	BoxTemplate = new (function(){
		function shortenNumber(n) {
			if(!n) {
				return n;
			}
			
			if(n > 0 && n < 1) {
				return ((Math.round(n*100)/100)+'').substr(1);
			}
			

			if(n < 1000) {
				return (Math.round(n*100)/100)+'';
			}
			
			var k = n /1000;
			if(k < 1000) {
				return (Math.round(k*100)/100)+'k';
			} else {
				return (Math.round((k/1000)*100)/100)+'M';
			}	
		}
		
		function shortenTimeText(text) {
			if(!text) return text;
		
			var map = {
				" seconds": 's',
				" second": 's',
				" minutes": 'm',
				" minute": 'm',
				" hours": 'h',
				" hour": 'h',
				" days": 'd',
				" day": 'd',
				" weeks": 'w',
				" week": 'w',
				" months": 'm',
				" month": 'm',
			};
			
			for(key in map) {
				if(map.hasOwnProperty(key)) {
					text = text.replace(key, map[key]);
				}
			}
			
			return text;
		}
	
	
		this.renderTitle = function(obj) {
		
			//div class='title'
			var titleDiv = document.createElement('div');
			titleDiv.className = 'title';
			
			//img src=img/enter.png
			if(obj.isEntered) {
				var enterImg = document.createElement('img');
				enterImg.src = 'img/enter.png';
				
				titleDiv.appendChild(enterImg);
			}
			
			
			//h1 title=obj.title innerHtml = obj.title
			var h1Title = document.createElement('h1');
			h1Title.title = obj.title;
			h1Title.innerHTML = obj.title;
			
			titleDiv.appendChild(h1Title);
			
			
			//div class=info
			var infoDiv = document.createElement('div');
			infoDiv.className = 'info';
			
			if(obj.isNew) {
				//img src=img/new.png
				var newImg = document.createElement('img');
				newImg.src = "img/new.png";
				
				infoDiv.appendChild(newImg);
			}
			
			if(obj.isPinned) {
				//img src=img/pinned.png
				var pinnedImg = document.createElement('img');
				pinnedImg.src = 'img/pinned.png';
				
				infoDiv.appendChild(pinnedImg);
			}
			
			if(obj.isGroup) {
				//img src=img/group.png
				var groupImg = document.createElement('img');
				groupImg.src = 'img/group.png';
				
				infoDiv.appendChild(groupImg);
			}
			
			titleDiv.appendChild(infoDiv);
			
			return titleDiv;
		};
		
		this.renderInfo = function(obj) {
		
			var infoDiv = document.createElement('div');
			infoDiv.className = 'info';
			
			var infoTable = document.createElement('table');
			
			var infoTr = document.createElement('tr');
			
			var iconTd = document.createElement('td');
			iconTd.className = 'td-icon';
			
			var iconImg = document.createElement('img');
			
			
			var tr1 = infoTr.cloneNode();
			var tr2 = infoTr.cloneNode();
			var tr3 = infoTr;
			
			
			var copiesIconTd = iconTd.cloneNode();
			var copiesIconImg = iconImg.cloneNode();
			copiesIconImg.src = 'img/copies.png';
			copiesIconTd.appendChild(copiesIconImg);
			var copiesValueTd = document.createElement('td');
			copiesValueTd.innerText = shortenNumber(obj.copies);
			

			var entriesIconTd = iconTd.cloneNode();
			var entriesIconImg = iconImg.cloneNode();
			entriesIconImg.src = 'img/entries.png';
			entriesIconTd.appendChild(entriesIconImg);
			var entriesValueTd = document.createElement('td');
			entriesValueTd.innerText = shortenNumber(obj.entries);
			
			
			var winChanceIconTd = iconTd.cloneNode();
			var winChanceIconImg = iconImg.cloneNode();
			winChanceIconImg.src = 'img/gold.png';
			winChanceIconTd.appendChild(winChanceIconImg);
			var winChanceValueTd = document.createElement('td');
			winChanceValueTd.innerText = (Math.round(obj.winChance*10000)/100)+'%';
			
			
			tr1.appendChild(copiesIconTd);
			tr1.appendChild(copiesValueTd);
			
			tr1.appendChild(entriesIconTd);
			tr1.appendChild(entriesValueTd);
			
			tr1.appendChild(winChanceIconTd);
			tr1.appendChild(winChanceValueTd);
			
			infoTable.appendChild(tr1);
			
			
			
			
			var pointsIconTd = iconTd.cloneNode();
			var pointsIconImg = iconImg.cloneNode();
			pointsIconImg.src = 'img/points.png';
			pointsIconTd.appendChild(pointsIconImg);
			var pointsValueTd = document.createElement('td');
			pointsValueTd.innerText = shortenNumber(obj.points);
			
			var commentsIconTd = iconTd.cloneNode();
			var commentsIconImg = iconImg.cloneNode();
			commentsIconImg.src = 'img/comments.png';
			commentsIconTd.appendChild(commentsIconImg);
			var commentsValueTd = document.createElement('td');
			commentsValueTd.innerText = shortenNumber(obj.comments);
			
			var contributorIconTd = iconTd.cloneNode();
			var contributorIconImg = iconImg.cloneNode();
			
			if(obj.isContributorOnly && !obj.isContributorGreen) {
				contributorIconImg.src = 'img/contributor-red.png';
			} else {
				contributorIconImg.src = 'img/contributor.png';
			}			
			contributorIconTd.appendChild(contributorIconImg);
			var contributorValueTd = document.createElement('td');
			
			var usd = shortenNumber(obj.contribUSD);
			if(usd) {
				usd = '$'+usd;
			} else {
				usd = 'Free';
			}
			contributorValueTd.innerText = usd;
			
			
			tr2.appendChild(pointsIconTd);
			tr2.appendChild(pointsValueTd);
			
			tr2.appendChild(commentsIconTd);
			tr2.appendChild(commentsValueTd);
			
			tr2.appendChild(contributorIconTd);
			tr2.appendChild(contributorValueTd);
			
			infoTable.appendChild(tr2);
			
			
			
			var timestartedIconTd = iconTd.cloneNode();
			var timestartedIconImg = iconImg.cloneNode();
			timestartedIconImg.src = 'img/timestarted.png';
			timestartedIconTd.appendChild(timestartedIconImg);
			var timestartedValueTd = document.createElement('td');
			timestartedValueTd.innerText = obj.timeStartText;
			
			var timeleftIconTd = iconTd.cloneNode();
			var timeleftIconImg = iconImg.cloneNode();
			timeleftIconImg.src = 'img/timeleft.png';
			timeleftIconTd.appendChild(timeleftIconImg);
			var timeleftValueTd = document.createElement('td');
			timeleftValueTd.innerText = obj.timeEndText;
			
			var authorIconTd = iconTd.cloneNode();
			var authorIconImg = iconImg.cloneNode();
			authorIconImg.src = 'img/author.png';
			authorIconTd.appendChild(authorIconImg);
			var authorValueTd = document.createElement('td');
			var authorLink = document.createElement('a');
			authorLink.href = 'http://www.steamgifts.com/'+obj.authorHref+'';
			authorLink.target = '_blank';
			authorLink.title = obj.authorName;
			authorLink.innerText = obj.authorName;
			authorValueTd.appendChild(authorLink);
			
			
			tr3.appendChild(timestartedIconTd);
			tr3.appendChild(timestartedValueTd);
			
			tr3.appendChild(timeleftIconTd);
			tr3.appendChild(timeleftValueTd);
			
			tr3.appendChild(authorIconTd);
			tr3.appendChild(authorValueTd);
			
			infoTable.appendChild(tr3);	
						
			infoDiv.appendChild(infoTable);
			
			return infoDiv;
		};
	
		this.render = function(obj){
		
			var boxDiv = document.createElement('div');
			boxDiv.classList.add('box');
			
			if(obj.winChance < 0.01) {
				boxDiv.classList.add("red");
			} else if(0.01 <= obj.winChance && obj.winChance < 0.10) {
				boxDiv.classList.add("yellow");
			} else if(obj.winChance >= 0.10) {
				boxDiv.classList.add("green");
			} else {
				boxDiv.classList.add("blue");
			}
			
			if(obj.isEntered) {
				boxDiv.classList.add('fade');
			}
			
			boxDiv.addEventListener('click', function(){
				window.open('http://www.steamgifts.com'+obj.href);
			});
			
			
			var descDiv = document.createElement('div');
			descDiv.className = 'desc';
			
			var logoDiv = document.createElement('div');
			logoDiv.className = "logo";
			logoDiv.style.backgroundImage = 'url('+obj.appLogo+')';
			
			boxDiv.appendChild(this.renderTitle(obj));
			
			descDiv.appendChild(logoDiv);
			descDiv.appendChild(this.renderInfo(obj));
			
			var actionsDiv = document.createElement('div');
			actionsDiv.className = 'actions';
			
			var commentImg = document.createElement('img');
			commentImg.src = 'img/comment_add.png';
			
			var enterImg = document.createElement('img');
			enterImg.src = 'img/enter.png';
			
			
			var commentAndEnterLink = document.createElement('div');
			commentAndEnterLink.className = 'button';
			commentAndEnterLink.title="Comment and Enter";
			commentAndEnterLink.addEventListener('click', function(e){
				console.log('comment and enter giveaway #'+obj.href, arguments);
				e.stopPropagation();
				return false;
			});
			
			commentAndEnterLink.appendChild(commentImg.cloneNode());
			commentAndEnterLink.appendChild(document.createTextNode(" & "));
			commentAndEnterLink.appendChild(enterImg.cloneNode());
			
			var enterLink = document.createElement('div');
			enterLink.className = 'button';
			enterLink.title="Enter";
			enterLink.addEventListener('click', function(e){
				console.log('enter giveaway #'+obj.href, arguments);
				e.stopPropagation();
				return false;
			});
			enterLink.appendChild(enterImg.cloneNode());
			
			
			var commentLink = document.createElement('div');
			commentLink.className = 'button';
			commentLink.title="Comment";
			commentLink.addEventListener('click', function(e){
				console.log('comment giveaway #'+obj.href, arguments);
				e.stopPropagation();
				return false;
			});
			commentLink.appendChild(commentImg.cloneNode());
			
			actionsDiv.appendChild(commentAndEnterLink);
			actionsDiv.appendChild(enterLink);
			actionsDiv.appendChild(commentLink);
			
			
			var clearDiv = document.createElement('div');
			clearDiv.className = 'clear';
			
			descDiv.appendChild(actionsDiv);
			descDiv.appendChild(clearDiv);
			
			boxDiv.appendChild(descDiv);
							
			return boxDiv;
		};
	})();
})()