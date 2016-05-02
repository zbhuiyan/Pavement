/**
 * index.js contains methods for routing to home, drawing, and dashboard
 */

var path = require('path');

var routes = {};

routes.home = function(req, res) {
	res.sendFile(__dirname + 'public/index.html');
}

routes.draw = function(req, res) {
	res.sendFile('drawing.html', { root: path.join(__dirname, '../public/') });
}

routes.dashboard = function(req, res) {
	res.sendFile('dashboard.html', { root: path.join(__dirname, '../public/') });
}

module.exports = routes;
