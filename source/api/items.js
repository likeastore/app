var users = require('../db/users.js');
var items = require('../db/items.js');
var nets = require('../db/networks.js');
var logger = require('../utils/logger.js');

function itemsService (app) {
	app.get('/api/items',
		getItems);

	app.get('/api/items/:type',
		getItemsByType);

	function getItems (req, res, next) {
		items.getAllItems(req.user, function (err, items) {
			if (err) {
				return next({message: 'failed to get items for user', user: req.user, error: err, status: 500});
			}

			res.json(items);
		});
	}

	function getItemsByType (req, res, next) {
		var type = req.params.type;

		items.getItemsByType(req.user, type, function (err, items) {
			if (err) {
				return next({message: 'failed to get items for user by type', user: req.user, type: type, error: err, status: 500});
			}

			res.json(items);
		});
	}
}

module.exports = itemsService;
