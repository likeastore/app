var config = require('../../config');
var db = require('../db')(config);

exports.findOne = function (query, callback) {
	return db.subscribers.findOne(query, callback);
};
