var PortManager = function(noAutoAttach){
	var that = this;

	var ports = Object.create(null);

	this.onAdd = function(port) {};
	this.onRemove = function(port){};
	this.onConnect = function(port){};
	this.onDisconnect = function(port){};
	this.onDigest = function(messag, ports){};
	this.onReceive = function(message, port){};

	if(!noAutoAttach) {
		chrome.extension.onConnect.addListener(function(port){
			if(that.onConnect(port) !== false) {
				that.add(port);
			}
		});
	}

	this.add = function(port) {
		port.onMessage.addListener(function(message, port){
			that.onReceive(message, port);
		});

		port.onDisconnect.addListener(function(port){
			if(that.onDisconnect(port) !== false) {
				that.remove(port);
			}
		});

		if(that.onAdd(port) !== false) {
			ports[port.portId_] = port;
		}
	}

	this.remove = function(port) {
		if(that.onRemove(port) !== false) {
			delete ports[port.portId_];
		}
	};

	this.digest = function(message) {
		if(that.onDigest(message, ports) !== false) {
			for(portId in ports) {
				ports[portId].postMessage(message);
			}
		}
	};

	this.getPorts = function(asArray){
		if(asArray) {
			var arr = [];
			for(portId in ports) {
				arr.push(ports[portId]);
			}
		} else {
			return ports;
		}
	};

};