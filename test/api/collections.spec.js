var request = require('request');
var testUtils = require('../utils');

describe.only('collections.spec.js', function () {
	var token, user, url, headers, response, results;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/collections';
	});

	describe('when non authorized', function () {
		beforeEach(function (done) {
			request.get({url: url, json: true}, function (err, resp, body) {
				response = resp;
				done(err);
			});
		});

		it ('should not be authorized', function () {
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

		describe('when new collection created', function () {
			var collection;

			beforeEach(function () {
				collection = {title: 'This is test collection'};
			});

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should create new collection', function () {
				expect(results.title).to.be.ok;
				expect(results._id).to.be.ok;
			});

			it('should collection be private by default', function () {
				expect(results.public).to.equal(false);
			});

			describe('and title is missing', function () {
				beforeEach(function (done) {
					request.post({url: url, headers: headers, body: {}, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond with 412 (bad request)', function () {
					expect(response.statusCode).to.equal(412);
				});
			});

			describe('with description', function () {
				beforeEach(function () {
					collection = {title: 'This is test collection', description: 'description'};
				});

				beforeEach(function (done) {
					request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond with 201 (created)', function () {
					expect(response.statusCode).to.equal(201);
				});

				it('should create new collection', function () {
					expect(results.description).to.equal('description');
				});
			});

			describe('with public', function () {
				beforeEach(function () {
					collection = {title: 'This is test collection', description: 'description', public: true};
				});

				beforeEach(function (done) {
					request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond with 201 (created)', function () {
					expect(response.statusCode).to.equal(201);
				});

				it('should create new collection', function () {
					expect(results.public).to.equal(true);
				});
			});
		});

		describe('when item added to existing collection', function () {

		});

		describe('when item added to new collection', function () {

		});

		describe('when all user collections', function () {

		});

		describe('when getting items by collection', function () {

			describe('private', function () {

			});

			describe('public', function () {

			});
		});
	});

});