/**
 * API module
 */

var users = require('./db/users.js');
var items = require('./db/items.js');
var nets = require('./db/networks.js');
var logger = require('./utils/logger');

module.exports = function (app, passport) {

	var getAllItems = function (req, res) {
		logger.info({message: 'requesting all items', user: req.user});

		items.getAllItems(req.user._id, function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	};

	var getTwitterItems = function (req, res) {
		logger.info({message: 'requesting twitter items', user: req.user});

		items.getItemsByType(req.user._id, 'twitter', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	};

	var getGithubItems = function (req, res) {
		logger.info({message: 'requesting github items', user: req.user});

		items.getItemsByType(req.user._id, 'github', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	};

	var getStackoverflowItems = function (req, res) {
		logger.info({message: 'requesting stackoverflow items', user: req.user});

		items.getItemsByType(req.user._id, 'stackoverflow', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	};

	var getUser = function (req, res) {
		logger.info({message: 'requesting user', user: req.user});

		users.findById(req.user._id, function (err, user) {
			if (err) {
				return res.send(500, err);
			}
			res.json(user);
		});
	};

	var getAllNetworks = function (req, res) {
		logger.info({message: 'requesting networks', user: req.user});

		nets.findNetworksByUserId(req.user._id, function (err, nets) {
			if (err) {
				return res.send(500, err);
			}
			res.json(nets);
		});
	};

	var deleteNetwork = function (req, res) {
		nets.removeNetworkByUserId(req.user._id, req.params.network, function (err) {
			if (err) {
				return res.send(500, err);
			}
			res.send(200);
		});
	};

	var redirectToDashboard = function (req, res) {
		res.redirect('/');
	};

	app.get('/connect/twitter', passport.authorize('twitter-authz'));
	app.get('/connect/twitter/callback', passport.authorize('twitter-authz'), redirectToDashboard);
	app.get('/connect/github', passport.authorize('github-authz'));
	app.get('/connect/github/callback', passport.authorize('github-authz'), redirectToDashboard);
	app.get('/connect/stackoverflow', passport.authorize('stackexchange-authz'));
	app.get('/connect/stackoverflow/callback', passport.authorize('stackexchange-authz'), redirectToDashboard);

	// stored items (TO DO: add oauth to these requests)
	app.get('/api/user', getUser);
	app.get('/api/items/all', getAllItems);
	app.get('/api/items/twitter', getTwitterItems);
	app.get('/api/items/github', getGithubItems);
	app.get('/api/items/stackoverflow', getStackoverflowItems);
	app.get('/api/networks/all', getAllNetworks);
	app.del('/api/network/:id', deleteNetwork);

};
