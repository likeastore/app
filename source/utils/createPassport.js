// var config = require('../../config');
// var TwitterAuth = require('passport-twitter').Strategy;

// function createPassport(app, callback) {
// 	var passport = require('passport');
// 	var services = config.services;

// 	app.use(passport.initialize());

// 	passport.use(new TwitterAuth({
// 		consumerKey: services.twitter.consumerKey,
// 		consumerSecret: services.twitter.consumerSecret,
// 		callbackURL: config.applicationUrl + '/api/networks/twitter/callback'
// 	}, callback));

// 	return passport;
// }

// module.exports = createPassport;