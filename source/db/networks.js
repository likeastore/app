var services = require('../../config').services;
var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('./dbConnector').db;

exports.save = function (network, callback) {
	db.networks.findOne({ user: network.user, service: network.service }, function (err, net) {
		if (err) {
			return callback(err);
		}

		if (net) {
			return callback('This network is already associated with this user.');
		}

		db.networks.save(network, function (err, saved) {
			if (err || !saved) {
				return callback(err);
			}

			callback(null, saved);
		});
	});
};

exports.removeNetwork = function (user, service, callback) {
	db.networks.remove({ user: user, service: service }, function (err) {
		if (err) {
			return callback(err);
		}

		callback(null);
	});
};

exports.findNetworks = function (user, callback) {
	var nets = [];
	var fieldsToPick = ['service', 'lastExecution'];

	db.networks.find({ user: user }).forEach(function (err, doc) {
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
