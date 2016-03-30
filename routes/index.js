var path = require('path');

var routes = {};

routes.home = function(req, res) {
	res.sendFile(__dirname + 'public/main.html');
}

routes.draw = function(req, res) {
	res.sendFile('drawing.html', { root: path.join(__dirname, '../public/') });
}

module.exports = routes;

