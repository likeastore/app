var histo = require('../models/history');

function historyService (app) {

	app.get('/api/history',
		getUsersFeed
	);

	function getUsersFeed(req, res, next) {
		histo.getForUser(req.user, function (err, data) {
			res.json(data);
		});
	}
}

module.exports = historyService;