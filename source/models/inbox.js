var config = require('../../config');
var users = require('./users');
//var db = require('../db')(config);

function getUserInbox(user, callback) {
	users.findByEmail(user, function (err, user) {
		if (err) {
			return callback(err);
		}

		var inboxLastViewed = user.inboxLastViewed;
		if (!inboxLastViewed) {
			return callback (null, {data: []});
		}
	});
}

module.exports = {
	getUserInbox: getUserInbox
};