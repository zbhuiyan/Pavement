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
app.get('/draw/:board_id', accessor.canAccessBoard, index.draw);
app.get('/users/me', user.currentUser);
app.get('/users/:username', user.getUser);
app.get('/messages/:board_id', chat.getChat);

app.post('/login', passport.authenticate('signin', {
	// WE SHOULD PROBABLY DO SOMETHING ABOUT THIS
	successRedirect:'/',
	failureRedirect:'/'
}));

app.post('/signup', passport.authenticate('signup', {
	successRedirect:'/',
	failureRedirect:'/'
}));

// DO SOCKET STUFF HERE

var PORT = process.env.PORT || 3000;

http.listen(PORT, function() {
	console.log('listening on port: ', PORT);
})