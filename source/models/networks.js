var _ = require('underscore');
var request = require('request');
var ObjectId = require('mongojs').ObjectId;
var config = require('../../config');
var db = require('../db')(config);

function createOrUpdate(network, callback) {
	db.networks.update(
		{user: network.user, service: network.service},
		{$set: network, $unset: {disabled: ''}},
		{safe: true, upsert: true, 'new': true},
		callback);
}

function removeNetwork(user, service, callback) {
	db.networks.remove({ user: user.email, service: service }, function (err) {
		if (err) {
			return callback(err);
		}

		callback(null);
	});
}

function findNetworks(user, callback) {
	var nets = [];
	var fieldsToPick = ['service', 'lastExecution', 'disabled'];

	db.networks.find({ user: user.email }).forEach(function (err, doc) {
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
}

function enable(id, callback) {
	db.networks.update({_id: new ObjectId(id)}, { disabled: '' }, callback);
}

function getDribbbleUser(username, callback) {
	if (!username || typeof username !== 'string') {
		return callback({ message: 'username is invalid' });
	}

	username = username.toLowerCase();

	request({url: 'http://api.dribbble.com/players/' + username, json: true}, function (err, resp, body) {
		if (err) {
			return callback(err);
		}

		if (resp.statusCode === 404) {
			return getScout();
		}

		callback(null, body);
	});

	function getScout() {
		request('http://dribbble.com/' + username, function (err, resp, page) {
			if (err) {
				return callback(err);
			}

			if (resp.statusCode !== 200) {
				return callback({ message: 'scout not found'});
			}

			callback(null, {
				name: username,
				avatar_url: '/img/dribbble-avatar.gif'
			});
		});
	}
}

module.exports = {
	createOrUpdate: createOrUpdate,
	removeNetwork: removeNetwork,
	findNetworks: findNetworks,
	enable: enable,
	getDribbbleUser: getDribbbleUser
};