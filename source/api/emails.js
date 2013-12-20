var emails = require('../models/emails');

function emailsService(app) {
	app.post('/api/emails/share',
		validate,
		sendShareEmail);

	function validate(req, res, next) {
		var email = req.body;

		if (!email.to) {
			return next({message: 'missing "to" field', status: 412});
		}

		if (!email.message) {
			return next({message: 'missing "message" field', status: 412});
		}

		if (!email.from) {
			return next({message: 'missing "from" field', status: 412});
		}

		if (!email.username) {
			return next({message: 'missing "username" field', status: 412});
		}

		next();
	}

	function sendShareEmail(req, res, next) {
		var email = {email: req.body.to};
		var merge = [
			{name: 'FROM', content: req.body.from},
			{name: 'USERNAME', content: req.body.username},
			{name: 'MESSAGE', content: req.body.message}
		];

		emails.sendTemplate([email], 'share-with-friend', merge, function (err) {
			if (err) {
				return next({message: 'failed to send email', user: req.user, err: err, status: 500});
			}

			res.send(201);
		});
	}
}

module.exports = emailsService;