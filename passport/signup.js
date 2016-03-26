var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/userModel.js');
var hasher = require('hasher.js');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
		passReqToCallback:true
	}, function(req, username, password, done) {
		var hashedPassword = hasher(password);
		User.findOne({username:username}, function(err, user) {
			if(!err) {
				if(!user) {
					// no user with that user name exists
					newUser = new User({
						username:username,
						password:password
					});

					newUser.save(function(err, user) {
						if(!err) {
							return done(null, user);
						} else {
							return done(err);
						}
					});
				} else {
					// user already exists
					return done(null, false);
				}
			} else {
				return done(err);
			}
		});
	}));
};