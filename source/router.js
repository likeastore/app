var users = require('./db/usersFactory.js');
var nets = require('./db/networksFactory.js');

/*
 * GET home page
 */
function index (req, res) {
	if (req.user) {
		return res.redirect('/dashboard');
	}
	res.render('welcome', { title: 'Likeastore signup' });
}

/*
 * GET angular application
 */
function app (req, res) {
	res.render('app', { title: 'Likeastore app', user: req.user });
}

/*
 * GET angular view partials
 */
function partials (req, res) {
	res.render('partials/' + req.params.name);
}

/*
 * GET first time setup page form
 */
function setup (req, res) {
	if (!req.user.firstTimeUser) {
		return res.redirect('/dashboard');
	}
	res.render('setup', { title: 'Account setup', user: req.user });
}

/*
 * GET logout from
 */
function logout (req, res) {
	req.logout();
	res.redirect('/');
}

/*
 * POST username and email setup for newcomers from services
 * (also saving to networks)
 */
function makeSetup (req, res) {
	var user = req.user;

	users.accountSetup(user._id, req.body, saveFirstService);


	function saveFirstService (err) {
		if (err) {
			return res.send(500, err);
		}

		nets.saveNetwork(user._id, user, user.token, user.tokenSecret, function (err, user) {
			if (err) {
				return res.send(500, err);
			}
			res.send(200);
		});
	}
}

/*
 * Route middleware to ensure user is authenticated
 */
function ensureAuth (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = {
	index: index,
	app: app,
	setup: setup,
	logout: logout,
	partials: partials,
	makeSetup: makeSetup,
	ensureAuth: ensureAuth
};