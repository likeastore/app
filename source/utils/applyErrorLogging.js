var middleware = require('../middleware');

function applyErrorLogging(app) {
	for (var verb in app.routes) {
		var routes = app.routes[verb];
		routes.forEach(patchRoute);
	}

	function patchRoute (route) {
		route.callbacks.push(middleware.errors.logErrors());
	}
}

module.exports = applyErrorLogging;