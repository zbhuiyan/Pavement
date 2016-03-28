var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var initPassport = require('./passport/initPassport.js');
var expressSession = require('express-session');

var app = express();
var http = require('http').Server(app);
var io = require('socket-io')(http);

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



// DO SOCKET STUFF HERE

var PORT = process.env.PORT || 3000;

http.listen(PORT, function() {
	console.log('listening on port: ', PORT);
})