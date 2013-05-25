function noCacheMiddleware(options) {
	return function noCache(req, res, next) {
		var isException;
		if (/^api/.test(req.url)) {
			isException = false; //never cache anything in /api
		} else if (options && options.exceptions) {
			isException = options.exceptions.some(function (regExp) {
				return regExp.test(req.url);
			});
		}
		if (isException) {
			var oneYearSeconds = 60 * 60 * 24 * 365;
			var onYearMilliseconds = oneYearSeconds * 1000;
			res.header('Cache-control', 'public, max-age=' + oneYearSeconds);
			res.header('Expires', new Date(Date.now() + onYearMilliseconds).toUTCString());
			return next();
		}
		res.setHeader('Cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
		res.setHeader('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT');
		return next();
	};
}

module.exports = noCacheMiddleware;