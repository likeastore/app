var middleware = require('../middleware');

function authService(app) {
	app.post('/api/auth/login', middleware.access.guest(), function (req, res) {
		res.send(412);
	});
}

module.exports = authService;
