var analytics = require('../utils/analytics');
var logger = require('../utils/logger');

function track(event, data) {
	return function (req, res, next) {
		analytics(event, data, function (err) {
			if (err) {
				logger.error({message: 'analytics event post error', err: err});
			}
		});

		next();
	};
}

module.exports = {
	track: track
};