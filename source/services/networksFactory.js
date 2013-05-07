var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('../utils/dbConnector.js').db;

/*
 * Connecting services to user's id
 * @param user {Object} - user data
 * @params token {String} - service user token
 */
function saveNetwork (user, token, callback) {
	db.networks.findOne({ userId: user._id }, function (err, net) {
		if (err) {
			return callback(err);
		}

		if (net) {
			return callback('This service is already associated with this user.');
		}

		save();

		function save () {
			var record = {
				userId: user._id,
				token: token
			};

			db.networks.save(record, function (err, saved) {
				if (err || !saved) {
					return callback(err);
				}
				callback(null, saved);
			});
		}
	});
}

module.exports = {
	saveNetwork: saveNetwork
};