var routes = {};

routes.home = function(req, res) {
	res.sendFile(__dirname + 'public/main.html');
}

routes.draw = function(req, res) {
	console.log('hello');
	res.send('I feel like something should happen here');
}

module.exports = routes;

