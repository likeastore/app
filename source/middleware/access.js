var _ = require('underscore');
var auth = require('./auth');
var logger = require('../utils/logger');
var config = require('../../config');
var users = require('../models/users');

function authenticatedAccess () {
	var validateToken = auth.validateToken();

	return function (req, res, next) {
		validateToken(req, res, validateUser);

		function validateUser(err) {
			if (err) {
				return next(err);
			}

			users.findByEmail(req.user, function (err, user) {
				if (err) {
					return next({message: 'User is not authorized (error on users)', status: 401, err: err});
				}

				if (!user) {
					return next({message: 'User is not authorized (user not found in db)', status: 401});
				}

				req.user = user;

				next();
			});
		}
	};
}

function guest () {
	return function _guest (req, res, next) {
		req.guestAccess = true;
		next ();
	};
}

function ensureUser () {
	return function (req, res, next) {
		var urls = ['/api', '/connect'];
		var acceptUrl = _.any(urls, function (url) {
			return req.url.substr(0, url.length) === url;
		});

		if (acceptUrl && !req.user) {
			logger.warning({message: 'unauthorized access (sending 401)', url: req.url});
			return res.send(401);
		}

		return next();
	};
}

function redirectUnauthorized() {
	return function (req, res, next) {
		var end = res.end;
		res.end = function (data, encoding) {
			res.end = end;
			if (res.statusCode === 401) {
				logger.info({message: 'redirect unauthorized', user: req.user });

				return res.redirect(config.siteUrl);
			}

			res.end(data, encoding);
		};

		next();
	};
}

module.exports = {
	authenticatedAccess: authenticatedAccess,
	guest: guest,
	ensureUser: ensureUser,
	redirectUnauthorized: redirectUnauthorized
};