var users = require('./services/usersFactory.js');

/*
 * GET home page
 */
function index (req, res) {
	if (req.user) {
		return res.redirect('/app');
	}
	res.render('index', { title: 'Likeastore sign up' });
}

/*
 * GET angular application
 */
function app (req, res) {
	res.render('app');
}

/*
 * GET first time setup page form
 */
function setup (req, res) {
	if (!req.user.firstTimeUser) {
		return res.redirect('/app');
	}
	res.render('setup', { title: 'Setup your account', user: req.user });
}

/*
 * GET logout from
 */
function logout (req, res) {
	req.logout();
	res.redirect('/');
}

/*
 * POST username and email setup for newcomers
 */
function makeSetup (req, res) {
	users.accountSetup(req.user._id, req.body, function (err, saved) {
		if (err) {
			return res.send(500, err);
		}
		res.send(200);
	});
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
	makeSetup: makeSetup,
	ensureAuth: ensureAuth
};