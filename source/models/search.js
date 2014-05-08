var config = require('../../config');
var elastic = require('../elastic')(config);

function fullTextItemSearch (user, query, paging, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	var page = paging.page || 1;

	elastic.search({
		index: 'items',
		from: (page - 1) * paging.pageSize,
		size: paging.pageSize,
		body: {
			query: {
				filtered: {
					query: {
						'query_string': {
							query: query
						},
					},
					filter: {
						term: {
							user: user.email
						}
					}
				}
			}
		}
	}, function (err, resp) {
		if (err) {
			return callback(err);
		}

		var items = resp.hits.hits.map(function (hit) {
			return hit._source;
		});

		callback(null, {data: items, nextPage: items.length === paging.pageSize});
	});
}

module.exports = {
	items: fullTextItemSearch
};
