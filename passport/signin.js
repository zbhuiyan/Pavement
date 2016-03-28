var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/userModel.js');
var hasher = require('./hasher.js');

module.exports = function(passport) {
	passport.use('signin', new LocalStrategy({
		passReqToCallback:true
	}, function(req, username, password, done) {
		var hashedPassword = hasher(password);
		User.findOne({username:username, password:hashedPassword}, function(err, user) {
			if(!err) {
				if(user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			} else {
				return done(err);
			}
		});
	}));
};