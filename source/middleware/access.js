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
		if (cookies['likeastore_invite_id']) {
			return next ();
		}

		res.send(401);
	};
}

module.exports = {
	authenticated: authenticated,
	guest: guest,
	invite: invite
};