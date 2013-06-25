/**
 * Static pages router
 */

var middleware = require('./middleware');

module.exports = function (app) {

	var partials = function (req, res) {
		res.render('partials/' + req.params.name);
	};

	var quit = function (req, res) {
		req.logout();
		res.redirect('/');
	};

	app.get('/', middleware.access.authenticated());
	app.get('/partials/:name', partials);
	app.get('/logout', quit);
};