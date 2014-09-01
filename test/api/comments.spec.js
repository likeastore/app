var request = require('request');
var testUtils = require('../utils');

describe.only('comments.spec.js', function () {
	var token, user, url, headers, response, results;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/comments';
	});

	describe('when non authorized', function () {
		beforeEach(function (done) {
			request({url: url}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should respond 401 (not authorized)', function () {
			expect(response.statusCode).to.equal(401);
		});
	});

	describe('when authorized', function () {
		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				token = accessToken;
				user = createdUser;
				headers = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when item is absent', function () {
			var nonExisting;

			beforeEach(function () {
				nonExisting = '5401cefc8e75530000000001';
			});

			beforeEach(function (done) {
				request.post({url: url + '/' + nonExisting, body: {}, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 404 (not found)', function () {
				expect(response.statusCode).to.equal(404);
			});
		});

		describe('when items is commented', function () {

		});

		describe('when feed is fetched', function () {

		});
	});
});
