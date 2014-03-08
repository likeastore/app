var moment = require('moment');

var middleware = require('../middleware');
var users = require('../models/users');
var config = require('../../config');
var logger = require('../utils/logger');

function authService(app) {

	app.post('/api/auth/login',
		log,
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

	function log(req, res, next) {
		logger.warning({message: '/api/auth/login called'});
		next();
	}

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
		logger.warning({message: 'access token placed to cookie', token: req.token});

		res.cookie(config.authCookie, req.token, {
			domain: config.domain,
			expires: new Date(Date.now() + (30*24*60*60*1000)),
			httpOnly: true
		});

		next();
	}

	function deleteTokenCookie(req, res, next) {
		res.clearCookie(config.authCookie, { domain: config.domain });
		next();
	}

	function returnToken(req, res, next) {
		logger.warning({message: 'access token created', token: req.token});

		res.json(201, { token: req.token });
	}

	function returnOk(req, res, next) {
		res.send(200);
	}
}

module.exports = authService;
