/**
 * API module
 */

var users = require('./db/users.js');
var items = require('./db/items.js');
var nets = require('./db/networks.js');

var redirects = {
	successReturnToOrRedirect: '/',
	failureRedirect: '/failed'
};

module.exports = function (app, passport) {

	// passport user registration urls
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', redirects));
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', redirects));
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', redirects));

	// passport networks authorization urls
	app.get('/connect/twitter', passport.authorize('twitter-authz'));
	app.get('/connect/twitter/callback', passport.authorize('twitter-authz'), redirectToDashboard);
	app.get('/connect/github', passport.authorize('github-authz'));
	app.get('/connect/github/callback', passport.authorize('github-authz'), redirectToDashboard);
	app.get('/connect/stackexchange', passport.authorize('stackexchange-authz'));
	app.get('/connect/stackexchange/callback', passport.authorize('stackexchange-authz'), redirectToDashboard);

	// local local registration
	app.post('/register', passport.authenticate('local', redirects));
	app.post('/login', passport.authenticate('local', redirects));
	app.post('/setup', firstSetup);

	// stored items (TO DO: add oauth to these requests)
	app.get('/api/items/all', getAll);
	app.get('/api/items/twitter', getTwitter);
	app.get('/api/items/github', getGithub);

	function getAll (req, res) {
		items.getAllItems(req.user._id, function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}

	function getTwitter (req, res) {
		items.getItemsByType(req.user._id, 'twitter', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}

	function getGithub (req, res) {
		items.getItemsByType(req.user._id, 'github', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}

	function firstSetup (req, res) {
		var user = req.user;

		users.accountSetup(user._id, req.body, saveFirstService);

		function saveFirstService (err) {
			if (err) {
				return res.send(500, err);
			}

			// we don't want to store facebook as network (for now at least)
			if (user.provider === 'facebook') {
				return res.send(200);
			}

			nets.saveNetwork(user._id, user, user.token, user.tokenSecret, function (err, user) {
				if (err) {
					return res.send(500, err);
				}
				res.send(200);
			});
		}
	}

	// special callback for networks authorization
	function redirectToDashboard (req, res) {
		res.redirect('/');
	}
};
