var services = require('../../config')().services;
var users = require('../db/usersFactory.js');
var nets = require('../db/networksFactory.js');
var TwitterAuth = require('passport-twitter').Strategy;
var GithubAuth = require('passport-github').Strategy;
var FacebookAuth = require('passport-facebook').Strategy;
var StackAuth = require('passport-stackexchange').Strategy;
var LocalAuth = require('passport-local').Strategy;

module.exports = function (passport) {

	/*
	 * Serialize logined user to session
	 */
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	/*
	 * App register/login strategies
	 */
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

	/*
	 * Connector's authorization strategies
	 */
	passport.use('twitter-authz', getAuth({
		type: 'twitter',
		url: '/connect/twitter/callback',
		callback: saveServiceToNetworks,
		req: true
	}));

	passport.use('github-authz', getAuth({
		type: 'github',
		url: '/connect/github/callback',
		callback: saveServiceToNetworks,
		req: true
	}));

	passport.use('stackexchange-authz', getAuth({
		type: 'stackoverflow',
		url: '/connect/stackexchange/callback',
		callback: saveServiceToNetworks,
		req: true
	}));

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

			stackoverflow: new StackAuth({
				key: services.stackoverflow.clientKey,
				clientID: services.stackoverflow.clientId,
				clientSecret: services.stackoverflow.clientSecret,
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
		nets.saveNetwork(req.user._id, profile, token, tokenSecret, function (err, user) {
			if (err) {
				return done(err);
			}
			done(null, user);
		});
	}
};