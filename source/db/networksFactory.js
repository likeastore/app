var services = require('../../config')().services;
var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('./dbConnector').db;

/*
 * Connecting services to user
 *
 * @param userId {Object} - likeastore user id
 * @param profile {Object} - user's service data
 * @param token {String} - service user token
 * @param tokenSecret {String} - mostly is not present (exception: twitter);
 * @param callback {Function} - returns 'error' in arguments
 */
function saveNetwork (userId, profile, token, tokenSecret, callback) {
	if (!userId || typeof userId !== 'string') {
		console.error('userId is not properly specified');
		return;
	}

	// stackoverflow specific hack
	if (profile.provider === 'stackexchange') {
		profile.username = profile.user_id;
		profile.provider = 'stackoverflow';
	}

	db.networks.findOne({ userId: userId, provider: profile.provider }, function (err, net) {
		if (err) {
			return callback(err);
		}

		console.log(net);
		if (net) {
			return callback('This service is already associated with this user.');
		}

		save();

		function save () {
			var record = {
				userId: userId,
				username: profile.username,
				accessToken: token,
				accessTokenSecret: tokenSecret,
				service: profile.provider,
				quotas: services[profile.provider].quotas
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

function removeNetwork (userId, service) {}

module.exports = {
	saveNetwork: saveNetwork,
	removeNetwork: removeNetwork
};