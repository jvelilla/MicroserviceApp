var zmq = require('zmq')
var sock = zmq.socket('rep');

sock.bind('tcp://0.0.0.0:4000');
console.log('Worker connected to port 4000');

sock.on('message', function(msg){
	console.log("Hmmm, somebody sent: %s", msg.toString());
	// ZMQ service logic.

	sock.send("Process ...:" + msg.toString());
	
});