var crypto = require('crypto');
var config = require('../config');
var db = require('../source/db/dbConnector').db;
var moment = require('moment');

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

module.exports = {
	getRootUrl: getRootUrl,
	createTestUser: createTestUser
};