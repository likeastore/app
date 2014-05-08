var config = require('../../config');

function paging() {
	return function (req, res, next) {
		req.paging = req.paging || {};

		req.paging.page = req.query.page;
		req.paging.pageSize = req.query.pageSize || config.app.pageSize;

		if (req.paging.pageSize > 256) {
			return next({message: 'page size > 256 is not allowed', pageSize: req.paging.pageSize, status: 412});
		}

		next();
	};
}

module.exports = paging;