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
	app.del('/api/network/:id', deleteNetwork);

	app.post('/api/networks/twitter',
		middleware.networks.twitter());

	app.get('/api/networks/twitter/callback',
		middleware.access.guest(),
		middleware.networks.twitterCallback(),
		registerNetwork,
		returnOk);

	app.post('/api/networks/github',
		middleware.networks.github());

	app.get('/api/networks/github/callback',
		middleware.access.guest(),
		middleware.networks.githubCallback(),
		registerNetwork,
		returnOk);

	function registerNetwork(req, res, next) {
		var network = req.network;
		networks.save(network, next);
	}

	function returnOk(req, res, next) {
		res.send(200);
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
}

module.exports = networksService;