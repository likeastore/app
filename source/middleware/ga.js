var ga = require('../utils/ga');
var logger = require('../utils/logger');

function track(category, action, label, options) {
	return function (req, res, next) {
		var data = {};

		if (options && options.param) {
			data[options.param] = options.property ? req.params[options.param][options.property] : req.params[options.param];
		}

		if (options && options.query) {
			data[options.query] = options.property ? req.query[options.query][options.property] : req.query[options.query];
		}

		if (options && options.request) {
			data[options.request] = options.property ? req[options.request][options.property] : req[options.request];
		}

		ga.trackEvent(category, action, label, data, function (err) {
			if (err) {
				logger.warning({message: 'ga event post error', err: err});
			}
		});

		next();
	};
}

module.exports = {
	track: track
};