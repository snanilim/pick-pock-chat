'use strict';

var WebSocket = require('uws');

var ws = new WebSocket('ws://localhost:3000');

ws.on('open', function () {

	console.log("Sucessful connected client 1 to the server.");

	// send new message from this client to server/

	ws.send('Hello server my name is client 1.');

	// listen new message

	ws.on('message', function (message) {

		console.log(message);
	});
});
//# sourceMappingURL=client1.js.map