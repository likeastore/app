var db = require('./dbConnector').db;

function fullTextItemSearch (user, query, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	db.items.runCommand('text', { search: query.toString(), filter: {user: user }}, function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (doc && doc.errmsg) {
			return callback(doc.errmsg);
		}

		var items = doc.results.map(function (result) {
			return result.obj;
		});

		callback(null, { data: items, nextPage: false });
	});
}

module.exports = {
	fullTextItemSearch: fullTextItemSearch
};
