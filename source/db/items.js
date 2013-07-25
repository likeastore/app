var db = require('./dbConnector').db;

function getAllItems(user, callback) {
	db.items.find({ user: user }).sort({ createdDate: -1 }, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
}

function getItemsByType(user, type, callback) {
	db.items.find({ user: user, type: type }).sort({ createdDate: -1 }, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
}

module.exports = {
	getAllItems: getAllItems,
	getItemsByType: getItemsByType
};
