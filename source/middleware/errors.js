var logger = require('./../utils/logger');

function logErrors () {
	return function logErrors(err, req, res, next) {
		logger.error({ url: res.req.url, headers: res.req.headers, status: res.statusCode, error: err, stack: err.stack });
		next(err);
	};
}

function logHttpErrors () {
	return function logHttpErrors (req, res, next) {
		var end = res.end;
		res.end = function (data, encoding) {
			res.end = end;
			var status = res.statusCode;
			if (status >= 400) {
				logger.error({url: res.req.url, headers: res.req.headers, status: status, body: req.body, params: req.params });
			}

			res.end (data, encoding);
		};

		next();
	};
}

module.exports = {
	logErrors: logErrors,
	logHttpErrors: logHttpErrors
};