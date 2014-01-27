var config = require('../../config');
var db = require('../db')(config);

var pageSize = 30;

function feed (user, page, callback) {
	var follows = user.follows;

	if (!follows || follows.length === 0) {
		return callback(null, {data: [], nextPage: false});
	}

	var users = follows.map(function (f) {
		return f.email;
	});

	var query = db.items.find({user: {$in: users}, hidden: {$exists: false}}).limit(pageSize);
	if (page) {
		query = query.skip(pageSize * (page - 1));
	}

	query.sort({ date: -1 }, returnResults);

	function returnResults(err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, {data: items, nextPage: items.length === pageSize});
	}
}

module.exports = {
	feed: feed
};