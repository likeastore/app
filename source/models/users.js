var async = require('async');
var config = require('../../config');
var db = require('../db')(config);

var ObjectId = require('mongojs').ObjectId;

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
	db.users.findOne({ email: email }, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (!user) {
			return callback({message: 'User not found', status: 404});
		}

		callback(null, user);
	});
}

function findByRequestToken (requestToken, callback) {
	db.users.findOne({ twitterRequestToken: requestToken }, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (!user) {
			return callback({message: 'User not found', status: 404});
		}

		callback(null, user);
	});
}

function updateUser(email, attributes, callback) {
	db.users.findAndModify({
		query: { email: email },
		update: { $set: attributes },
		'new': true
	}, callback);
}

function deactivate(email, callback) {
	var deleteTasks = [
		deleteNetworks,
		deleteItems,
		deleteUser
	];

	async.series(deleteTasks, callback);

	function deleteNetworks(next) {
		db.networks.remove({ 'user': email }, next);
	}

	function deleteItems(next) {
		db.items.remove({ 'user': email }, next);
	}

	function deleteUser(next) {
		db.users.remove({ 'email': email }, next);
	}
}

module.exports = {
	findById: findById,
	findByEmail: findByEmail,
	update: updateUser,
	findByRequestToken: findByRequestToken,
	deactivate: deactivate
};
