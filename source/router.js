/**
 * Static pages router
 */

module.exports = function (app) {


	app.get('/', welcome);

	// angular master page serves here
	app.get('/dashboard', ensureAuth, dashboard);

	// angular view partials urls
	app.get('/partials/:name', partials);

	// first login setup page
	app.get('/setup', ensureAuth, setup);

	app.get('/logout', logout);
	app.get('*', ensureAuth, dashboard);



	function welcome (req, res) {
		if (req.user) {
			return res.redirect('/dashboard');
		}
		res.render('welcome', { title: 'Likeastore signup' });
	}

	function dashboard (req, res) {
		if (req.user.firstTimeUser) {
			return res.redirect('/setup');
		}
		res.render('app', { title: 'Likeastore app', user: req.user });
	}

	function partials (req, res) {
		res.render('partials/' + req.params.name);
	}

	function setup (req, res) {
		res.render('setup', { title: 'Account setup', user: req.user });
	}

	function logout (req, res) {
		req.logout();
		res.redirect('/');
	}

	// route middleware to ensure user is authenticated
	function ensureAuth (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/');
	}
};