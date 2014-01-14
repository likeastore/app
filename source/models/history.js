var moment = require('moment');
var config = require('../../config');
var db = require('../db')(config);

function getForUser(user, callback) {
	var twoWeeks = moment().subtract(2, 'weeks');

	db.items.aggregate([
		{
			$match: { user: user, date: {$gte: twoWeeks.toDate()} }
		},
		{
			$sort: { date: 1 }
		},
		{
			$group: {
				_id: {
					year : { $year : "$date" },
					month : { $month : "$date" },
					day : { $dayOfMonth : "$date" },
				},
				github: { $sum: { $cond: [ {$eq: ['$type', 'github'] }, 1, 0] } },
				twitter: { $sum: { $cond: [ {$eq: ['$type', 'twitter'] }, 1, 0] } },
				facebook: { $sum: { $cond: [ {$eq: ['$type', 'facebook'] }, 1, 0] } },
				stackoverflow: { $sum: { $cond: [ {$eq: ['$type', 'stackoverflow'] }, 1, 0] } },
				vimeo: { $sum: { $cond: [ {$eq: ['$type', 'vimeo'] }, 1, 0] } },
				youtube: { $sum: { $cond: [ {$eq: ['$type', 'youtube'] }, 1, 0] } },
				dribbble: { $sum: { $cond: [ {$eq: ['$type', 'dribbble'] }, 1, 0] } },
				behance: { $sum: { $cond: [ {$eq: ['$type', 'behance'] }, 1, 0] } }
			}
		},
		{
			$project: {
				_id: 0,
				year: '$_id.year',
				month: '$_id.month',
				day: '$_id.day',
				github: '$github',
				twitter: '$twitter',
				facebook: '$facebook',
				stackoverflow: '$stackoverflow',
				vimeo: '$vimeo',
				youtube: '$youtube',
				dribbble: '$dribbble',
				behance: '$behance'
			}
		}
	], function (err, feed) {
		if (err) {
			return callback(err);
		}

		feed = feed.map(function (f) {
			f.date = f.year + '-' + format(f.month) + '-' + format(f.day);
			delete f.year;
			delete f.month;
			delete f.day;

			return strip(f);
		});

		callback(err, {data: feed});
	});

	function format(m) {
		if (m < 10) {
			return '0' + m;
		}

		return m;
	}

	function strip(f) {
		Object.keys(f).forEach(function (k) {
			if (f[k] === 0) {
				delete f[k];
			}
		});

		return f;
	}
}

module.exports = {
	getForUser: getForUser
};