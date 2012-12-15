$(function(){
	var port = chrome.extension.connect();
	
	port.onMessage.addListener(function(obj){
		console.log('message', arguments);
	});
	
	port.onDisconnect.addListener(function(){
		console.log('disconnect', arguments);
	});
	
	
	chrome.extension.sendMessage({op:'getPosts'}, function(res){
		console.log(arguments, 'response');
	});
});	