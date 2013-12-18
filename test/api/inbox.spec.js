var request = require('request');
var testUtils = require('../utils');

describe.only('inbox.spec.js', function () {
	var token, user, url, headers, response, results, error;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/inbox';
	});

	describe('non authorized', function () {
		beforeEach(function (done) {
			request.get({url: url, json: true}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
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
				headers = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when have no last viewed date', function () {
			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
					error = err;
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok) status', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return empty list', function () {
				expect(results.data.length).to.equal(0);
			});

		});

		describe('when inbox is viewed', function () {

		});

		describe('when nothing new is added', function () {

		});

		describe('when new items added', function () {

		});

	});
});