var inbox = require('../models/inbox');

function inboxService(app) {
	app.get('/api/inbox',
		getInbox);

	app.post('/api/inbox/viewed',
		markInboxViewed);

	function getInbox(req, res, next) {
		res.json({data: []});
		// inbox.getUserInbox(req.user, function (err, items) {
		// 	if (err) {
		// 		return next({message: 'failed to get inbox for user', user: req.user, err: err, status: 500});
		// 	}

		// 	res.json(items);
		// });
	}

	function markInboxViewed(req, res) {
		res.send(500);
	}
}

module.exports = inboxService;