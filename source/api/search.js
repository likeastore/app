var middleware = require('../middleware');

function searchService(app) {
	app.get('/api/search',
		middleware.analytics.track('search', {query: 'text'}),
		searchItems);

	function searchItems(req, res, next) {
		res.send(503);
	}

}

module.exports = searchService;
