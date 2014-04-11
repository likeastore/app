var config = require('../../config');
var db = require('../db')(config);

function fullTextItemSearch (user, query, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	db.items.runCommand('text', { search: query.toString(), filter: {user: user.email }}, function (err, doc) {
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
	items: fullTextItemSearch
};
