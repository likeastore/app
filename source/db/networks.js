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
		return callback('userId is not properly specified.');
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

function removeNetworkByUserId (userId, service, callback) {
	if (!userId || typeof userId !== 'string') {
		return callback('userId is not properly specified.');
	}

	db.networks.remove({ userId: userId, service: service }, function (err) {
		if (err) {
			return callback(err);
		}

		callback(null);
	});
}

function findNetworksByUserId (userId, callback) {
	if (!userId || typeof userId !== 'string') {
		return callback('userId is not properly specified.');
	}

	var nets = [];
	var fieldsToPick = ['service', 'lastExecution', 'username'];

	db.networks.find({ userId: userId }).forEach(function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (!doc) {
			return callback(null, nets);
		}

		var network = _.pick(doc, fieldsToPick);
		nets.push(network);
	});
}

module.exports = {
	saveNetwork: saveNetwork,
	removeNetworkByUserId: removeNetworkByUserId,
	findNetworksByUserId: findNetworksByUserId
};