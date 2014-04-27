var moment = require('moment');

var middleware = require('../middleware');
var users = require('../models/users');
var config = require('../../config');

function authService(app) {

	app.post('/api/auth/login',
		middleware.access.guest(),
		validateRequest,
		checkUser,
		middleware.auth.createToken(),
		middleware.analytics.track('user logged on', {request: 'user', property: 'email'}),
		updateStats,
		createTokenCookie,
		returnToken);

	app.get('/api/auth/validate',
		middleware.access.guest(),
		middleware.auth.validateToken(),
		returnOk
	);

	app.post('/api/auth/logout',
		middleware.access.guest(),
		middleware.auth.validateToken(),
		deleteTokenCookie,
		middleware.analytics.track('user logged out', {request: 'user'}),
		returnOk
	);

	function validateRequest(req, res, next) {
		var signup = req.body;

		if (!signup.email) {
			return next({ message: 'email is missing', body: signup, status: 412, redirectUrl: config.siteUrl });
		}

		if (!signup.apiToken) {
			return next({ message: 'apiToken is missing', body: signup, status: 412, redirectUrl: config.siteUrl });
		}

		next();
	}

	function checkUser(req, res, next) {
		var login = req.body;
		users.findByEmail(login.email, function (err, user) {
			if (err) {
				return next({ message: 'User not found', status: 401, redirectUrl: config.siteUrl });
			}

			if (user.apiToken !== login.apiToken) {
				return next({ message: 'apiToken match failure', status: 401, redirectUrl: config.siteUrl });
			}

			if (user.deactivated) {
				return next({message: 'user account deactivated', status: 401, redirectUrl: config.siteUrl});
			}

			req.user = user;

			next();
		});
	}

	function updateStats(req, res, next) {
		var user = req.user;
		var update = { loginLastDate: moment().toDate() };
		if (user.loginLastDate) {
			update.loginPreviousDate = user.loginLastDate;
		}

		users.update(user, update, function (err, updated) {
			if (err) {
				return next(err);
			}

			req.user = updated;

			next();
		});
	}

	function createTokenCookie(req, res, next) {
		res.clearCookie(config.auth.cookieName, { domain: config.domain });
		res.cookie(config.auth.cookieName, req.token, {
			domain: config.domain,
			maxAge: config.auth.tokenTtl * 60 * 1000,
			httpOnly: true,
			secure: config.auth.secure
		});

		next();
	}

	function deleteTokenCookie(req, res, next) {
		res.clearCookie(config.auth.cookieName, { domain: config.domain });
		next();
	}

	function returnToken(req, res, next) {
		res.json(201, { token: req.token });
	}

	function returnOk(req, res, next) {
		res.json(200, {});
	}
}

module.exports = authService;
