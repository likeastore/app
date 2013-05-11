var services = require('../../config')().services;
var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('../utils/dbConnector.js').db;

/*
 * Connecting services to user's id
 * @param user {Object} - user data
 * @params token {String} - service user token
 */
function saveNetwork (user, token, tokenSecret, callback) {
	db.networks.findOne({ userId: user._id, token: token }, function (err, net) {
		if (err) {
			return callback(err);
		}

		if (net) {
			return callback('This service is already associated with this user.');
		}

		save();

		function save () {
			var record = {
				userId: user.id,
				username: user.username,
				accessToken: token,
				accessTokenSecret: tokenSecret,
				service: user.provider,
				quotas: services[user.provider].quotas
			};

			db.networks.save(record, function (err) {
				if (err) {
					return callback(err);
				}

				callback(null);
			});
		}
	});
}

module.exports = {
	saveNetwork: saveNetwork
};