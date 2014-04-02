var _ = require('underscore');
var config = require('../../config');
var db = require('../db')(config);

// var pageSize = 30;
var collectionFields = ['title', 'description', 'user', 'userData'];

function feed (user, page, callback) {
	var follows = user.followCollections;

	if (!follows || follows.length === 0) {
		return callback(null, {data: [], nextPage: false});
	}

	var ids = follows.map(function (f) {
		return f.id;
	});

	db.collections.find({_id: {$in: ids}}, function (err, collections) {
		if (err) {
			return callback(err);
		}

		var items = collections.map(function (c) {
			return c.items && c.items.map(function (i) {
				return _.extend(i, {collection: _.pick(c, collectionFields)});
			});
		});

		items = items.reduce(function (memo, items) {
			if (items) {
				memo = memo.concat(items);
			}

			return memo;
		}, []);

		callback(null, {data: items, nextPage: false});
	});
}

module.exports = {
	feed: feed
};