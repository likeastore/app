/**
 * Static pages router
 */

var middleware = require('./middleware');

module.exports = function (app) {
	var partials = function (req, res) {
		res.render('partials/' + req.params.name);
	};

	app.get('/partials/:name', partials);
};