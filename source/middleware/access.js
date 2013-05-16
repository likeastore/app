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

module.exports = {
	authenticated: authenticated,
	guest: guest
};