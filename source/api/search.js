var search = require('../db/search.js');
var logger = require('../utils/logger.js');

function searchService (app) {
	app.get('/api/search',
		searchItemsByText);

	function searchItemsByText (req, res, next) {
		var query = req.query.text;

		search.fullTextItemSearch(req.user, query, function (err, items) {
			if (err) {
				return next({message: 'failed to search items for user by query', user: req.user, query: query, error: err, status: 500});
			}

			res.json(items);
		});
	}
}

module.exports = searchService;
