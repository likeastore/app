var discover = require('../models/discover');

function discoverService(app) {
	app.get('/api/feed',
		getFeed
	);

	function getFeed(req, res, next) {
		discover.feed(req.user, req.query.page, function (err, feed) {
			if (err) {
				return next(err);
			}

			res.json(feed);
		});
	}
}

module.exports = discoverService;
