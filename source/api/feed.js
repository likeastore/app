var feed = require('../models/feed');
var middleware = require('../middleware');

function feedService(app) {
	app.get('/api/feed',
		middleware.paging(),
		getFeed
	);

	function getFeed(req, res, next) {
		feed.forUser(req.user, req.query, req.paging, function (err, feed) {
			if (err) {
				return next(err);
			}

			res.json(feed);
		});
	}
}

module.exports = feedService;
