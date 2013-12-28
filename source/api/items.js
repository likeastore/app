var items = require('../models/items');
var middlware = require('../middleware');
var users = require('../models/users');

function itemsService(app) {
	app.get('/api/items',
		getItems);

	app.get('/api/items/count',
		middlware.access.guest(),
		getItemsCount);

	app.get('/api/items/inbox',
		getInbox);

	app.get('/api/items/inbox/count',
		getInboxCount);

	app.get('/api/items/:type',
		getItemsByType);

	app.del('/api/items/:id',
		hideItem);

	function getItems (req, res, next) {
		items.getAllItems(req.user, req.query.page, function (err, items) {
			if (err) {
				return next({message: 'failed to get items for user', user: req.user, err: err, status: 500});
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

	function getInbox(req, res, next) {
		users.findByEmail(req.user, function (err, user) {
			if (err) {
				return next(err);
			}

			items.getInbox(user.email, user.loginPreviousDate, req.query.page, function (err, items) {
				if (err) {
					return next({message: 'failed to get items inbox', user: req.user, err: err, status: 500});
				}

				res.json(items);
			});
		});
	}

	function getInboxCount(req, res, next) {
		users.findByEmail(req.user, function (err, user) {
			if (err) {
				return next(err);
			}

			items.getInboxCount(user.email, user.loginPreviousDate, req.query.page, function (err, result) {
				if (err) {
					return next({message: 'failed to get items inbox', user: req.user, err: err, status: 500});
				}

				res.json(result);
			});
		});
	}

	function hideItem(req, res, next) {
		items.hideItem(req.user, req.params.id, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}
}

module.exports = itemsService;