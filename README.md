This is an extension for Google Chrome browser for SteamGifts.com website.
More interesting things are on <a href="https://github.com/hertzg/chrome-steamgifts-notifier/tree/dev">dev branch</a> ;)

## Instalation
Simple as [click here to Install from Google Chrome Store (Free)](https://chrome.google.com/webstore/detail/steamgifts-notifier/ddgkcikkmofaghjdchkffadpmeijmcen)
<p align="center">
  <a title="Install from Google Store" alt="Install from Google Store" href="https://chrome.google.com/webstore/detail/steamgifts-notifier/ddgkcikkmofaghjdchkffadpmeijmcen"><img src="http://cdn.appstorm.net/web.appstorm.net/files/2010/12/Chrome-Store.png" /></a>
</p>

## Screenshot
<p align="center">
  <a href="https://chrome.google.com/webstore/detail/steamgifts-notifier/ddgkcikkmofaghjdchkffadpmeijmcen"><img title="SteamGifts Notifier v1.2" alt="SteamGifts Notifier v1.2" src="https://lh4.googleusercontent.com/gkpnv7pY-r1nd8RZUjrTRXWDeZa-eNgJsmXJ4_BFjLMmy-wxDUCWUk7xJd9HRYxkNieb0Xs7=s640-h400-e365-rw" /></a>
</p>


## Changelog

### v 1.2
- Moving from jQuery to native JS
- Moved from $.get to  native XHR request (oh jQuery, appears that u suck too)
- Temporal fix for images loading when initializing jquery object on html (seems so)
- Moving to long lived connections for extension interop
- Some more partial imporvements
- Improved Winning odds calculation (Now counts copies)
- Configuration resets with version change
- Added contributor ammount parsing
- Fixed search clear button glitch
- Fixed pinneed and new icon glitches
- Implemented Number shortener (eg: 1000 -> 1k)
- Redisigned a bit to cleanup some space for new changes ;)
- Moving to chrome extension messaging for "IPC" (50% Done)
- Giveaway can now be compared using equals method
- Implemented status broadcasting
- Implemented gift rendering via new IPC
- Implemented loading overlay
- Fixed userHref being undefined
- Added Spacer rendering feature to BoxTemplate
- Made page update dynamically (need to figure out sorting)
- Implmented Icon badge animation
- Replaced Spacer with box margin bottom (why didnt i thing about that earlier)
- Implemented ListManager (nice animations and great features)
- Smoothed out a lot
- Added Port manager to support multiple connections
- Refactored Background page
- getGiveaways now also informs about http status and text
- Removed interop port
- Parses steamgifts only when at least one client is present (additional feature) 
- Fixed winChance calculation again :/
- Fixed hasChanged method
- Improved Giveaway.toObject function
- Added Giveaway generic methods
- Added after render update functionality to BoxTemplate
- Improved ListManager with better performace and animations (removed jquery animations)
- Moved to hasher logic the items are inserted to their respective locations as of hasher (Not resorted after each update)
- The Giveaways are dynamicaly updated when changes are updated (needs animation)
- Points diff moved to css animation (needs css clases)
- Giveaways are removed as they expire

------

### v 1.1.0.9 - 16.11.2012
- Added Winning chance icon
- Improved Giveaway Parsing
- Improved Closed giveaway detection
- Improved Copies parsing
- Improved Author avatar parsing
- Fixed coloring issue

### v 1.1.0.8 - 16.11.2012
- Added Sorting feature (Yay!)
- New Design (Important party :( )
- Removed Scrollbar to free up some more space
- Implemented/Fixed Pinned giveaway parsing
- Fixed Configuration Manger issues with defaults
- Fixed new giveaway detection
- Fixed copies parsing
- Improved entries and comments parsing
- Tons of improvements...

### v 1.1.0.7 - 15.11.2012
- Fixed [#9](https://github.com/hertzg/chrome-steamgifts-notifier/issues/9)
- Fixed [#10](https://github.com/hertzg/chrome-steamgifts-notifier/issues/10)
- Implemented [#7](https://github.com/hertzg/chrome-steamgifts-notifier/issues/7)
- Fixed [#12](https://github.com/hertzg/chrome-steamgifts-notifier/issues/12)

### v 1.1.0.6b - 14.11.2012
- Added copies parsing #4
- Added configuration manager class #7
- Fixed points being null when not logged into steamgifts #5

### v1.1.0.5b - 13.11.2012
- Fixed Issue #2

### v1.1.0.4b - 12.11.2012
- Fixed entries & comments parsing
- Added loading indicator
- Fixed issue with page not being updated on manual reload
- Reduced check interval to 2 minutes
- Imlemented onStateChange event to API
- Deals shown are sorted by highest winning chance and lowest time remaining
- Cleaned up code a bit more
- Added author Avatar and name
- Added search (filter) functionality
- Fixed Steamgifts link opening in _self
- *Added Alert notification!*
- Added point difference indicator (when changed)

### v1.1.0.3b - 12.11.2012
- Minor bugfixes

### v1.1.0.2b - 12.11.2012
- Moved to more clean way of crawling and displaying giveaways
- Improved simple chance calculation
- Crawler Logic Rewritten 
- Added API objct
- Added Giveaway Object
- Improved parsing mechanism (beta)
- Fixed scrolling issue
- New Design
- Added trail date parsing function
- Refactoring (70% Done)

### v1.1.0.1a - 12.11.2012
- Updated jQuery Mobile to latest final release v1.2.0
- Updated jQuery Library to latest version
- SteamGifts api (Non official parsing html)
- Migrating to "OO style"
- REFACTORING.... (Hell yeah!)

### v1.1.0 - 11.11.2012
- Forked from Original sorce
- Made working with new security policy
- Migrated to manifest version 2
- Added very simple chance calculation
- Fixed the Points overflow bug

------

### v1.0.10
- remove zo's script

### v1.0.9
- fix zo's script loading url
- fix data extraction for new design
- add autoupdate

### v1.0.7
- fix pages where enhancement script is injected

### v1.0.6
- load Zo script directly from google code (no need for updates anymore :D)

### v1.0.5
- integrate Zo enhancement script  
- fix link to main page  

### v1.0.4
- new design (powered by jquery mobile)
- added highlighting of new items
- added home button to open steamgifts.com
- added removal of expired giveaways
- increased refresh time to 10 mins

### v1.0.3
- fix autorefresh bug (finnaly got it!)
- add last refresh time to tooltip

### v1.0.2
- added refresh button
- fix autorefresh bug
- fix sorting

### v1.0.1
- creation and end time is now stored as js Date type
- added UI sorting options

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44957513-1', 'github.com');
  ga('send', 'pageview');

</script>
