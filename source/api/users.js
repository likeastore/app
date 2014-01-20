var _ = require('underscore');

var users = require('../models/users');
var networks = require('../models/networks');
var middleware = require('../middleware');

function usersService(app) {
	app.get('/api/users/me',
		disabledNetworksWarning,
		returnUser
	);

	app.del('/api/users/me',
		middleware.analytics.track('account deactivated'),
		deleteUser
	);

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

	function returnUser(req, res, next) {
		res.json(req.user);
	}
}

module.exports = usersService;
