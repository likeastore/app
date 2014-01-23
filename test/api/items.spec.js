var request = require('request');
var testUtils = require('../utils');

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

		describe('when getting all items', function () {
			beforeEach(function (done) {
				testUtils.createTestNetworks(user, {}, done);
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, function (err, items) {
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it ('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it ('should return all items', function () {
				expect(results.data.length).to.equal(10);
			});

			describe('and network is absent', function () {
				beforeEach(function (done) {
					testUtils.removeTestNetwork(user, 'twitter', done);
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items without twitter', function () {
					expect(results.data.length).to.lessThan(10);
				});
			});
		});

		describe('when getting items by type', function () {
			var response, results;

			describe('for twitter', function () {
				beforeEach(function (done) {
					testUtils.createTestNetwork(user, 'twitter', done);
				});

				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'twitter', function (err, items) {
						done(err);
					});
				});

				beforeEach(function () {
					url += '/twitter';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items', function () {
					expect(results.data.length).to.equal(10);
				});
			});

			describe('for github', function () {
				beforeEach(function (done) {
					testUtils.createTestNetwork(user, 'github', done);
				});

				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'github', function (err, items) {
						done(err);
					});
				});

				beforeEach(function () {
					url += '/github';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items', function () {
					expect(results.data.length).to.equal(10);
				});
			});

			describe('for stackoverflow', function () {
				beforeEach(function (done) {
					testUtils.createTestNetwork(user, 'stackoverflow', done);
				});

				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'stackoverflow', function (err, items) {
						done(err);
					});
				});

				beforeEach(function () {
					url += '/stackoverflow';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it ('should respond with 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it ('should return all items', function () {
					expect(results.data.length).to.equal(10);
				});
			});

			describe('and network is absent', function () {
				beforeEach(function (done) {
					testUtils.createTestItemsOfType(user, 'stackoverflow', function (err, items) {
						done(err);
					});
				});

				beforeEach(function () {
					url += '/stackoverflow';
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it ('should respond with 404 (notFound)', function () {
					expect(response.statusCode).to.equal(404);
				});
			});
		});

		describe('when item hidden', function () {
			var items;

			beforeEach(function (done) {
				testUtils.createTestNetworks(user, {}, done);
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, function (err, itms) {
					items = itms;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.del({url: url + '/' + items[0]._id, headers: headers, json: true}, done);
			});

			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
					results = body.data;
					done(err);
				});
			});

			it('one should disappear', function () {
				expect(results.length).to.equal(9);
			});
		});
	});
});