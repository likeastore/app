var _ = require('underscore');
var middleware = require('../middleware');

function secureAppRoutes(app, routesToSecure) {
	for (var verb in app.routes) {
		var routes = app.routes[verb];
		routes.forEach(patchRoute);
	}

	function patchRoute (route) {
		var apply = _.any(routesToSecure, function (r) {
			return route.path.indexOf(r) === 0;
		});

		var guestAccess = _.any(route.callbacks, function (r) {
			return r.name === '_guest';
		});

		if (apply && !guestAccess) {
			route.callbacks = applySecurityMiddlware(route.callbacks);
		}
	}

	function applySecurityMiddlware(callbacks) {
		var auth = [middleware.access.authenticatedAccess()];
		return auth.concat(callbacks);
	}
}

module.exports = secureAppRoutes;