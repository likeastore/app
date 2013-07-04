var logger = require('./../utils/logger');

function logErrors () {
	return function logErrors(err, req, res, next) {
		req.unhandledError = err;

		next(err);
	};
}

function logHttpErrors () {
	return function logHttpErrors (req, res, next) {
		var end = res.end;
		res.end = function (data, encoding) {
			var status = res.statusCode;
			var message = {
				url: res.req.url,
				headers: res.req.headers,
				status: status,
				body: req.body,
				params: req.params
			};

			if (req.unhandledError) {
				message.error = req.unhandledError;
			}

			if (status >= 400) {
				logger.warning(message);
			} else if (status >= 500) {
				logger.error(message);
			}

			end.call (res, data, encoding);
		};

		next();
	};
}

module.exports = {
	logErrors: logErrors,
	logHttpErrors: logHttpErrors
};