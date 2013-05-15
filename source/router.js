/**
 * Static pages router
 */

var middleware = require('./middleware');

module.exports = function (app) {

	app.get('/', middleware.access.authenticated());

	// angular master page serves here
	app.get('/welcome', middleware.access.guest(), welcome);

	// angular view partials urls
	app.get('/partials/:name', partials);

	// first login setup page
	app.get('/setup', middleware.access.authenticated(), setup);

	app.get('/logout', logout);

	function welcome (req, res) {
		res.render('welcome', { title: 'Likeastore. | Signup' });
	}

	function dashboard (req, res) {
		if (req.user.firstTimeUser) {
			return res.redirect('/setup');
		}
		res.render('app', { title: 'Likeastore.', user: req.user });
	}

	function partials (req, res) {
		res.render('partials/' + req.params.name);
	}

	function setup (req, res) {
		res.render('setup', { title: 'Likeastore. | Setup', user: req.user });
	}

	function logout (req, res) {
		req.logout();
		res.redirect('/');
	}
};