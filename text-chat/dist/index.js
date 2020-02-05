'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _package = require('../package.json');

var _uws = require('uws');

var _uws2 = _interopRequireDefault(_uws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 3000;
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use((0, _morgan2.default)('dev'));

app.use((0, _cors2.default)({
	exposedHeaders: "*"
}));

app.use(_bodyParser2.default.json({
	limit: '50mb'
}));

app.wss = new _uws.Server({
	server: app.server
});

var clients = [];

app.wss.on('connection', function (connection) {

	var userId = clients.length + 1;

	connection.userId = userId;

	var newClient = {
		ws: connection,
		userId: userId
	};

	clients.push(newClient);

	console.log("New client connected with userId:", userId);

	connection.on('message', function (message) {

		console.log("message from:", message);
	});

	connection.on('close', function () {

		console.log("client with ID ", userId, ' is disconnected');

		clients = clients.filter(function (client) {
			return client.userId !== userId;
		});
	});
});

app.get('/', function (req, res) {

	res.json({
		version: _package.version
	});
});

app.get('/api/all_connections', function (req, res, next) {

	return res.json({

		people: clients
	});
});

setInterval(function () {

	// each 3 seconds this function will be executed.

	console.log('There ' + clients.length + ' people in the connection.');

	if (clients.length > 0) {

		clients.forEach(function (client) {

			//console.log("CLient ID", client.userId);

			var msg = 'Hey ID: ' + client.userId + ': you got a new message from server';

			client.ws.send(msg);
		});
	}
}, 3000);

app.server.listen(process.env.PORT || PORT, function () {
	console.log('App is running on port ' + app.server.address().port);
});

exports.default = app;
//# sourceMappingURL=index.js.map