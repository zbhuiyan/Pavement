var redis = require('redis');
var nr = require('node-resque');
var url = require('url');

var jobs = require('./redisjobs.js');
var queue;

var methods = {}

methods.initialize = function() {
	var rtg = url.parse('redis://redistogo:531559269bc101e6d65b2738e8ff5045@lab.redistogo.com:10291/');
	var redisClient = redis.createClient(rtg.port, rtg.hostname);
	redisClient.auth(rtg.auth.split(":")[1]);

	var resqueConnectionDetails = {redis: redisClient};

	queue = new nr.queue({connection:resqueConnectionDetails});
		queue.on('error', function(error) {
			console.log(error);
	});
}

methods.queueJob = function(roomId, callback) {
	if(queue !== undefined) {
		queue.connect(function() {
			queue.enqueue('board' + roomId, 'saveState', roomId, callback);
		});
	}
}

module.exports = methods;