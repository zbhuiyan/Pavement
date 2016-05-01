var redis = require('redis');
var nr = require('node-resque');

var jobs = require('./redisjobs.js');
var queue;

var methods = {}

methods.initialize = function() {
	var redisClient = redis.createClient();
	var resqueConnectionDetails = {redis: redisClient};

	var scheduler = new nr.scheduler({connection: resqueConnectionDetails});
	scheduler.connect(function() {
		scheduler.start();
	});

	var worker = new nr.worker({connection: resqueConnectionDetails}, jobs);
	worker.connect(function() {
		worker.workerCleanup();
		worker.start();
	});

	/////////////////////////
	// REGISTER FOR EVENTS //
	/////////////////////////

	worker.on('start',           function(){ console.log("worker started"); });
	worker.on('end',             function(){ console.log("worker ended"); });
	worker.on('cleaning_worker', function(worker, pid){ console.log("cleaning old worker " + worker); });
	worker.on('poll',            function(queue){ console.log("worker polling " + queue); });
	worker.on('job',             function(queue, job){ console.log("working job " + queue + " " + JSON.stringify(job)); });
	worker.on('reEnqueue',       function(queue, job, plugin){ console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
	worker.on('success',         function(queue, job, result){ console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
	worker.on('failure',         function(queue, job, failure){ console.log("job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
	worker.on('error',           function(queue, job, error){ console.log("error " + queue + " " + JSON.stringify(job) + " >> " + error); });
	worker.on('pause',           function(){ console.log("worker paused"); });

	scheduler.on('start',             function(){ console.log("scheduler started"); });
	scheduler.on('end',               function(){ console.log("scheduler ended"); });
	//scheduler.on('poll',              function(){ console.log("scheduler polling"); });
	scheduler.on('master',            function(state){ console.log("scheduler became master"); });
	scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); });
	scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); });
	scheduler.on('transferred_job',   function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); });

	queue = new nr.queue({connection:resqueConnectionDetails}, jobs);
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