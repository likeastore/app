var request = require('request');
var testUtils = require('../utils');
var moment = require('moment');
var crypto = require('crypto');

describe('users.spec.js', function () {
	var token, user, url, auth, response, body;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/users';
	});

	describe('non authorized', function () {
		beforeEach(function () {
			url += '/me';
		});

		beforeEach(function (done) {
			request.get({url: url, json: true}, function (err, resp, body) {
				response = resp;
				done();
			});
		});

		it ('should not be authorized', function () {
			expect(response.statusCode).to.equal(401);
		});
	});

	describe('authorized', function () {
		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				token = accessToken;
				user = createdUser;
				auth = {user: createdUser.email, password: accessToken};
				done();
			});
		});

		describe('when getting user', function () {
			beforeEach(function () {
				url += '/me';
			});

			beforeEach(function (done) {
				request.get({url: url, auth: auth, json: true}, function (err, resp, bod) {
					response = resp;
					body = bod;
					done();
				});
			});

			it ('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it ('should response contain user object', function () {
				expect(body._id).to.be.ok;
				expect(body.email).to.equal(user.email);
				expect(body.apiToken).to.equal(user.apiToken);
			});
		});
	});
});