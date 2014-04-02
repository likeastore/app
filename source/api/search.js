var search = require('../models/search');
var middleware = require('../middleware');

function searchService(app) {
	app.get('/api/search',
		middleware.analytics.track('search', {query: 'text'}),
		searchItems);

	app.get('/api/search/collection',
		middleware.analytics.track('search collection', {query: 'text'}),
		searchCollections);

	function searchItems(req, res, next) {
		var query = req.query.text;

		search.items(req.user, query, function (err, items) {
			if (err) {
				return next({message: 'failed to search items', user: req.user, query: query, err: err, status: 500});
			}

			res.json(items);
		});
	}

	function searchCollections(req, res, next) {
		var query = req.query.text;

		search.collections(req.user, query, function (err, collections) {
			if (err) {
				return next({message: 'failed to search collections', user: req.user, query: query, err: err, status: 500});
			}

			res.json(collections);
		});
	}
}

module.exports = searchService;
