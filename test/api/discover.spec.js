var async= require('async');
var request = require('request');
var testUtils = require('../utils');

describe('discover.spec.js', function () {
	var url, firstUser, secondUser, firstUserHeaders, secondUserHeaders,  response, results;

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
		//var follows;

		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				firstUser = createdUser;
				// console.log('first user ', createdUser.email);
				firstUserHeaders = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				secondUser = createdUser;
				// console.log('second user ', createdUser.email);
				secondUserHeaders = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when no collections followed', function () {
			beforeEach(function (done) {
				request.get({url: url, headers: firstUserHeaders, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200(ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should be empty', function () {
				expect(results.data).to.eql([]);
			});
		});

		describe('when one collection without items followed', function () {
			var collection;

			beforeEach(function (done) {
				request.post({url: testUtils.getRootUrl() + '/api/collections', headers: secondUserHeaders, body: {title: 'collection'}, json: true}, function (err, resp, body) {
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.put({url: testUtils.getRootUrl() + '/api/collections/' + collection._id + '/follow', headers: firstUserHeaders }, function (err) {
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url, headers: firstUserHeaders, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200(ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should be empty', function () {
				expect(results.data).to.eql([]);
			});
		});

		describe('when collection with items followed', function () {
			var collection;

			beforeEach(function (done) {
				request.post({url: testUtils.getRootUrl() + '/api/collections', headers: secondUserHeaders, body: {title: 'collection'}, json: true}, function (err, resp, body) {
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				testUtils.createTestItems(secondUser, function (err, createdItems) {
					if (err) {
						return done(err);
					}

					async.map(createdItems, putToCollection, done);

					function putToCollection(item, callback) {
						request.put({url: testUtils.getRootUrl() + '/api/collections/' + collection._id + '/items/' + item._id, headers: secondUserHeaders}, callback);
					}
				});
			});

			beforeEach(function (done) {
				request.put({url: testUtils.getRootUrl() + '/api/collections/' + collection._id + '/follow', headers: firstUserHeaders }, function (err, results, body) {
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url, headers: firstUserHeaders, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200(ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should contain items from collection', function () {
				expect(results.data).to.be.an('array');
				expect(results.data).to.have.length(10);
			});

		});

		describe('when few collections with items followed', function () {

		});

		/*
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
		*/
	});
});
