var config = require('../../config');
var db = require('../db')(config);
var moment = require('moment');

function getForUser(user, callback) {
	db.items.aggregate([
		{
			$match: { user: user },
		},
		{
			$group: { _id: {service: '$type'}, count: {$sum: 1}, _date: '$date'}
		}
	], function (err, results) {
		if (err) {
			return callback(err);
		}

		console.log(results);

		var feed = results.map(function (e) {
			return {
				user: user,
				service: e._id.service,
				date: moment(e._id.date).format('YYYY-MM-DD'),
				count: e.count
			};
		});

		callback(err, {data: feed});
	});
}

module.exports = {
	getForUser: getForUser
};