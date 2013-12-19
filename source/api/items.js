var items = require('../models/items');
var middlware = require('../middleware');

function itemsService (app) {
	app.get('/api/items',
		getItems);

	app.get('/api/items/count',
		middlware.access.guest(),
		getItemsCount);

	app.get('/api/items/:type',
		getItemsByType);

	function getItems (req, res, next) {
		items.getAllItems(req.user, req.query.page, function (err, items) {
			if (err) {
				return next({message: 'failed to get items for user', user: req.user, error: err, status: 500});
			}

			res.json(items);
		});
	}

	function getItemsCount(req, res, next) {
		items.getItemsCount(function (err, count) {
			if (err) {
				return next({message: 'failed to get items count', err: err, status: 500});
			}

			res.json(count);
		});
	}

	function getItemsByType (req, res, next) {
		var type = req.params.type;
		items.getItemsByType(req.user, type, req.query.page, function (err, items) {
			if (err) {
				return next({message: 'failed to get items for user by type', user: req.user, type: type, error: err, status: 500});
			}

			res.json(items);
		});
	}
}

module.exports = itemsService;
