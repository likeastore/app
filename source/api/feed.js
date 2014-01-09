var feed = require('../models/feed');

function feedService (app) {

	app.get('/api/feed',
		getUsersFeed);

	function getUsersFeed(req, res, next) {
		feed.getForUser(req.user, function (err, data) {
			res.json(data);
		});
	}
}

module.exports = feedService;