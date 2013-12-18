var inbox = require('../models/inbox');

function inboxService(app) {
	app.get('/api/inbox', getInbox);
	app.post('/api/inbox/viewed', markInboxViewed);

	function getInbox(req, res) {
		res.send(500);
	}

	function markInboxViewed(req, res) {
		res.send(500);
	}
}

module.exports = inboxService;