var _ = require('underscore');
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

		describe('when getting collection by id', function () {
			beforeEach(function () {
				collection = {title: 'This is test collection', description: 'description'};
			});

			beforeEach(function (done) {
				request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, body) {
					response = resp;
					collection = body;
					done(err);
				});
			});

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

			it('should return collection', function () {
				expect(results).to.have.property('_id');
				expect(results).to.have.property('title');
				expect(results).to.have.property('description');
				expect(results).to.have.property('user');
			});

			describe('by another user', function () {
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
					request.get({url: url + '/' + collection._id, headers: otherUserHeaders, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it('should return collection', function () {
					expect(results).to.have.property('_id');
					expect(results).to.have.property('title');
					expect(results).to.have.property('description');
					expect(results).to.have.property('user');
				});
			});

			describe('with wrong id', function () {
				beforeEach(function (done) {
					request.get({url: url + '/wrong_id', headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 404 (not found)', function () {
					expect(response.statusCode).to.equal(412);
				});
			});

			describe('with unknown id', function () {
				beforeEach(function (done) {
					var id = '555' + collection._id.substr(3);
					request.get({url: url + '/' + id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 404 (not found)', function () {
					expect(response.statusCode).to.equal(404);
				});
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

				beforeEach(function (done) {
					request.get({url: url + '/' + collection._id + '/items', headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						items = body;
						done(err);
					});
				});

				it('should have added to collection once', function () {
					expect(results.collections).to.be.a('array');
					expect(results.collections.length).to.equal(1);
					expect(results.collections[0]).to.deep.equal({id: collection._id.toString()});
				});

				it('should only one item added to collection', function () {
					expect(items.data).to.have.length(1);
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
					expect(results.data[0]._id).to.equal(items[2]._id.toString());
					expect(results.data[1]._id).to.equal(items[1]._id.toString());
					expect(results.data[2]._id).to.equal(items[0]._id.toString());
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
					expect(results.data.length).to.equal(0);
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
					expect(results.data.length).to.equal(10);
				});
			});

			describe('and supports paging', function () {
				beforeEach(function (done) {
					testUtils.createTestItems(user, 67, function (err, created) {
						items = created;
						done(err);
					});
				});

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

				it('should respond 200 (ok)', function () {
					expect(response.statusCode).to.equal(200);
				});

				it('should return all items on first page', function () {
					expect(results.data.length).to.equal(30);
					expect(results.nextPage).to.equal(true);
				});

				describe('second page', function () {
					beforeEach(function (done) {
						request.get({url: url + '/' + collection._id + '/items?page=2', headers: headers, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should return all items on second page', function () {
						expect(results.data.length).to.equal(30);
						expect(results.nextPage).to.equal(true);
					});
				});

				describe('third page', function () {
					beforeEach(function (done) {
						request.get({url: url + '/' + collection._id + '/items?page=3', headers: headers, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should return all items on third page', function () {
						expect(results.data.length).to.equal(7);
						expect(results.nextPage).to.equal(false);
					});
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

				describe('and owner updated', function () {
					beforeEach(function (done) {
						request.get({url: testUtils.getRootUrl() + '/api/users/me', headers: headers, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should have followCollections property', function () {
						expect(results).to.have.property('followed');
						expect(results.followed[0].email).to.equal(otherUser.email);
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

				describe('and owner updated', function () {
					beforeEach(function (done) {
						request.get({url: testUtils.getRootUrl() + '/api/users/me', headers: headers, json: true}, function (err, resp, body) {
							response = resp;
							results = body;
							done(err);
						});
					});

					it('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it('should have followCollections property', function () {
						expect(results).to.have.property('followed');
						expect(results.followed).to.have.length(0);
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

		xdescribe('when exploring collections', function () {
			var collections, createdHeaders;

			beforeEach(function (done) {
				testUtils.clearCollection('collections', done);
			});

			beforeEach(function (done) {
				var data = [{title: 'first', public: true}, {title: 'second', public: true}, {title: 'third', public: true}];

				async.map(data, createCollection, function (err, results) {
					collections = results;
					done(err);
				});

				function createCollection(collection, callback) {
					request.post({url: url, headers: headers, body: collection, json: true}, function (err, resp, results) {
						callback(err, results);
					});
				}
			});

			beforeEach(function (done) {
				var data = [1, 2, 3];

				async.map(data, createUser, function (err, results) {
					createdHeaders = results;
					done(err);
				});

				function createUser(user, callback) {
					testUtils.createTestUserAndLoginToApi(function (err, userName, accessToken) {
						callback(err, ({'X-Access-Token': accessToken}));
					});
				}
			});

			beforeEach(function (done) {
				// first user follows all 3 collections
				var localHeaders = createdHeaders[0];

				async.map(collections, followCollection, done);

				function followCollection(c, callback) {
					request.put({url: url + '/' + c._id + '/follow', headers: localHeaders}, callback);
				}
			});

			beforeEach(function (done) {
				// second user follows only 2 collections
				var localHeaders = createdHeaders[1];

				async.map(_.take(collections, 1), followCollection, done);

				function followCollection(c, callback) {
					request.put({url: url + '/' + c._id + '/follow', headers: localHeaders}, callback);
				}
			});

			beforeEach(function (done) {
				// third user follows only 1 collection
				var localHeaders = createdHeaders[2];

				async.map(_.take(collections, 2), followCollection, done);

				function followCollection(c, callback) {
					request.put({url: url + '/' + c._id + '/follow', headers: localHeaders}, callback);
				}
			});

			beforeEach(function (done) {
				request.get({url: url + '/explore', headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return collections sorted by followers count', function () {
				expect(results[0].followersCount).to.equal(3);
				expect(results[1].followersCount).to.equal(2);
				expect(results[2].followersCount).to.equal(1);
			});
		});
	});
});