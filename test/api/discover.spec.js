var async= require('async');
var request = require('request');
var testUtils = require('../utils');

describe.only('discover.spec.js', function () {
	var token, user, url, headers, response, results;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/discover';
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
		var follows;

		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				token = accessToken;
				user = createdUser;
				headers = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when getting discover', function () {
			beforeEach(function () {
				follows = [
					{ _id: '1234', email: testUtils.createTestEmail() },
					{ _id: '5678', email: testUtils.createTestEmail() }
				];
			});

			beforeEach(function (done) {
				function createTestItems(user, size) {
					return function (callback) {
						testUtils.createTestItems(follows[user], size, callback);
					};
				}

				async.parallel([createTestItems(0, 5), createTestItems(0, 10)], done);
			});

			beforeEach(function (done) {
				testUtils.addFollows(user, follows, done);
			});

			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return items of follows', function () {
				expect(results.data.length).to.equal(15);
			});
		});
	});
});
