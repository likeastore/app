var middleware = require('../middleware');
var users = require('../db/users');

function authService(app) {

	app.post('/api/auth/login',
		middleware.access.guest(),
		validateRequest,
		checkUser,
		middleware.auth.createToken(),
		returnToken);

	app.get('/api/auth/validate',
		middleware.access.guest(),
		middleware.auth.validateToken(),
		returnOk
	);

	app.post('/api/auth/logout',
		middleware.access.guest(),
		middleware.auth.validateToken(),
		returnOk
	);

	function validateRequest(req, res, next) {
		var signup = req.body;

		if (!signup.email) {
			return next({message: 'email is missing', body: signup, status: 412});
		}

		if (!signup.apiToken) {
			return next({message: 'apiToken is missing', body: signup, status: 412});
		}

		next();
	}

	function checkUser(req, res, next) {
		var login = req.body;
		users.findByEmail(login.email, function (err, user) {
			if (err) {
				return next({message: 'User not found', status: 401});
			}

			if (user.apiToken !== login.apiToken) {
				return next({message: 'apiToken match failure', status: 401});
			}

			req.user = user;
			next();
		});
	}

	function returnToken(req, res, next) {
		res.json(201, {token: req.token});
	}

	function returnOk(req, res, next) {
		res.send(200);
	}
}

module.exports = authService;
