var moment = require('moment');

var config = require('../../config');
var db = require('../db')(config);
var networks = require('./networks');

var pageSize = 30;

var itemsCountCache;
var itemsCountCacheTTL = 5;

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

function getAllItems(user, page, callback) {
	ensureNetworksEnabled(user, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		var query = db.items.find({ user: user.email, hidden: {$exists: false}, type: {$in: enabled} }).limit(pageSize);
		if (page) {
			query = query.skip(pageSize * (page - 1));
		}

		query.sort({ created: -1 }, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback(err);
			}

			callback(null, {data: items, nextPage: items.length === pageSize});
		}
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

function getItemsByType(user, type, page, callback) {
	ensureNetworkEnabled(user, type, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		if (!enabled) {
			return callback({message: 'network disabled for user', status: 404});
		}

		var query = db.items.find({ user: user.email, type: type, hidden: {$exists: false} }).limit(pageSize);
		if (page) {
			query = query.skip(pageSize * (page - 1));
		}

		query.sort({ created: -1 }, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback(err);
			}

			callback(null, {data: items, nextPage: items.length === pageSize});
		}
	});
}

function getInbox(user, page, callback) {
	ensureNetworksEnabled(user, function (err, enabled) {
		if (err) {
			return callback(err);
		}

		var criteria = {user: user.email, hidden: {$exists: false}, type: {$in: enabled}};
		if (user.loginPreviousDate) {
			criteria.date = { $gt: user.loginPreviousDate };
		}

		var query = db.items.find(criteria).limit(pageSize);
		if (page) {
			query = query.skip(pageSize * (page - 1));
		}

		query.sort({ created: -1 }, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback(err);
			}

			callback(null, {data: items, nextPage: items.length === pageSize});
		}
	});
}

function getInboxCount(user, page, callback) {
	var criteria = {user: user.email, hidden: {$exists: false}};
	if (user.loginPreviousDate) {
		criteria.date = { $gt: user.loginPreviousDate };
	}

	db.items.find(criteria).count(function (err, count) {
		if (err) {
			return callback(err);
		}

		callback(null, {count: count});
	});
}

function hideItem(user, id, callback) {
	db.items.findAndModify({
		query: {_id: new db.ObjectId(id), user: user.email},
		update: {$set: {hidden: true}},
		'new': true
	}, callback);
}

module.exports = {
	getAllItems: getAllItems,
	getItemsByType: getItemsByType,
	getInbox: getInbox,
	getInboxCount: getInboxCount,
	getItemsCount: getItemsCount,
	hideItem: hideItem
};