var services = require('../../config')().services;
var users = require('../services/usersFactory.js');
var nets = require('../services/networksFactory.js');
var TwitterAuth = require('passport-twitter').Strategy;
var GithubAuth = require('passport-github').Strategy;
var FacebookAuth = require('passport-facebook').Strategy;
var LocalAuth = require('passport-local').Strategy;

module.exports = function (passport) {

	function getAuth (options) {
		if (!options || typeof options !== 'object') {
			console.error('Options are incorrect!');
			return;
		}

		if (!options.req) {
			options.req = false;
		}

		var authTypes = {
			twitter: new TwitterAuth({
				consumerKey: services.twitter.consumerKey,
				consumerSecret: services.twitter.consumerSecret,
				callbackURL: options.url,
				passReqToCallback: options.req
			}, options.callback),

			github: new GithubAuth({
				clientID: services.github.appId,
				clientSecret: services.github.appSecret,
				callbackURL: options.url,
				passReqToCallback: options.req,
				customHeaders: {'User-Agent': 'likeastore'}
			}, options.callback),

			facebook: new FacebookAuth({
				clientID: services.facebook.appId,
				clientSecret: services.facebook.appSecret,
				callbackURL:  options.url,
				passReqToCallback: options.req
			}, options.callback),

			local: new LocalAuth({
				passReqToCallback: options.req
			}, options.callback)
		};

		return authTypes[options.type];
	}

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

	function saveServiceToNetworks (req, token, tokenSecret, profile, done) {
		nets.saveNetwork(profile, token, tokenSecret, function (err, user) {
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

	// registration/authentication strategies
	passport.use(getAuth({
		type: 'twitter',
		url: '/auth/twitter/callback',
		callback: getServiceUser
	}));

	passport.use(getAuth({
		type: 'github',
		url: '/auth/github/callback',
		callback: getServiceUser
	}));

	passport.use(getAuth({
		type: 'facebook',
		url: '/auth/facebook/callback',
		callback: getServiceUser
	}));

	passport.use(getAuth({
		type: 'local',
		callback: getLocalUser,
		req: true
	}));

	// authorization strategies
	passport.use('twitter-authz', getAuth({
		type: 'twitter',
		url: '/connect/twitter/callback',
		callback: saveServiceToNetworks
	}));

	passport.use('github-authz', getAuth({
		type: 'github',
		url: '/connect/github/callback',
		callback: saveServiceToNetworks
	}));
};