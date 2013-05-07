var config = require('../../config')();
var users = require('../services/usersFactory.js');
var TwitterAuth = require('passport-twitter').Strategy;
var GithubAuth = require('passport-github').Strategy;
var FacebookAuth = require('passport-facebook').Strategy;
var LocalAuth = require('passport-local').Strategy;

module.exports = function (passport) {
	var twitter = new TwitterAuth({
		consumerKey: config.twitter.consumerKey,
		consumerSecret: config.twitter.consumerSecret,
		callbackURL: '/auth/twitter/callback'
	}, getServiceUser);

	var github = new GithubAuth({
		clientID: config.github.appId,
		clientSecret: config.github.appSecret,
		callbackURL: '/auth/github/callback',
		customHeaders: {'User-Agent': 'likeastore'}
	}, getServiceUser);

	var facebook = new FacebookAuth({
		clientID: config.facebook.appId,
		clientSecret: config.facebook.appSecret,
		callbackURL: '/auth/facebook/callback'
	}, getServiceUser);

	var local = new LocalAuth({
		passReqToCallback: true
	}, getLocalUser);

	function getServiceUser (token, tokenSecret, profile, done) {
		users.findOrCreateByService(token, tokenSecret, profile, function (err, user) {
			if (err) {
				return done(err);
			}
			done(null, user);
		});
	}

	function getLocalUser (req, username, password, done) {
		users.findOrCreateLocal(req.body, function (err, user) {
			if (err) {
				return done(err);
			}
			done(null, user);
		});
	}

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(twitter);
	passport.use(github);
	passport.use(facebook);
	passport.use(local);
};