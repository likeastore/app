/**
 * Static pages router
 */
var config = require('../config');

module.exports = function (app) {
	var partials = function (req, res) {
		res.render('partials/' + req.params.name);
	};

	var redirectToLogin = function (req, res, next) {
		res.redirect(config.siteUrl + '/login');
	};

	app.get('/partials/:name', partials);
	app.get('/logout', redirectToLogin);
};