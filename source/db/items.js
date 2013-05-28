var db = require('./dbConnector').db;

function getAllItems (userId, callback) {
	db.items.find({ userId: userId.toString() }).sort({date: -1}, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
}

function getItemsByType (userId, type, callback) {
	db.items.find({ userId: userId.toString(), type: type }).sort({date: -1}, function (err, items) {
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