var _ = require('underscore');
var subscribers = require('./../db/subscribers');

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
		var inviteId = req.cookies['likeastore_invite_id'];

		if (!inviteId || typeof inviteId !== 'string') {
			console.log('no inviteId in cookies');
			return res.send(401);
		}

		subscribers.findOne({inviteId: inviteId}, function (err, subscription) {
			if (err || !subscription || !subscription.activated) {
				console.log('not find subscription by id' + err);
				return res.send(401);
			}

			return next();
		});
	};
}

function ensureUser () {
	return function (req, res, next) {
		var urls = ['/api'];
		var acceptUrl = _.any(urls, function (url) {
			return req.url.substr(0, url.length) === url;
		});

		if (acceptUrl && !req.user) {
			return res.send(401, 'Unauthorized');
		}

		return next();
	};
}

module.exports = {
	authenticated: authenticated,
	guest: guest,
	invite: invite,
	ensureUser: ensureUser
};