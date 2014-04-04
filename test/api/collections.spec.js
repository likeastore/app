var request = require('request');
var async = require('async');
var testUtils = require('../utils');

describe('collections.spec.js', function () {
	var token, user, url, items, headers, response, results;

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

		describe('when items added to collection', function () {
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
				request.put({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, function (err, resp, body) {
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
					expect(results.collections[0]).to.deep.equal({id: collection._id.toString()});
				});
			});

			describe('and added twice', function () {
				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, function (err, resp, body) {
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
					expect(results.collections.length).to.equal(1);
					expect(results.collections[0]).to.deep.equal({id: collection._id.toString()});
				});
			});

			describe('when item belongs of another user', function () {
				var anotherUser, discoverItem;

				beforeEach(function (done) {
					testUtils.createTestUser(function (err, user) {
						anotherUser = user;
						done(err);
					});
				});

				beforeEach(function (done) {
					testUtils.createTestItems(anotherUser, function (err, items) {
						discoverItem = items[0];
						done(err);
					});
				});

				beforeEach(function (done) {
					request.put({ url: url + '/' + collection._id + '/items/' + discoverItem._id, headers: headers, json: true }, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond with 201 (created)', function () {
					expect(response.statusCode).to.equal(201);
				});

				describe('and item should be updated', function() {
					beforeEach(function (done) {
						testUtils.loginToApi(anotherUser, function (err, user, accessToken) {
							token = accessToken;
							headers = { 'X-Access-Token': accessToken };
							done(err);
						});
					});

					beforeEach(function (done) {
						request.get({ url: testUtils.getRootUrl() + '/api/items/id/' + discoverItem._id, headers: headers, json: true }, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should be added to user collection', function () {
						expect(results.collections).to.be.an('array');
						expect(results.collections[0]).to.deep.equal({ id: collection._id.toString()});
					});
				});
			});

			describe('and collection fetched after', function () {
				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true }, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it('should not contain items', function () {
					expect(results[0].items).to.not.exist;
				});
			});

			describe('items ordering (lifo)', function () {
				var items;

				beforeEach(function (done) {
					testUtils.createTestItems(user, 3, function (err, created) {
						items = created;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/items/' + items[0]._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/items/' + items[1]._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/items/' + items[2]._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.get({url: url + '/' + collection._id + '/items', headers: headers, json: true }, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it('should return items in LIFO', function () {
					expect(results[0]._id).to.equal(items[2]._id.toString());
					expect(results[1]._id).to.equal(items[1]._id.toString());
					expect(results[2]._id).to.equal(items[0]._id.toString());
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
				request.put({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.del({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, function (err, resp, body) {
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

				it('should have removed collection', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections.length).to.equal(0);
				});
			});

			describe('and removed twice', function () {
				beforeEach(function (done) {
					request.del({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, function (err, resp, body) {
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

				it('should have removed once', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections.length).to.equal(0);
				});
			});
		});

		describe('when deleting collection', function () {
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
				request.put({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.del({url: url + '/' + collection._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
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

			describe('and collection is gone', function () {
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

				it('should have no collections', function () {
					expect(results).to.be.a('array');
					expect(results.length).to.equal(0);
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

			describe('and there are no items', function () {
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

				it('should return empty collection', function () {
					expect(results).to.be.a('array');
					expect(results.length).to.equal(0);
				});
			});

			describe('and there are items', function () {
				beforeEach(function (done) {
					async.each(items, putToCollection, done);

					function putToCollection(item, callback) {
						request.put({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, callback);
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

		describe('when follow collection', function () {
			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: {title: 'My new collection', public: true}, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			describe('own collection', function () {
				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/follow', headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 403 (forbidden)', function () {
					expect(response.statusCode).to.equal(403);
				});
			});

			describe('other user collection', function () {
				var otherUserHeaders;

				beforeEach(function (done) {
					testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
						token = accessToken;
						user = createdUser;
						otherUserHeaders = {'X-Access-Token': accessToken};
						done(err);
					});
				});

				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/follow', headers: otherUserHeaders, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 201 (created)', function () {
					expect(response.statusCode).to.equal(201);
				});

				describe('and collection updated', function () {
					beforeEach(function (done) {
						request.get({url: url + '/' + collection._id, headers: headers, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should have followers property', function () {
						expect(results).to.have.property('followers');
						expect(results.followers).to.have.length(1);
					});
				});

				describe('and user updated', function () {
					beforeEach(function (done) {
						request.get({url: testUtils.getRootUrl() + '/api/users/me', headers: otherUserHeaders, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should have followCollections property', function () {
						expect(results).to.have.property('followCollections');
					});
				});

				describe('private collection', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, body: {title: 'My new collection', public: false}, json: true}, function (err, resp, body) {
							response = resp;
							collection = body;
							done(err);
						});
					});

					beforeEach(function (done) {
						request.put({url: url + '/' + collection._id + '/follow', headers: otherUserHeaders, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should return 403 (forbidden)', function () {
						expect(response.statusCode).to.equal(403);
					});
				});
			});
		});

		describe('when unfollow collection', function () {
			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: {title: 'My new collection', public: true}, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			describe('other user collection', function () {
				var otherUserHeaders;

				beforeEach(function (done) {
					testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
						token = accessToken;
						user = createdUser;
						otherUserHeaders = {'X-Access-Token': accessToken};
						done(err);
					});
				});

				beforeEach(function (done) {
					request.put({url: url + '/' + collection._id + '/follow', headers: otherUserHeaders, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				beforeEach(function (done) {
					request.del({url: url + '/' + collection._id + '/follow', headers: otherUserHeaders, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 200 (created)', function () {
					expect(response.statusCode).to.equal(200);
				});

				describe('and collection updated', function () {
					beforeEach(function (done) {
						request.get({url: url + '/' + collection._id, headers: headers, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should have updated followers property', function () {
						expect(results).to.have.property('followers');
						expect(results.followers).to.have.length(0);
					});
				});

				describe('and user updated', function () {
					beforeEach(function (done) {
						request.get({url: testUtils.getRootUrl() + '/api/users/me', headers: otherUserHeaders, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should have followCollections property', function () {
						expect(results).to.have.property('followCollections');
						expect(results.followCollections).to.have.length(0);
					});
				});
			});
		});

		describe('when getting users collections', function () {
			var otherUser, otherUserHeaders;

			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					otherUser = createdUser;
					otherUserHeaders = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				var collections = [{title: 'first', public: true}, {title: 'second', public: false}, {title: 'third', public: true}];

				async.map(collections, createCollection, done);

				function createCollection(collection, callback) {
					request.post({url: url, headers: otherUserHeaders, body: collection, json: true}, callback);
				}
			});

			beforeEach(function (done) {
				request.get({url: url + '/user/' + otherUser.name, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return opened collections', function () {
				expect(results).to.have.length(2);
			});
		});

		describe('when using collection properties', function () {
			beforeEach(function () {
				collection = {title: 'This is test collection', public: true};
			});

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, function (err, results) {
					items = results;
					done(err);
				});
			});

			beforeEach(function (done) {
				async.map(items, putItemToCollection, done);

				function putItemToCollection(item, callback) {
					request.put({url: url + '/' + collection._id + '/items/' + item._id, headers: headers, json: true}, callback);
				}
			});

			beforeEach(function (done) {
				request.get({url: url + '/' + collection._id, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should contain count', function () {
				expect(results).to.have.property('count');
				expect(results.count).to.equal(10);
			});
		});

		describe('when getting collections which another user follows', function () {
			var otherUser, otherUserHeaders, createdCollections = [];

			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					otherUser = createdUser;
					otherUserHeaders = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				var collections = [{title: 'first', public: true}, {title: 'third', public: true}];

				async.map(collections, createCollection, function (err, collections) {
					createdCollections = collections;
					done(err);
				});

				function createCollection(collection, callback) {
					request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, col) {
						if (err) {
							return callback(err);
						}

						callback(null, col);
					});
				}
			});

			beforeEach(function (done) {
				async.map(createdCollections, followCollection, done);

				function followCollection(c, callback) {
					request.put({url: url + '/' + c._id + '/follow', headers: otherUserHeaders}, callback);
				}
			});

			beforeEach(function (done) {
				request.get({url: url + '/user/' + otherUser.name + '/follows', headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return followed collections', function () {
				expect(results).to.have.length(2);
			});
		});
	});
});