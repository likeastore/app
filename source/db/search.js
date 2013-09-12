var db = require('./dbConnector').db;

db.items.ensureIndex(
	{ description: 'text', authorName: 'text', repo: 'text' },
	{ name: 'ItemsTextIndex' }
);

function fullTextItemSearch (user, query, callback) {
	if (!query) {
		return callback(null, []);
	}

	db.items.runCommand('text', { search: query.toString() }, function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (doc && doc.errmsg) {
			return callback(doc.errmsg);
		}

		var items = [];
		doc.results.forEach(function (row, i) {
			if (row.obj.user === user) {
				items.push(row.obj);
			}
		});

		callback(null, { data: items, nextPage: false });
	});
}

module.exports = {
	fullTextItemSearch: fullTextItemSearch
};