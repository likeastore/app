var _ = require('underscore');
var async = require('async');

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

	async.waterfall([
		aggregate,
		resolve
	], function (err, items) {
		if (err) {
			return callback(err);
		}

		callback(null, {data: items, nextPage: items.length === paging.pageSize});
	});

	function aggregate(callback) {
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

			callback(null, items);
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

	function resolve(items, callback) {
		async.map(items, function (item, callback) {
			db.items.findOne({_id: item._id}, function (err, resolved) {
				if (err) {
					return callback(err);
				}

				var commentsCount = (resolved.comments && resolved.comments.length) || 0;

				callback(null, _.extend(item, {commentsCount: commentsCount}));
			});
		}, callback);
	}
}

module.exports = {
	forUser: forUser
};
