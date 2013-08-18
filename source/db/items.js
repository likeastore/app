var db = require('./dbConnector').db;

// setup full-text on search fields
db.items.ensureIndex({ description: 'text' });

function getAllItems (user, callback) {
	db.items.find({ user: user }).sort({ created: -1 }, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
}

function getItemsByType (user, type, callback) {
	db.items.find({ user: user, type: type }).sort({ created: -1 }, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
}

function getItemsByQuery (user, query, callback) {
	db.items.runCommand('text', { search: query.toString() }, function (err, doc) {
		if (err) {
			return callback(err);
		}

		var items = [];
		doc.results.forEach(function (row, i) {
			if (row.user === user.email) {
				items.push(row.obj);
			}
		});

		callback(null, items);
	});
}

module.exports = {
	getAllItems: getAllItems,
	getItemsByType: getItemsByType,
	getItemsByQuery: getItemsByQuery
};
