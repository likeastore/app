var config = require('../../config');
var db = require('../db')(config);

function getForUser(user, callback) {
	db.items.aggregate([
		{
			$match: { user: user }
		},
		{
			$group: {
				_id: {date: '$date'},
				github: { $sum: { $cond: [ {$eq: ['$type', 'github'] }, 1, 0] } },
				twitter: { $sum: { $cond: [ {$eq: ['$type', 'twitter'] }, 1, 0] } },
				facebook: { $sum: { $cond: [ {$eq: ['$type', 'facebook'] }, 1, 0] } },
				stackoverflow: { $sum: { $cond: [ {$eq: ['$type', 'stackoverflow'] }, 1, 0] } }
			}
		},
		{
			$project: {
				_id: 0,
				date: '$_id.date',
				github: '$github',
				twitter: '$twitter',
				facebook: '$facebook',
				stackoverflow: '$stackoverflow'
			}
		}
	], function (err, feed) {
		if (err) {
			return callback(err);
		}

		callback(err, {data: feed});
	});
}

module.exports = {
	getForUser: getForUser
};