var _ = require('underscore');
var crypto = require('crypto');
var config = require('../config');
var db = require('../source/db/dbConnector').db;
var moment = require('moment');
var request = require('request');

function getRootUrl () {
	return config.applicationUrl;
}

function createTestUser (callback) {
	var email = moment().valueOf() + '@tests.com';
	var password = 'password';
	var apiToken = crypto.createHash('sha1').update(email + ';' + password).digest('hex');

	var user = {email: email, password: password, apiToken: apiToken};
	db.users.save(user, callback);
}

function createTestUserAndLoginToApi (callback) {
	createTestUser(function (err, user) {
		if (err) {
			return callback(err);
		}

		var url = getRootUrl() + '/api/auth/login';
		request.post({url: url, body: {email: user.email, apiToken: user.apiToken}, json: true}, function (err, response, body) {
			if (err) {
				return callback(err);
			}

			callback (null, user, body.token);
		});
	});
}

function createTestItems (user, size, callback) {
	if (typeof size === 'function') {
		callback = size;
		size = 10;
	}

	var types = ['github', 'twitter', 'stackoverflow'];

	var range = _.range(size);
	var items = range.map (function (index) {
		return {
			userId: user._id,
			user: user.email,
			type: types[index % 3],
			itemId: index
		};
	});

	db.items.insert(items, callback);
}

function createTestItemsOfType(user, type, size, callback) {
	if (typeof size === 'function') {
		callback = size;
		size = 10;
	}

	var range = _.range(size);
	var items = range.map (function (index) {
		return {
			userId: user._id,
			user: user.email,
			type: type,
			itemId: index
		};
	});

	db.items.insert(items, callback);
}

module.exports = {
	getRootUrl: getRootUrl,
	createTestUser: createTestUser,
	createTestUserAndLoginToApi: createTestUserAndLoginToApi,
	createTestItems: createTestItems,
	createTestItemsOfType: createTestItemsOfType
};