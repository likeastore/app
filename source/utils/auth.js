var config = require('likeastore-config');
var services = config.services;
var networks = require('../db/networks.js');
var TwitterAuth = require('passport-twitter').Strategy;
var GithubAuth = require('passport-github').Strategy;
var StackAuth = require('passport-stackexchange').Strategy;
var FacebookAuth = require('passport-facebook').Strategy;
var logger = require('./logger');

module.exports = function (passport) {

	var saveServiceToNetworks = function (req, token, tokenSecret, profile, done) {
		networks.save(req.user._id, profile, token, tokenSecret, function (err, user) {
			if (err) {
				return done(err);
			}
			done(null, user);
		});
	};

	passport.use('twitter-authz', new TwitterAuth({
		consumerKey: services.twitter.consumerKey,
		consumerSecret: services.twitter.consumerSecret,
		callbackURL: config.applicationUrl + '/connect/twitter/callback',
		passReqToCallback: true
	}, saveServiceToNetworks));

	passport.use('github-authz', new GithubAuth({
		clientID: services.github.appId,
		clientSecret: services.github.appSecret,
		callbackURL: config.applicationUrl + '/connect/github/callback',
		passReqToCallback: true,
		customHeaders: { 'User-Agent': 'likeastore' }
	}, saveServiceToNetworks));

	passport.use('stackexchange-authz', new StackAuth({
		key: services.stackoverflow.clientKey,
		clientID: services.stackoverflow.clientId,
		clientSecret: services.stackoverflow.clientSecret,
		callbackURL:  config.applicationUrl + '/connect/stackoverflow/callback',
		passReqToCallback: true
	}, saveServiceToNetworks));

};