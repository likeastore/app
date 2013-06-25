var db = require('./dbConnector').db;

exports.getAllItems = function (userId, callback) {
	db.items.find({ userId: userId }).sort({date: -1}, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
};

exports.getItemsByType = function (userId, type, callback) {
	db.items.find({ userId: userId, type: type }).sort({ date: -1 }, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
};
