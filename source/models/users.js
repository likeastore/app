var async = require('async');
var moment = require('moment');

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

function follow(user, followId, callback) {
	if (!followId || typeof followId !== 'string') {
		return callback({message: 'bad follow user id', status: 412});
	}

	db.users.findOne({_id: new ObjectId(followId)}, function (err, followUser) {
		if (err) {
			return callback(err);
		}

		if (!followUser) {
			return callback({message: 'follow user not found', id: followId, status: 404});
		}

		var follows = {id: followUser._id, email: followUser.email, date: moment().toDate() };
		var followed = {id: user._id, email: user.email, date: moment().toDate() };

		var updateFollowing =  update({email: user.email}, {follows: follows});
		var updateFollowers = update({email: followUser.email}, {followed: followed});

		async.parallel([updateFollowing, updateFollowers], callback);
	});

	function update(query, push) {
		return function (callback) {
			db.users.findAndModify({
				query: query,
				update: {$push: push},
			}, callback);
		};
	}
}

function unfollow(user, followId, callback) {
	if (!followId || typeof followId !== 'string') {
		return callback({message: 'bad follow user id', status: 412});
	}

	db.users.findOne({_id: new ObjectId(followId)}, function (err, followUser) {
		if (err) {
			return callback(err);
		}

		if (!followUser) {
			return callback({message: 'follow user not found', id: followId, status: 404});
		}

		var updateFollowing =  update({email: user.email}, {follows: { id: followUser._id }});
		var updateFollowers = update({email: followUser.email}, {followed: {id: user._id }});

		async.parallel([updateFollowing, updateFollowers], callback);

	});

	function update(query, pull) {
		return function (callback) {
			db.users.findAndModify({
				query: query,
				update: {$pull: pull},
			}, callback);
		};
	}

}

module.exports = {
	findById: findById,
	findByEmail: findByEmail,
	findByRequestToken: findByRequestToken,

	update: updateUser,
	deactivate: deactivate,

	follow: follow,
	unfollow: unfollow
};
