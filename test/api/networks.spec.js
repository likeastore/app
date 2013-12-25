var request = require('request');
var testUtils = require('../utils');

describe('networks.spec.js', function () {
	var token, user, url, headers, response, results, error;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/networks';
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

		describe('when creating new network', function () {

			describe('for twitter', function () {
				beforeEach(function () {
					url += '/twitter';
				});

				describe('post', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, json: true}, function (err, resp, body) {
							error = err;
							response = resp;
							results = body;
							done(error);
						});
					});

					it ('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it ('should return auth url', function () {
						expect(results.authUrl).to.be.ok;
					});

					describe('request token', function () {
						var userFromDb;

						beforeEach(function (done) {
							testUtils.getUserFromDb(user, function (err, read) {
								userFromDb = read;
								done(err);
							});
						});

						it ('should requestToken be saved to user record', function () {
							expect(userFromDb.twitterRequestToken).to.be.ok;
						});

						it ('should requestToken secret be saved to user record', function () {
							expect(userFromDb.twitterRequestTokenSecret).to.be.ok;
						});
					});
				});
			});

			describe('for github', function () {
				beforeEach(function () {
					url += '/github';
				});

				describe('post', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, json: true}, function (err, resp, body) {
							error = err;
							response = resp;
							results = body;
							done(err);
						});
					});

					it ('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it ('should return auth url', function () {
						expect(results.authUrl).to.be.ok;
					});
				});
			});

			describe('for gist', function () {
				beforeEach(function () {
					url += '/gist';
				});

				describe('post', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, json: true}, function (err, resp, body) {
							error = err;
							response = resp;
							results = body;
							done(err);
						});
					});

					it ('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it ('should return auth url', function () {
						expect(results.authUrl).to.be.ok;
					});
				});
			});

			describe('for stackoverflow', function () {
				beforeEach(function () {
					url += '/stackoverflow';
				});

				describe('post', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, json: true}, function (err, resp, body) {
							error = err;
							response = resp;
							results = body;
							done(err);
						});
					});

					it ('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it ('should return auth url', function () {
						expect(results.authUrl).to.be.ok;
					});
				});
			});

			describe('for vimeo', function () {
				beforeEach(function () {
					url += '/vimeo';
				});

				describe('post', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, json: true}, function (err, resp, body) {
							error = err;
							response = resp;
							results = body;
							done(err);
						});
					});

					it ('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it ('should return auth url', function () {
						expect(results.authUrl).to.be.ok;
					});

					describe('request token', function () {
						var userFromDb;

						beforeEach(function (done) {
							testUtils.getUserFromDb(user, function (err, read) {
								userFromDb = read;
								done(err);
							});
						});

						it ('should requestToken be saved to user record', function () {
							expect(userFromDb.vimeoRequestToken).to.be.ok;
						});

						it ('should requestToken secret be saved to user record', function () {
							expect(userFromDb.vimeoRequestTokenSecret).to.be.ok;
						});
					});
				});
			});

			describe('for youtube', function () {
				beforeEach(function () {
					url += '/youtube';
				});

				describe('post', function () {
					beforeEach(function (done) {
						request.post({url: url, headers: headers, json: true}, function (err, resp, body) {
							error = err;
							response = resp;
							results = body;
							done(err);
						});
					});

					it ('should respond 200 (ok)', function () {
						expect(response.statusCode).to.equal(200);
					});

					it ('should return auth url', function () {
						expect(results.authUrl).to.be.ok;
					});
				});
			});
		});

		describe('when getting all networks', function () {
			var networks;

			beforeEach(function (done) {
				testUtils.createTestNetworks(user, function (err, items) {
					done(err);
				});
			});

			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, body) {
					networks = body;
					done(err);
				});
			});

			it ('should read all networks', function () {
				expect(networks.length).to.equal(3);
			});
		});
	});
});