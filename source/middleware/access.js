var subscribers = require('./../db/subscribers');

function authenticated () {
	return function (req, res, next) {
		if (req.isAuthenticated() || req.role === 'guest') {
			return next();
		}
		res.redirect('/welcome');
	};
}

function guest () {
	return function (req, res, next) {
		req.role === 'guest';
		return next();
	};
}

function invite () {
	return function (req, res, next) {
		var cookies = req.cookies;
		var inviteId = req.cookies['likeastore_invite_id'];
		if (!inviteId) {
			console.log('no inviteId in cookies');
			return res.send(401);
		}

		console.log(typeof inviteId);

		subscribers.findOne({inviteId: inviteId}, function (err, subscription) {
			if (err || !subscription || !subscription.activated) {
				console.log('not find subscription by id' + err);
				return res.send(401);
			}

			return next();
		});
	};
}

module.exports = {
	authenticated: authenticated,
	guest: guest,
	invite: invite
};