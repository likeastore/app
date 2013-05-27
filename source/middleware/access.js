var _ = require('underscore');
var subscribers = require('./../db/subscribers');
var logger = require('./../utils/logger');
var config = require('likeastore-config');

function authenticated () {
	return function (req, res, next) {
		if (req.isAuthenticated() || req.role === 'guest') {
			return next();
		}
		res.redirect('/welcome');
	};
}

function guest () {
	return function (req, res, next) {
		req.role === 'guest';
		return next();
	};
}

function invite () {
	return function (req, res, next) {
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
		var urls = ['/api', '/connect'];
		var acceptUrl = _.any(urls, function (url) {
			return req.url.substr(0, url.length) === url;
		});

		if (acceptUrl && !req.user) {
			return res.redirect(config.siteUrl);
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