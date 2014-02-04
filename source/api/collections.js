var collections = require('../models/collections');
var middleware = require('../middleware');

function collectionsService(app) {
	app.get('/api/collections',
		getCollections);

	app.post('/api/collections',
		middleware.validate('collection'),
		createCollection);

	function getCollections(req, res, next) {
		res.send(200);
	}

	function createCollection(req, res, next) {
		collections.create(req.body, function (err, collection) {
			if (err) {
				return next(err);
			}

			res.json(collection, 201);
		});
	}
}

module.exports = collectionsService;