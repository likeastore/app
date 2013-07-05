var users = require('../db/users.js');
var items = require('../db/items.js');
var networks = require('../db/networks.js');
var logger = require('../utils/logger');
var middleware = require('../middleware');
var createPassport = require('../utils/createPassport');
var OAuth= require('oauth').OAuth;
var config = require('../../config');

function networksService (app) {

	app.get('/api/networks/all', getAllNetworks);

	app.del('/api/networks/:network', deleteNetwork);

	app.post('/api/networks/twitter',
		middleware.networks.twitter(),
		returnAuthUrl
	);

	app.post('/api/networks/github',
		middleware.networks.github(),
		returnAuthUrl
	);

	app.post('/api/networks/stackoverflow',
		middleware.networks.stackoverflow(),
		returnAuthUrl
	);

	app.get('/api/networks/twitter/callback',
		middleware.access.guest(),
		middleware.networks.twitterCallback(),
		registerNetwork,
		redirectToApp);

	app.get('/api/networks/github/callback',
		middleware.access.guest(),
		middleware.networks.githubCallback(),
		registerNetwork,
		redirectToApp);

	app.get('/api/networks/stackoverflow/callback',
		middleware.access.guest(),
		middleware.networks.stackoverflowCallback(),
		registerNetwork,
		redirectToApp);

	function registerNetwork(req, res, next) {
		networks.save(req.network, next);
	}

	function getAllNetworks(req, res) {
		networks.findNetworks(req.user, function (err, nets) {
			if (err) {
				return res.send(500, err);
			}
			res.json(nets);
		});
	}

	function deleteNetwork(req, res) {
		networks.removeNetwork(req.user, req.params.network, function (err) {
			if (err) {
				return res.send(500, err);
			}
			res.send(200);
		});
	}

	function returnAuthUrl(req, res) {
		res.json({authUrl: req.authUrl});
	}

	function redirectToApp(req, res) {
		res.redirect(config.applicationUrl);
	}
}

module.exports = networksService;