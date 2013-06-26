/**
 * Static pages router
 */

module.exports = function (app) {
	var partials = function (req, res) {
		res.render('partials/' + req.params.name);
	};

	app.get('/partials/:name', partials);
};