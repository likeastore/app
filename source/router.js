/**
 * Static pages router
 */

module.exports = function (app) {

	app.get('/', ensureAuth);

	// angular master page serves here
	app.get('/welcome', guestAccess, welcome);

	// angular view partials urls
	app.get('/partials/:name', partials);

	// first login setup page
	app.get('/setup', ensureAuth, setup);

	app.get('/logout', logout);


	function welcome (req, res) {
		if (req.user) {
			return res.redirect('/');
		}
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

	// route middleware to ensure user is authenticated
	function ensureAuth (req, res, next) {
		if (req.isAuthenticated() || req.role === 'guest') {
			return next();
		}
		res.redirect('/welcome');
	}

	function guestAccess (req, res, next) {
		req.role === 'guest';
		return next();
	}
};