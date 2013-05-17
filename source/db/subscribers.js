var db = require('./dbConnector').db;

module.exports = {
	findOne: function (query, callback) {
		return db.subscribers.findOne(query, callback);
	}
};