var _ = require('underscore');

var users = require('../models/users');
var networks = require('../models/networks');
var notifications = require('../models/notifications');

var middleware = require('../middleware');

function usersService(app) {
	app.get('/api/users/me',
		disabledNetworksWarning,
		returnUser
	);

	app.get('/api/users/:name',
		findUserByName,
		returnUser);

	app.get('/api/users/id/:id',
		findUserById,
		returnUser);

	app.del('/api/users/me',
		middleware.analytics.track('account deactivated'),
		deleteUser
	);

	app.get('/api/users/me/suggest',
		suggestPeopleToFollow
	);

	app.post('/api/users/me/follow/:id',
		middleware.analytics.track('user followed'),
		followUser
	);

	app.del('/api/users/me/follow/:id',
		middleware.analytics.track('user unfollowed'),
		unfollowUser
	);

	function findUserByName(req, res, next) {
		users.findByName(req.params.name, function (err, user) {
			if (err) {
				return next(err);
			}

			req.user = user;

			next();
		});
	}

	function findUserById(req, res, next) {
		users.findById(req.params.id, function (err, user) {
			if (err) {
				return next(err);
			}

			req.user = user;

			next();
		});
	}

	function disabledNetworksWarning(req, res, next) {
		networks.findNetworks(req.user, function (err, networks) {
			if (err) {
				return next(err);
			}

			req.user.warning = _.any(networks, function (network) {
				return network.disabled;
			});

			next();
		});
	}

	function deleteUser(req, res, next) {
		users.deactivate(req.user, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}

	function followUser(req, res, next) {
		users.follow(req.user, req.params.id, function (err, followedUser) {
			if (err) {
				return next(err);
			}

			notifications.followed(req.user, followedUser);

			res.send(201);
		});
	}

	function unfollowUser(req, res, next) {
		users.unfollow(req.user, req.params.id, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}

	function suggestPeopleToFollow(req, res, next) {
		users.suggestPeople(req.user, function (err, suggested) {
			if (err) {
				return next(err);
			}

			res.json(suggested);
		});
	}

	function returnUser(req, res, next) {
		res.json(req.user);
	}
}

module.exports = usersService;
