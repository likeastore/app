var db = require('./dbConnector').db;

exports.findOne = function (query, callback) {
	return db.subscribers.findOne(query, callback);
};
