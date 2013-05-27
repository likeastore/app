var logger = require('./../utils/logger');

function logErrors () {
	return function logErrors(err, req, res, next) {
		logger.info({ url: res.req.url, headers: res.req.headers, status: res.statusCode, error: err, stack: err.stack });
		next();
	};
}

module.exports = {
	logErrors: logErrors
};