var request = require('request');
var async = require('async');
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
		var collection;

		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				token = accessToken;
				user = createdUser;
				headers = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when new collection created', function () {

			describe('public', function () {
				beforeEach(function () {
					collection = {title: 'This is test collection', public: true};
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

				it('should have user', function () {
					expect(results.user).to.equal(user.email);
				});

				it('should collection be public', function () {
					expect(results.public).to.equal(true);
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
			});

			describe('private', function () {
				beforeEach(function () {
					collection = {title: 'This is test private collection' };
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

				it('should collection be private', function () {
					expect(results.public).to.equal(false);
				});

				it('should have user', function () {
					expect(results.user).to.equal(user.email);
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
			});
		});

		describe('when getting collections', function () {
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

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true }, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should contain 2 collections', function () {
				expect(results).to.be.a('array');
				expect(results.length).to.equal(2);
			});
		});

		describe('when item added to collection', function () {
			var item, collection;

			beforeEach(function (done) {
				testUtils.createTestItems(user, 1, function (err, items) {
					item = items[0];
					done(err);
				});
			});

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: {title: 'My new collection'}, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.put({url: url + '/' + collection._id + '/item/' + item._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			describe('and item updated', function () {
				beforeEach(function (done) {
					request.get({url: testUtils.getRootUrl() + '/api/items/id/' + item._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should have added to collection', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections[0]).to.deep.equal({id: collection._id.toString(), title: 'My new collection'});
				});
			});

			describe('and added twice', function () {
				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/item/' + item._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.get({url: testUtils.getRootUrl() + '/api/items/id/' + item._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should have added to collection once', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections[0]).to.deep.equal({id: collection._id.toString(), title: 'My new collection'});
				});
			});
		});

		describe('when item removed from collection', function () {
			var item, collection;

			beforeEach(function (done) {
				testUtils.createTestItems(user, 1, function (err, items) {
					item = items[0];
					done(err);
				});
			});

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: {title: 'My new collection'}, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.put({url: url + '/' + collection._id + '/item/' + item._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.del({url: url + '/' + collection._id + '/item/' + item._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			describe('and item updated', function () {
				beforeEach(function (done) {
					request.get({url: testUtils.getRootUrl() + '/api/items/id/' + item._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should have added to collection', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections.length).to.equal(0);
				});
			});

			describe('and removed twice', function () {
				beforeEach(function (done) {
					request.del({url: url + '/' + collection._id + '/item/' + item._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.get({url: testUtils.getRootUrl() + '/api/items/id/' + item._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should have added to collection once', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections.length).to.equal(0);
				});
			});
		});

		describe('when getting items by collection', function () {
			var items, collection;

			beforeEach(function (done) {
				testUtils.createTestItems(user, function (err, created) {
					items = created;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: {title: 'My new collection'}, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				async.each(items, putToCollection, done);

				function putToCollection(item, callback) {
					request.put({url: url + '/' + collection._id + '/item/' + item._id, headers: headers, json: true}, callback);
				}
			});

			beforeEach(function (done) {
				request.get({url: url + '/' + collection._id + '/items', headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return all items in collection', function () {
				expect(results).to.be.a('array');
				expect(results.length).to.equal(10);
			});
		});

		describe('when changing properties', function () {
			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: {title: 'My new collection'}, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.patch({url: url + '/' + collection._id, headers: headers, body: {color: '#EEE'}, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should add properties to collection', function () {
				expect(results.color).to.equal('#EEE');
			});

			it('should other properties stay same', function () {
				expect(results.title).to.equal('My new collection');
			});
		});
	});
});