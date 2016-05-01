// Node Requirements
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var redis = require('redis');
var nr = require('node-resque');
var expressSession = require('express-session');
var paper = require('paper');

// Pavement functionality
var auth = require('./auth.js');
var hasher = require('./passport/hasher.js');
var socketHelper = require('./functions/sockethelper.js');
// var jobs = require('./functions/redisjobs.js');
var initPassport = require('./passport/initPassport.js');
var pavementWrapper = require('./public/javascripts/pavementpaper.js');
var redisManager = require('./redis/redismanager.js');

// Server requirements
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

//TODO: replace with new URI and link via auth file instead?
mongoose.connect('mongodb://jwei:jwei@ds025459.mlab.com:25459/pavement');

redisManager.initialize();

var index = require('./routes/index.js');
var user = require('./routes/user.js');
var chat = require('./routes/chat.js');
var board = require('./routes/board.js');
var svgRoutes = require('./routes/svg.js');
var accessor = require('./passport/accessor.js');

app.get('/', accessor.isLoggedIn, index.home);
app.get('/currentUser', user.currentUser);
app.get('/draw/:boardId', accessor.canAccessBoard, index.draw);
app.get('/boardUsers/:boardId', board.getBoardUsers);
app.get('/svg/:boardId', svgRoutes.getSvg);
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

app.delete('/board/:boardId/:owner', board.deleteBoard);
app.delete('/removeUser/:boardId/:userId', board.removeUser);

app.put('/addUser/:boardId/:userId', board.addUser);
// DO SOCKET STUFF HERE
var openConnections = {};

io.on('connection', function(socket) {
	socket.on('setup', function(userInfo) {
		var roomId = userInfo.boardId;
		openConnections[socket.id] = userInfo;
		socket.join(roomId);

		redisManager.queueJob(roomId, function(err, message) {
			if(!err) {
				console.log(message);
			}
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

		if(openConnections[socket.id] !== undefined) {
			var roomId = openConnections[socket.id].boardId;
			delete openConnections[socket.id];

			redisManager.queueJob(roomId, function(err, message) {
				if(!err) {
					console.log(message);
				}
			});
		}
	});

	socket.on('error', function() {
		console.log('error occurred in socket');
	});
});

var PORT = process.env.PORT || 3000;

http.listen(PORT, function() {
	console.log('listening on port: ', PORT);
})