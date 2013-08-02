var _ = require('underscore');
var users = require('../db/users.js');
var items = require('../db/items.js');
var networks = require('../db/networks.js');
var logger = require('../utils/logger');

function usersService (app) {
	app.get('/api/users/me',
		getUser,
		disabledNetworksWarning,
		returnUser
	);

	function getUser(req, res, next) {
		users.findByEmail(req.user, function (err, user) {
			if (err) {
				return next(err);
			}

			req.readUser = user;

			next();
		});
	}

	function disabledNetworksWarning(req, res, next) {
		networks.findNetworks(req.user, function (err, networks) {
			if (err) {
				return next(err);
			}

			req.readUser.warning = _.any(networks, function (network) {
				return network.disabled;
			});

			next();
		});
	}

	function returnUser(req, res, next) {
		res.json(req.readUser);
	}
}

module.exports = usersService;