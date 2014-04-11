var search = require('../models/search');
var middleware = require('../middleware');

function searchService(app) {
	app.get('/api/search',
		middleware.analytics.track('search', {query: 'text'}),
		searchItems);

	function searchItems(req, res, next) {
		var query = req.query.text;

		search.items(req.user, query, function (err, items) {
			if (err) {
				return next({message: 'failed to search items', user: req.user, query: query, err: err, status: 500});
			}

			res.json(items);
		});
	}

}

module.exports = searchService;
