var inbox = require('../models/inbox');

function inboxService(app) {
	app.get('/api/inbox',
		getInbox);

	app.post('/api/inbox/viewed',
		markInboxViewed);

	function getInbox(req, res, next) {
		inbox.getUserInbox(req.user, function (err, items) {
			if (err) {
				return next({message: 'failed to get inbox for user', user: req.user, err: err, status: 500});
			}

			res.json(items);
		});
	}

	function markInboxViewed(req, res, next) {
		inbox.viewedByUser(req.user, function (err, user) {
			if (err) {
				return next({message: 'failed to update inbox viewed', user: req.user, err: err, status: 500});
			}

			res.send(201);
		});
	}
}

module.exports = inboxService;