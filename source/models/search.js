var config = require('../../config');
var elastic = require('../elastic')(config);

var pageSize = 30;

function fullTextItemSearch (user, query, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	elastic.search({
		index: 'items',
		size: pageSize,
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

		callback(null, {data: items, nextPage: items.length === pageSize});
	});
}

module.exports = {
	items: fullTextItemSearch
};
