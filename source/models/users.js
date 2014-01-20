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

function findByRequestToken (tokenName, tokenValue, callback) {
	var query = {};
	query[tokenName] = tokenValue;

	db.users.findOne(query, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (!user) {
			return callback({message: 'User not found', status: 404});
		}

		callback(null, user);
	});
}

function updateUser(user, attributes, callback) {
	db.users.findAndModify({
		query: { email: user.email },
		update: { $set: attributes },
		'new': true
	}, callback);
}

function deactivate(user, callback) {
	var deleteTasks = [
		deleteNetworks,
		deleteItems,
		deleteUser
	];

	async.series(deleteTasks, callback);

	function deleteNetworks(next) {
		db.networks.remove({ 'user': user.email }, next);
	}

	function deleteItems(next) {
		db.items.remove({ 'user': user.email }, next);
	}

	function deleteUser(next) {
		db.users.remove({ 'email': user.email }, next);
	}
}

module.exports = {
	findById: findById,
	findByEmail: findByEmail,
	update: updateUser,
	findByRequestToken: findByRequestToken,
	deactivate: deactivate
};
