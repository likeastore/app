var services = require('../../config').services;
var _ = require('underscore');
var ObjectId = require('mongojs').ObjectId;
var db = require('./dbConnector').db;

exports.createOrUpdate = function (network, callback) {
	db.networks.update(
		{user: network.user, service: network.service},
		{$set: network, $unset: {disabled: ''}},
		{safe: true, upsert: true, 'new': true},
		callback);
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
	var fieldsToPick = ['service', 'lastExecution', 'disabled'];

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

exports.enable = function (id, callback) {
	db.networks.update({_id: new ObjectId(id)}, { disabled: '' }, callback);
};
