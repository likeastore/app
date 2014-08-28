var middleware = require('../middleware');
var search = require('../models/search');

function searchService(app) {
	app.get('/api/search',
		middleware.analytics.track('search', {query: 'text'}),
		middleware.paging(),
		advancedSearch);

	app.get('/api/search/collections',
		middleware.analytics.track('search collections', {query: 'text'}),
		middleware.paging(),
		searchCollections);

	function advancedSearch(req, res, next) {
		search.advanced(req.user, req.query, req.paging, function (err, results) {
			if (err) {
				return next(err);
			}

			res.json(results);
		});
	}

	function searchCollections(req, res, next) {
		search.collections(req.user, req.query, req.paging, function (err, results) {
			if (err) {
				return next(err);
			}

			res.json(results);
		});
	}
}

module.exports = searchService;
