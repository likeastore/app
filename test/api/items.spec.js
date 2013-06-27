var request = require('request');
var testUtils = require('../utils');
var moment = require('moment');

describe.only('items.spec.js', function () {
	var token, user, url, auth;

	beforeEach(function (done) {
		testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
			token = accessToken;
			user = createdUser;
			auth = {user: createdUser.email, password: accessToken};
			done();
		});
	});

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/items';
	});

	describe('when getting all items', function () {
		var response, results;

		beforeEach(function (done) {
			testUtils.createTestItems(user, function (err, items) {
				done();
			});
		});

		beforeEach(function (done) {
			request.get({url: url, auth: auth, json: true}, function (err, resp, body) {
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
				request.get({url: url, auth: auth, json: true}, function (err, resp, body) {
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
				request.get({url: url, auth: auth, json: true}, function (err, resp, body) {
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
				request.get({url: url, auth: auth, json: true}, function (err, resp, body) {
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