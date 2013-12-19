var request = require('request');
var testUtils = require('../utils');

describe('inbox.spec.js', function () {
	var token, user, url, headers, response, results, error;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/items/inbox';
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
		describe('when logs on first time', function () {
			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					user = createdUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, 60, done);
			});

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

			it('should return first page 30 results', function () {
				expect(results.data.length).to.equal(30);
			});

			it('should have next page', function () {
				expect(results.nextPage).to.equal(true);
			});
		});

		describe('when logs on, and some items added between', function () {
			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					user = createdUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, 5, done);
			});

			beforeEach(function (done) {
				setTimeout(done, 100);
			});

			beforeEach(function (done) {
				testUtils.loginToApi(user, function (err, updatedUser, accessToken) {
					token = accessToken;
					user = updatedUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

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

			it('should return new results', function () {
				expect(results.data.length).to.equal(5);
			});
		});

		describe('when logs on, but nothing is added', function () {
			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					user = createdUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(done, 100);
			});

			beforeEach(function (done) {
				testUtils.loginToApi(user, function (err, updatedUser, accessToken) {
					token = accessToken;
					user = updatedUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

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

			it('should return empty results', function () {
				expect(results.data.length).to.equal(0);
			});
		});

		describe('when getting inbox count', function () {
			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					user = createdUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, 5, done);
			});

			beforeEach(function (done) {
				setTimeout(done, 100);
			});

			beforeEach(function (done) {
				testUtils.loginToApi(user, function (err, updatedUser, accessToken) {
					token = accessToken;
					user = updatedUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url + '/count', headers: headers, json: true}, function (err, resp, body) {
					error = err;
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok) status', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return count', function () {
				expect(results.count).to.equal(5);
			});
		});
	});
});