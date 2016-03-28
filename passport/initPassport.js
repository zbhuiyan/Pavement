var passport = require('passport');
var signin = require('./signin.js');
var signup = require('./signup.js');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	signin(passport);
	signup(passport);
};