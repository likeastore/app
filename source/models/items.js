var moment = require('moment');

var config = require('../../config');
var db = require('../db')(config);

var pageSize = 30;

var itemsCountCache;
var itemsCountCacheTTL = 5;

function getAllItems(user, page, callback) {
	var query = db.items.find({ user: user, hidden: {$exists: false} }).limit(pageSize);
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
	var query = db.items.find({ user: user, type: type, hidden: {$exists: false} }).limit(pageSize);
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
}

function getInbox(user, previousLogin, page, callback) {
	var criteria = {user: user, hidden: {$exists: false}};
	if (previousLogin) {
		criteria.date = { $gt: previousLogin };
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
}

function getInboxCount(user, previousLogin, page, callback) {
	var criteria = {user: user, hidden: {$exists: false}};
	if (previousLogin) {
		criteria.date = { $gt: previousLogin };
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
		query: {_id: new db.ObjectId(id), user: user},
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