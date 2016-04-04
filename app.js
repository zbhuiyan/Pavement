var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var initPassport = require('./passport/initPassport.js');
var expressSession = require('express-session');
var auth = require('./auth.js');
var hasher = require('./passport/hasher.js');

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

mongoose.connect('mongodb://jwei:jwei@ds025459.mlab.com:25459/pavement');

var index = require('./routes/index.js');
var user = require('./routes/user.js');
var chat = require('./routes/chat.js');
var board = require('./routes/board.js');
var accessor = require('./passport/accessor.js');

app.get('/', index.home);
app.get('/draw/:boardId', accessor.canAccessBoard, index.draw);
app.get('/me', user.currentUser);
app.get('/users/:username', user.getUser);
app.get('/messages/:boardId', chat.getChat);
app.get('/dashboard', accessor.isLoggedIn, index.dashboard);
app.get('/myBoards', board.getAvailablePrivateBoards);
app.get('/publicBoards', board.getPublic);

app.post('/login', passport.authenticate('signin', {
	// WE SHOULD PROBABLY DO SOMETHING ABOUT THIS
	successRedirect:'/dashboard',
	failureRedirect:'/'
}));

app.post('/signup', passport.authenticate('signup', {
	successRedirect:'/dashboard',
	failureRedirect:'/'
}));

app.post('/board/add', board.add);
app.post('/dashboard', index.dashboard);

// DO SOCKET STUFF HERE
var openConnections = {};

io.on('connection', function(socket) {
	socket.on('setup', function(userInfo) {
		console.log('Setting up for ', userInfo);
		openConnections[socket.id] = userInfo;

		socket.join(openConnections[socket.id].boardId);
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

		chat.addMessage(chatObj);
	});

	socket.on('drawCircle', function(data) {
		io.to(openConnections[socket.id].boardId).emit('drawCircle', data);
	});

	socket.on('disconnect', function() {
		console.log('disconnecting...');
		delete openConnections[socket.id];
	});
});

var PORT = process.env.PORT || 3000;

http.listen(PORT, function() {
	console.log('listening on port: ', PORT);
})