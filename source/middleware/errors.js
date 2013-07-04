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

			if (warning(status)) {
				logger.warning(message);
			}

			if (error(status)) {
				logger.error(message);
			}

			end.call (res, data, encoding);
		};

		function warning (status) {
			return status >= 400 && status < 500;
		}

		function error (status) {
			return status >= 500;
		}

		next();
	};
}

module.exports = {
	logErrors: logErrors,
	logHttpErrors: logHttpErrors
};