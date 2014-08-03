var middleware = require('../middleware');
var search = require('../models/search');

function searchService(app) {
	app.get('/api/search2',
		middleware.analytics.track('search', {query: 'text'}),
		middleware.paging(),
		advancedSearch);

	function advancedSearch(req, res, next) {
		search.advanced(req.user, req.query, req.paging, function (err, results) {
			if (err) {
				return next(err);
			}

			res.json(results);
		});
	}
}

module.exports = searchService;
