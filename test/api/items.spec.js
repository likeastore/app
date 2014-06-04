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

			it ('should contain user reference (userData)', function () {
				expect(results.data[0].userData).to.be.ok;
				expect(results.data[0].userData.username).to.be.ok;
			});

			it ('should not expose private fields of userData', function () {
				expect(results.data[0].userData.twitterToken).to.not.be.ok;
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
					results = body;
					done(err);
				});
			});

			it('one should disappear', function () {
				expect(results.data.length).to.equal(9);
			});
		});

		describe('when getting items for another user', function () {
			var items, anotherUser, anotherHeaders;

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
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					anotherUser = createdUser;
					anotherHeaders = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url + '/user/' + user._id, headers: anotherHeaders, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return items of another user', function () {
				expect(results.data[0].user).to.equal(user.email);
			});
		});

		describe('when flagging item with inappropriate content', function () {
			var flaggedBy, flaggedByItem, itemToValidate;

			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					user = createdUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				testUtils.createTestNetworks(user, {}, done);
			});

			beforeEach(function (done) {
				testUtils.createTestItems(user, function (err, itms) {
					itemToValidate = itms[0];
					done(err);
				});
			});

			beforeEach(function (done) {
				request.post({url: url + '/' + itemToValidate._id + '/flag', body: {'reason': 'Spam'}, headers: headers, json: true}, function (err, resp, body) {
					response = resp;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function() {
				expect(response.statusCode).to.equal(200);
			});

			describe('when getting flagged item', function () {
				beforeEach(function (done) {
					request.get({url: url + '/id/' + itemToValidate._id, headers: headers, json: true}, function (err, resp, body) {
						response = resp;
						flaggedBy = body.flaggedBy;
						flaggedByItem = flaggedBy[0];
						done(err);
					});
				});

				it('should have array of users who reported', function() {
					expect(flaggedBy).to.be.an('array');
				});

				it('should contain valid user email', function() {
					expect(flaggedByItem.email).to.equal(user.email);
				});

				it('should contain valid user id', function() {
					expect(flaggedByItem.id).to.equal(user._id.toString());
				});
			});
		});
	});
});
