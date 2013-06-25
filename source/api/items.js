var users = require('../db/users.js');
var items = require('../db/items.js');
var nets = require('../db/networks.js');
var logger = require('../utils/logger');

function itemsService (app) {
	app.get('/api/items/all', getAllItems);
	app.get('/api/items/twitter', getTwitterItems);
	app.get('/api/items/github', getGithubItems);
	app.get('/api/items/stackoverflow', getStackoverflowItems);

	function getAllItems (req, res) {
		items.getAllItems(req.user._id, function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}

	function getTwitterItems (req, res) {
		items.getItemsByType(req.user._id, 'twitter', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}

	function getGithubItems (req, res) {
		items.getItemsByType(req.user._id, 'github', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}

	function getStackoverflowItems (req, res) {
		items.getItemsByType(req.user._id, 'stackoverflow', function (err, items) {
			if (err) {
				return res.send(500, err);
			}
			res.json(items);
		});
	}
}

module.exports = itemsService;