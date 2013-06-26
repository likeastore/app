var _ = require('underscore');

function getGuestRoutes(app) {
	var guestRoutes = _.chain(app.routes)
		.values()
		.map(function (a) { return a; })
		.flatten()
		.reduce(function (memo, route) {

			var hasGuestMiddleware = _.any(route.callbacks, function (callback) {
				return callback.name === '_guest';
			});

			if (hasGuestMiddleware) {
				memo.push(route);
			}
			return memo;
		}, [])
		.value();

	return guestRoutes;
}

module.exports = getGuestRoutes;