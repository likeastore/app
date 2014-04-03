var collections = require('../models/collections');
var middleware = require('../middleware');

function collectionsService(app) {
	app.get('/api/collections',
		getCollections);

	app.get('/api/collections/user/:name',
		getUsersCollections);

	app.get('/api/collections/:collection',
		getCollection);

	app.post('/api/collections',
		middleware.validate('collection'),
		createCollection);

	app.del('/api/collections/:id',
		removeCollection);

	app.put('/api/collections/:collection/items/:item',
		putToCollection);

	app.del('/api/collections/:collection/items/:item',
		removeFromCollection);

	app.get('/api/collections/:id/items',
		getCollectionItems);

	app.patch('/api/collections/:id',
		middleware.validate('collectionPatch'),
		patchCollectionProperties);

	app.put('/api/collections/:collection/follow',
		middleware.analytics.track('collection followed'),
		followCollection);

	app.del('/api/collections/:collection/follow',
		middleware.analytics.track('collection unfollowed'),
		unfollowCollection);

	function getCollections(req, res, next) {
		collections.find(req.user, function (err, collections) {
			if (err) {
				return next(err);
			}

			res.json(collections);
		});
	}

	function getUsersCollections(req, res, next) {
		collections.findByUser(req.params.name, function (err, collections) {
			if (err) {
				return next(err);
			}

			res.json(collections);
		});
	}

	function getCollection(req, res, next) {
		collections.findOne(req.user, req.params.collection, function (err, collection) {
			if (err) {
				return next(err);
			}

			if (!collection) {
				return next({message: 'collection not found', status: 404});
			}

			res.json(collection);
		});
	}

	function createCollection(req, res, next) {
		collections.create(req.user, req.body, function (err, collection) {
			if (err) {
				return next(err);
			}

			res.json(collection, 201);
		});
	}

	function removeCollection(req, res, next) {
		collections.remove(req.user, req.params.id, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}

	function putToCollection(req, res, next) {
		var collection = req.params.collection;
		var item = req.params.item;

		collections.addItem(req.user, collection, item, function (err) {
			if (err) {
				return next(err);
			}

			res.send(201);
		});
	}

	function removeFromCollection(req, res, next) {
		var collection = req.params.collection;
		var item = req.params.item;

		collections.removeItem(req.user, collection, item, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}

	function getCollectionItems(req, res, next) {
		collections.findItems(req.user, req.params.id, function (err, items) {
			if (err) {
				return next(err);
			}

			res.json(items);
		});
	}

	function patchCollectionProperties(req, res, next) {
		collections.update(req.user, req.params.id, req.body, function (err, collection) {
			if (err) {
				return next(err);
			}

			res.json(collection);
		});
	}

	function followCollection(req, res, next) {
		collections.follow(req.user, req.params.collection, function (err) {
			if (err) {
				return next(err);
			}

			res.send(201);
		});
	}

	function unfollowCollection(req, res, next) {
		collections.unfollow(req.user, req.params.collection, function (err) {
			if (err) {
				return next(err);
			}

			res.send(200);
		});
	}
}

module.exports = collectionsService;