var _ = require('underscore');

var users = require('../models/users');
var networks = require('../models/networks');
var middleware = require('../middleware');

function usersService(app) {
	app.get('/api/users/me',
		getUser,
		disabledNetworksWarning,
		returnUser
	);

	app.del('/api/users/me',
		middleware.analytics.track('account deactivated'),
		deleteUser
	);

	app.post('/api/users/me/resetpasswordrequest',
		createResetPasswordRequest
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

	function deleteUser(req, res, next) {
		users.deactivate(req.user, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}

	function createResetPasswordRequest(req, res, next) {
		users.resetPasswordRequest(req.user, function (err, request) {
			if (err) {
				return next(err);
			}

			res.json(201, request);
		});
	}

	function validateRequest(req, res, next) {
		var request = req.body;

		if (!request.id) {
			return next({message: 'missing request id', status: 412});
		}

		if (!request.email) {
			return next({message: 'missing email', status: 412});
		}

		if (!request.newPassword) {
			return next({message: 'missing new password', status: 412});
		}

		next();
	}

	function returnUser(req, res, next) {
		// TODO: use transform function to omit fields not used on client
		res.json(req.readUser);
	}
}

module.exports = usersService;
