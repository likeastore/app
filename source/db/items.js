var db = require('./dbConnector').db;

exports.getAllItems = function (user, callback) {
	db.items.find({ user: user }).sort({date: -1}, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
};

exports.getItemsByType = function (user, type, callback) {
	db.items.find({ user: user, type: type }).sort({ date: -1 }, function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, items);
	});
};
