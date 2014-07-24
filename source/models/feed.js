var _ = require('underscore');
var config = require('../../config');
var db = require('../db')(config);

function forUser(user, query, paging, callback) {
	var follows = user.followCollections;
	var track = query.track;
	var from = query.from;

	if (!follows || follows.length === 0) {
		return callback(null, {data: [], nextPage: false});
	}

	var ids = follows.map(function (f) {
		return f.id;
	});

	var page = paging.page || 1;

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
			$sort: { 'item.added': -1 }
		},
		{
			$skip: (page - 1) * paging.pageSize
		},
		{
			$limit: paging.pageSize
		}
	], function (err, items) {
		items = (items && items.map(function (i) {
			return _.extend(i.item, {collection: i.collection});
		})) || [];

		items = items.map(function (item) {
			return track ? trackUrl(item, user) : item;
		});

		callback(null, {data: items, nextPage: items.length === paging.pageSize});
	});

	function trackUrl(item, user) {
		var track = {
			action: 'feed results clicked',
			user: user.email,
			id: item._id,
			url: item.source,
			source: from
		};

		var payload = new Buffer(JSON.stringify(track)).toString('base64');
		var url = config.tracker.url + '/api/track?d=' + payload;

		return _.extend(item, {trackUrl: url});
	}
}

module.exports = {
	forUser: forUser
};
