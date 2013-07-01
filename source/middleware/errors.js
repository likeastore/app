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
			if (status >= 400 || req.unhandledError) {
				logger.error({
					url: res.req.url,
					headers: res.req.headers,
					status: status,
					body: req.body,
					params: req.params,
					error: req.unhandledError
				});
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