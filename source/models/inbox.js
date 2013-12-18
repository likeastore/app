var moment = require('moment');

var users = require('./users');
var config = require('../../config');
var db = require('../db')(config);

function getUserInbox(user, callback) {
	users.findByEmail(user, function (err, user) {
		if (err) {
			return callback(err);
		}

		var inboxLastViewed = user.inboxLastViewed;
		if (!inboxLastViewed) {
			return callback (null, {data: []});
		}

		db.items.find({created: {$gte: moment(inboxLastViewed).toDate() }}).sort({created: -1}, returnResults);

		function returnResults(err, items) {
			if (err) {
				return callback (err);
			}

			callback (null, {data: items});
		}
	});
}

function viewedByUser(user, callback) {
	var current = moment().toDate();
	users.update(user, {inboxLastViewed: current }, function (err, user) {
		if (err) {
			return callback(err);
		}

		callback (null, current);
	});
}

module.exports = {
	getUserInbox: getUserInbox,
	viewedByUser: viewedByUser
};