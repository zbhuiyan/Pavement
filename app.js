var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var redis = require('redis');
var nr = require('node-resque');
var initPassport = require('./passport/initPassport.js');
var expressSession = require('express-session');
var auth = require('./auth.js');
var hasher = require('./passport/hasher.js');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var paper = require('paper');

var pavementWrapper = require('./public/javascripts/pavementpaper.js');

app.use(expressSession({secret: "notReallyASecret",
	resave:false,
	saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

initPassport(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://jwei:jwei@ds025459.mlab.com:25459/pavement');

var socketHelper = require('./functions/sockethelper.js');

var redisClient = redis.createClient();
var resqueConnectionDetails = {redis: redisClient};

var jobs = {
	"saveState": {
		perform: function(room, callback) {
			socketHelper.getEdits(room, function(data) {
				if (data.length > 0) {
					socketHelper.getSvg(room, function(svgdata) {
						var canvas = new paper.Canvas(1000, 1000);
						var wrapper = new pavementWrapper(canvas);

						if(svgdata !== undefined && svgdata.data !== undefined) {
							wrapper.startProjectFromSVG(svgdata.data);
						}

						for(var index = 0; index < data.length; index++) {
							var editData = data[index].data;

							wrapper.applyEdit(editData);
						}

						socketHelper.addSvg(room, wrapper.exportSVG(), function() {
							if (svgdata !== undefined &&svgdata._id !== undefined) {
								socketHelper.removeSvg(svgdata._id);
							}
							for(var index = 0; index < data.length; index++) {
								socketHelper.removeEdit(data[index]._id);
							}
						});
						callback('replaced SVG');
					});
				} else {
					callback('no edits to apply');
				}
			});
		}
	}
};

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

var queue = new nr.queue({connection:resqueConnectionDetails}, jobs);
queue.on('error', function(error) {
	console.log(error);
});

var index = require('./routes/index.js');
var user = require('./routes/user.js');
var chat = require('./routes/chat.js');
var board = require('./routes/board.js');
var accessor = require('./passport/accessor.js');

app.get('/', accessor.isLoggedIn, index.home);
app.get('/currentUser', user.currentUser);
app.get('/draw/:boardId', accessor.canAccessBoard, index.draw);
app.get('/me', user.currentUser);
app.get('/users/:username', user.getUser);
app.get('/messages/:boardId', chat.getChat);
app.get('/dashboard', accessor.isLoggedIn, index.dashboard);
app.get('/myBoards', board.getAvailablePrivateBoards);
app.get('/publicBoards', board.getPublic);
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/login', passport.authenticate('signin', {
	// WE SHOULD PROBABLY DO SOMETHING ABOUT THIS
	successRedirect:'/',
	failureRedirect:'/'
}));

app.post('/signup', passport.authenticate('signup', {
	successRedirect:'/',
	failureRedirect:'/'
}));

app.post('/board/add', board.add);
app.post('/dashboard', index.dashboard);

app.delete('/board/:name/:owner', board.deleteBoard);

// DO SOCKET STUFF HERE
var openConnections = {};

io.on('connection', function(socket) {
	socket.on('setup', function(userInfo) {
		var roomId = userInfo.boardId;
		openConnections[socket.id] = userInfo;
		socket.join(roomId);
		queue.connect(function() {
			queue.enqueue('board' + roomId, 'saveState', roomId, function(message) {
				console.log(message);
			});
		});
	});

	socket.on('chat', function(message) {

		var socketInfo = openConnections[socket.id];
		var sendMsg = {user:socketInfo.userId,
			msg:message,
			_id:hasher(message+socketInfo.userId)};


		console.log('socketConnected', socketInfo);

		//socket.to(socketInfo.boardId).emit('send_message', sendMsg);
		io.to(socketInfo.boardId).emit('send_message', sendMsg);

		var chatObj = {};
		chatObj.boardId = socketInfo.boardId;
		chatObj.user = socketInfo.userId;
		chatObj.msg = message;

		socketHelper.addMessage(chatObj);
	});

	socket.on('draw', function(data) {
		var roomId = openConnections[socket.id].boardId;
		data.id = openConnections[socket.id].userId;
		io.to(roomId).emit(data.method, data);

		socketHelper.addEdit(roomId, data);
	});

	socket.on('disconnect', function() {
		console.log('disconnecting...');
		var roomId = openConnections[socket.id].boardId;
		queue.connect(function() {
			queue.enqueue('board' + roomId, 'saveState', roomId, function(message) {
				console.log(message);
			});
			delete openConnections[socket.id];
		});
		//console.log(io.sockets.adapter.rooms['56f97f246be8a54a27d8ce0f']);
	});
});

var PORT = process.env.PORT || 3000;

http.listen(PORT, function() {
	console.log('listening on port: ', PORT);
})