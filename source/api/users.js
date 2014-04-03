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

	app.patch('/api/users/me',
		middleware.validate('userPatch'),
		updateUser,
		returnUser
	);

	app.get('/api/users/search',
		searchUser
	);

	// DEPRICATED API: will be removed soon
	app.get('/api/users/me/follows',
		returnFollows
	);

	// DEPRICATED API: will be removed soon
	app.get('/api/users/me/followed',
		returnFollowed
	);

	// DEPRICATED API: will be removed soon
	app.get('/api/users/:name/follows',
		returnFollowsByName
	);

	// DEPRICATED API: will be removed soon
	app.get('/api/users/:name/followed',
		returnFollowedByName
	);

	app.get('/api/users/:name',
		findUserByName,
		returnUser
	);

	app.get('/api/users/id/:id',
		findUserById,
		returnUser
	);

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

	function searchUser(req, res, next) {
		if (!req.query.name) {
			return next({message: 'name query parameter missing', status: 412});
		}

		users.findByAny(req.query.name, function (err, users) {
			if (err) {
				return next(err);
			}

			res.json(users);
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

	function returnFollows(req, res, next) {
		users.follows(req.user, function (err, follows) {
			if (err) {
				return next(err);
			}

			res.json(follows);
		});
	}

	function returnFollowed(req, res, next) {
		users.followed(req.user, function (err, followed) {
			if (err) {
				return next(err);
			}

			res.json(followed);
		});
	}

	function returnFollowsByName(req, res, next) {
		users.findByName(req.params.name, function (err, user) {
			if (err) {
				return next(err);
			}

			users.follows(user, function (err, follows) {
				if (err) {
					return next(err);
				}

				res.json(follows);
			});
		});
	}

	function returnFollowedByName(req, res, next) {
		users.findByName(req.params.name, function (err, user) {
			if (err) {
				return next(err);
			}

			users.followed(user, function (err, followed) {
				if (err) {
					return next(err);
				}

				res.json(followed);
			});
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

	function updateUser(req, res, next) {
		users.update(req.user, req.body, function (err, user) {
			if (err) {
				return next(err);
			}

			req.user = user;

			next();
		});
	}

	function returnUser(req, res, next) {
		res.json(req.user);
	}
}

module.exports = usersService;
