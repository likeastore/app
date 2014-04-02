var config = require('../../config');
var db = require('../db')(config);

//var pageSize = 30;

function feed (user, page, callback) {
	var follows = user.followCollections;

	if (!follows || follows.length === 0) {
		return callback(null, {data: [], nextPage: false});
	}

	var ids = follows.map(function (f) {
		return f.id;
	});

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
		}
	], function (err, items) {
		callback(null, {data: items, nextPage: false});
	});
}

module.exports = {
	feed: feed
};