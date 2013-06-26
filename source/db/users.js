var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('./dbConnector').db;

function findById (id, callback) {
	if (typeof id === 'string') {
		id = new ObjectId(id);
	}

	db.users.findOne({ _id: id }, function (err, user) {
		if (err) {
			return callback(err);
		}

		callback(null, user);
	});
}

function findByEmail (email, callback) {
	db.users.findOne({email: email}, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (!user) {
			return callback({message: 'User not found', status: 404});
		}

		callback(null, user);
	});
}

module.exports = {
	findById: findById,
	findByEmail: findByEmail
};
