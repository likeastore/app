var _ = require('underscore');
var config = require('../../config');
var db = require('../db')(config);

var pageSize = 30;

function feed (user, page, callback) {
	var follows = user.followCollections;

	if (!follows || follows.length === 0) {
		return callback(null, {data: [], nextPage: false});
	}

	var ids = follows.map(function (f) {
		return f.id;
	});

	page = page || 1;

	db.collections.aggregate([
		{
			$match: {_id: {$in: ids}}
		},
		{
			$unwind: '$items'
		},
		{
			$project: {
				_id: 0,
				item: '$items',
				collection: {
					_id: '$_id',
					title: '$title',
					description: '$description',
					owner: '$userData'
				}
			}
		},
		{
			$skip: (page - 1) * pageSize
		},
		{
			$limit: pageSize
		}
	], function (err, items) {
		items = (items && items.map(function (i) {
			return _.extend(i.item, {collection: i.collection});
		})) || [];

		callback(null, {data: items, nextPage: items.length === pageSize});
	});
}

module.exports = {
	feed: feed
};