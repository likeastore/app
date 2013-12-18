var config = require('../../config');
var db = require('../db')(config);

var pageSize = 30;

function getAllItems(user, page, callback) {
	var query = db.items.find({ user: user }).limit(pageSize);
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

function getItemsByType(user, type, page, callback) {
	var query = db.items.find({ user: user, type: type }).limit(pageSize);
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
	var criteria = {user: user};
	if (previousLogin) {
		criteria.created = { $gt: previousLogin };
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

module.exports = {
	getAllItems: getAllItems,
	getItemsByType: getItemsByType,
	getInbox: getInbox
};
