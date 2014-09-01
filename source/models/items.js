var _ = require('underscore');
var moment = require('moment');
var async = require('async');

var config = require('../../config');
var db = require('../db')(config);
var networks = require('./networks');

var ObjectId = require('mongojs').ObjectId;

var itemsCountCache;
var itemsCountCacheTTL = 5;

var userPickFields = ['_id', 'avatar', 'bio', 'displayName', 'email', 'location', 'name', 'username', 'website'];

function transform(item) {
	var clone = _.clone(item);
	if (clone.userData) {
		clone.userData = _.pick(clone.userData, userPickFields);
	}

	clone.commentsCount = (item.comments && item.comments.length) || 0;

	return clone;
}

function ensureNetworkEnabled(user, type, callback) {
	networks.findNetworks(user, function (err, networks) {
		if (err) {
			return callback(err);
		}

		var findByType = function (network) {
			return network.service === type;
		};

		callback(null, networks.some(findByType));
	});
}

function ensureNetworksEnabled(user, callback) {
	networks.findNetworks(user, function (err, networks) {
		if (err) {
			return callback(err);
		}

		var enabled = networks.map(function (network) {
			return network.service;
		});

		callback(null, enabled);
	});
}

function getAllItems(user, paging, callback) {
	ensureNetworksEnabled(user, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		var query = db.items.find({ user: user.email, hidden: {$exists: false}, type: {$in: enabled} }).limit(paging.pageSize);
		if (paging.page) {
			query = query.skip(paging.pageSize * (paging.page - 1));
		}

		query.sort({ created: -1 }, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback(err);
			}

			callback(null, {data: items, nextPage: items.length === paging.pageSize});
		}
	});
}

function getById(user, id, callback) {
	db.items.findOne({_id: new ObjectId(id)}, function (err, item) {
		if (err) {
			return callback(err);
		}

		callback(null, item);
	});
}

function getItemsCount(callback) {
	if (!itemsCountCache) {
		return countAndCache(callback);
	}

	if (moment().diff(itemsCountCache.date, 'minutes') <= itemsCountCacheTTL) {
		return callback(null, itemsCountCache.count);
	}

	return countAndCache(callback);

	function countAndCache(callback) {
		db.items.count(function (err, count) {
			if (err) {
				return callback(err);
			}

			itemsCountCache = {count: count, date: moment() };

			callback(null, count);
		});
	}
}

function getItemsByType(user, type, paging, callback) {
	ensureNetworkEnabled(user, type, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		if (!enabled) {
			return callback({message: 'network disabled for user', status: 404});
		}

		var query = db.items.find({ user: user.email, type: type, hidden: {$exists: false} }).limit(paging.pageSize);
		if (paging.page) {
			query = query.skip(paging.pageSize * (paging.page - 1));
		}

		query.sort({ created: -1 }, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback(err);
			}

			callback(null, {data: items, nextPage: items.length === paging.pageSize});
		}
	});
}

function getInbox(user, paging, callback) {
	ensureNetworksEnabled(user, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		var criteria = {user: user.email, hidden: {$exists: false}, read: {$exists: false}, type: {$in: enabled}};
		if (user.loginPreviousDate) {
			criteria.date = { $gt: user.loginPreviousDate };
		}

		var query = db.items.find(criteria).limit(paging.pageSize);
		if (paging.page) {
			query = query.skip(paging.pageSize * (paging.page - 1));
		}

		query.sort({ created: -1 }, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback(err);
			}

			callback(null, {data: items, nextPage: items.length === paging.pageSize});
		}
	});
}

function getInboxCount(user, callback) {
	ensureNetworksEnabled(user, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		var criteria = {user: user.email, hidden: {$exists: false}, read: {$exists: false}, type: {$in: enabled}};
		if (user.loginPreviousDate) {
			criteria.date = { $gt: user.loginPreviousDate };
		}

		db.items.find(criteria).count(function (err, count) {
			if (err) {
				return callback(err);
			}

			callback(null, {count: count});
		});
	});
}

function hideItem(user, id, callback) {
	db.items.findAndModify({
		query: {_id: new ObjectId(id), user: user.email},
		update: {$set: {hidden: true}},
		'new': true
	}, callback);
}

function flagItem(user, id, reason, callback) {
	var userData = {
		id: user._id,
		email: user.email,
		reportedAt: new Date(),
		reason: reason
	};

	db.items.findAndModify({
		query: {_id: new ObjectId(id), user: user.email},
		update: {$push: {flaggedBy: userData}},
		'new': true
	}, callback);
}

function readItem(user, id, callback) {
	db.items.findAndModify({
		query: {_id: new db.ObjectId(id), user: user.email},
		update: {$set: {read: true}},
		'new': true
	}, callback);
}

function postComment(user, id, comment, callback) {
	if (!comment.message) {
		return callback({message: 'missing message', status: 412});
	}

	comment = _.extend(comment, {date: moment().toDate(), user: _.pick(user, userPickFields)});

	db.items.findAndModify({
		query: {_id: new ObjectId(id)},
		update: {$push: {comments: comment}},
		'new': true
	}, function (err, item) {
		if (err) {
			return callback(err);
		}

		// inc comment count in collections
		async.each(item.collections, function (collection, callback) {
			db.collections.update({_id: collection.id, 'items._id': new ObjectId(id)}, {$inc: {'items.$.commentsCount': 1}}, {multi: true}, callback);
		}, function (err, results) {
			if (err) {
				return callback(err);
			}

			callback(null, comment);
		});
	});
}

module.exports = {
	getAllItems: getAllItems,
	getById: getById,
	getItemsByType: getItemsByType,
	getInbox: getInbox,
	getInboxCount: getInboxCount,
	getItemsCount: getItemsCount,
	hideItem: hideItem,
	flagItem: flagItem,
	readItem: readItem,
	postComment: postComment,
	transform: transform
};
