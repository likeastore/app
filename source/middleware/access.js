var _ = require('underscore');
var subscribers = require('./../db/subscribers');
var logger = require('./../utils/logger');
var config = require('likeastore-config');

function authenticated () {
	return function (req, res, next) {
		logger.info({message: 'authentication check'});

		if (req.isAuthenticated() || req.role === 'guest') {
			logger.info({message: 'user is ' + (req.role === 'guest' ? 'guest' : 'authenticated')});
			return next();
		}

		logger.info({message: 'user is not authenticated and will be redirected', url: req.url, body: req.body });
		res.redirect('/welcome');
	};
}

function guest () {
	return function (req, res, next) {
		logger.info({message: 'ensuring guest access for request', request: req});
		req.role === 'guest';
		return next();
	};
}

function invite () {
	return function (req, res, next) {
		logger.info({message: 'checking invintation permissions for request', request: req});

		var inviteId = req.cookies.likeastoreInviteId || req.cookies.likeastore_invite_id;

		if (!inviteId || typeof inviteId !== 'string') {
			logger.warning({message: 'No invite id in cookie', ip: req.ip});
			return res.send(401, 'Missing authorization cookies');
		}

		subscribers.findOne({inviteId: inviteId}, function (err, subscription) {
			if (err || !subscription || !subscription.activated) {
				logger.warning({message: 'Subscription has not found', invite: inviteId});
				return res.send(401, 'Missing user with such invite ' + err);
			}

			return next();
		});
	};
}

function ensureUser () {
	return function (req, res, next) {
		logger.info({message: 'ensuring we have user in session', request: req, user: req.user });

		var urls = ['/api', '/connect'];
		var acceptUrl = _.any(urls, function (url) {
			return req.url.substr(0, url.length) === url;
		});

		if (acceptUrl && !req.user) {
			logger.warning({message: 'unauthorized access (sending 401)', url: req.url, request: req});
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
				logger.info({message: 'redirect unauthorized', request: req, user: req.user });

				return res.redirect(config.siteUrl);
			}

			res.end(data, encoding);
		};

		next();
	};
}

module.exports = {
	authenticated: authenticated,
	guest: guest,
	invite: invite,
	ensureUser: ensureUser,
	redirectUnauthorized: redirectUnauthorized
};