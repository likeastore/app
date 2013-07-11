var request = require('request');
var testUtils = require('../utils');
var moment = require('moment');

describe('items.spec.js', function () {
	var token, user, url, headers, response, results;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/items';
	});

	describe('non authorized', function () {
		beforeEach(function (done) {
			request.get({url: url, json: true}, function (err, resp, body) {
				response = resp;
				results = body;
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
				headers = {'X-Access-Token': accessToken};
				done();
			});
		});

		describe('when getting all items', function () {
			beforeEach(function (done) {
				testUtils.createTestItems(user, function (err, items) {
					done();
				});
			});

			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done();
				});
			});

			it ('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it ('should return all items', function () {
				expect(results.length).to.equal(10);
			});
		});

		describe('when getting items by type', function () {
			var response, results;

			describe('for twitter', function () {
				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'twitter', function (err, items) {
						done();
					});
				});

				beforeEach(function () {
					url += '/twitter';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done();
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items', function () {
					expect(results.length).to.equal(10);
				});
			});

			describe('for github', function () {
				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'github', function (err, items) {
						done();
					});
				});

				beforeEach(function () {
					url += '/github';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done();
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items', function () {
					expect(results.length).to.equal(10);
				});
			});

			describe('for stackoverflow', function () {
				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'stackoverflow', function (err, items) {
						done();
					});
				});

				beforeEach(function () {
					url += '/stackoverflow';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done();
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items', function () {
					expect(results.length).to.equal(10);
				});
			});
		});

		describe('when paging results', function () {

		});
	});
});