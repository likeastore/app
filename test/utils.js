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

module.exports = {
	getRootUrl: getRootUrl,
	createTestUser: createTestUser,
	createTestUserAndLoginToApi: createTestUserAndLoginToApi
};