var feed = require('../models/feed');

function feedService(app) {
	app.get('/api/feed',
		getFeed
	);

	function getFeed(req, res, next) {
		feed.forUser(req.user, req.query.page, function (err, feed) {
			if (err) {
				return next(err);
			}

			res.json(feed);
		});
	}
}

module.exports = feedService;
