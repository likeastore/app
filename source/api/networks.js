var users = require('../db/users.js');
var items = require('../db/items.js');
var nets = require('../db/networks.js');
var logger = require('../utils/logger');

function networksService (app) {
	app.get('/api/networks/all', getAllNetworks);
	app.del('/api/network/:id', deleteNetwork);

	function getAllNetworks(req, res) {
		nets.findNetworksByUserId(req.user._id, function (err, nets) {
			if (err) {
				return res.send(500, err);
			}
			res.json(nets);
		});
	}

	function deleteNetwork(req, res) {
		nets.removeNetworkByUserId(req.user._id, req.params.network, function (err) {
			if (err) {
				return res.send(500, err);
			}
			res.send(200);
		});
	}
}

module.exports = networksService;