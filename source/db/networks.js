var services = require('../../config').services;
var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('./dbConnector').db;

exports.save = function  (userId, profile, token, tokenSecret, callback) {
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

		var record = {
			userId: userId,
			username: profile.username,
			accessToken: token,
			accessTokenSecret: tokenSecret,
			service: profile.provider
		};

		db.networks.save(record, function (err, saved) {
			if (err || !saved) {
				return callback(err);
			}

			callback(null, saved);
		});
	});
};

exports.removeNetworkByUserId = function (userId, service, callback) {
	db.networks.remove({ userId: userId, service: service }, function (err) {
		if (err) {
			return callback(err);
		}

		callback(null);
	});
};

exports.findNetworksByUserId = function (userId, callback) {
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
		network.id = doc._id.toString();
		nets.push(network);
	});
};
