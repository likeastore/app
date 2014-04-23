var request = require('request');
var testUtils = require('../utils');
var moment = require('moment');
var crypto = require('crypto');

describe('auth.spec.js', function () {
	var authUrl, url, payload, error, response, body;

	beforeEach(function () {
		authUrl = testUtils.getRootUrl() + '/api/auth';
	});

	describe('when user logs on', function () {

		beforeEach(function () {
			url = authUrl + '/login';
		});

		describe('provides wrong credentials', function () {
			describe('empy payload', function () {
				beforeEach(function () {
					payload = {};
				});

				beforeEach(function (done) {
					request.post({url: url, body: payload, json: true}, function (err, resp) {
						error = error;
						response = resp;
						body = resp.body;
						done();
					});
				});

				it('should return 412 (bad request)', function () {
					expect(response.statusCode).to.equal(412);
				});
			});

			describe('missing email', function () {
				beforeEach(function () {
					payload = { apiToken: '123' };
				});

				beforeEach(function (done) {
					request.post({url: url, body: payload, json: true}, function (err, resp) {
						error = error;
						response = resp;
						body = resp.body;
						done();
					});
				});

				it('should return 412 (bad request)', function () {
					expect(response.statusCode).to.equal(412);
				});
			});

			describe('missing apiToken', function () {
				beforeEach(function () {
					payload = { email: '123@2.com' };
				});

				beforeEach(function (done) {
					request.post({url: url, body: payload, json: true}, function (err, resp) {
						error = error;
						response = resp;
						body = resp.body;
						done();
					});
				});

				it('should return 412 (bad request)', function () {
					expect(response.statusCode).to.equal(412);
				});
			});

			describe('wrong credentials', function () {
				beforeEach(function () {
					payload = { email: '123@2.com', apiToken: '1234234322' };
				});

				beforeEach(function (done) {
					request.post({url: url, body: payload, json: true}, function (err, resp) {
						error = error;
						response = resp;
						body = resp.body;
						done();
					});
				});

				it('should return 401 (unauthorized)', function () {
					expect(response.statusCode).to.equal(401);
				});
			});
		});

		describe('provides right credentials', function () {
			var user;

			beforeEach(function (done) {
				testUtils.createTestUser(function (err, createdUser) {
					user = createdUser;
					done(err);
				});
			});

			beforeEach(function () {
				payload = { email: user.email, apiToken: user.apiToken };
			});

			beforeEach(function (done) {
				request.post({url: url, body: payload, json: true}, function (err, resp) {
					error = error;
					response = resp;
					body = resp.body;
					done();
				});
			});

			it('should return 201 (token created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should get access token', function () {
				expect(body.token).to.be.ok;
			});

			describe('and try to validate token', function () {
				var token;

				beforeEach(function () {
					url = authUrl + '/validate';
				});

				describe('invalid token', function () {
					beforeEach(function () {
						token = 'iam_compeletely_invalid_token';
					});

					beforeEach(function (done) {
						request.get({url: url, auth: {user: 'username', password: token}}, function (err, resp) {
							error = err;
							response = resp;
							done();
						});
					});

					it ('should return 401 (unauthorized)', function () {
						expect(response.statusCode).to.equal(401);
					});
				});

				describe('faked token', function () {
					beforeEach(function () {
						var key = 'i_dont_know_which_key_used_on_server';
						var username = 'user', timespamp = moment().valueOf();
						var message = username + ';' + timespamp;
						var hmac = crypto.createHmac('sha1', key).update(message).digest('hex');

						token = new Buffer(username + ';' + timespamp + ';' + hmac).toString('base64');
					});

					beforeEach(function (done) {
						request.get({url: url, auth: {user: 'username', password: token}}, function (err, resp) {
							error = err;
							response = resp;
							done();
						});
					});

					it ('should return 404 (unauthorized)', function () {
						expect(response.statusCode).to.equal(401);
					});
				});

				describe('valid token', function () {
					beforeEach(function (done) {
						request.get({url: url, headers: {'X-Access-Token': body.token}}, function (err, resp) {
							error = err;
							response = resp;
							done();
						});
					});

					it ('should return 200 (authenticated)', function () {
						expect(response.statusCode).to.equal(200);
					});
				});

				describe('with token in query', function () {
					beforeEach(function (done) {
						url += '?accessToken=' + body.token;

						request.get({ url: url }, function (err, resp) {
							error = err;
							response = resp;
							done();
						});
					});

					it ('should return 200 (authenticated)', function () {
						expect(response.statusCode).to.equal(200);
					});
				});
			});
		});
	});

	describe('when user logs off', function () {
		var user, loginUrl, logoutUrl, body;

		beforeEach(function () {
			loginUrl = authUrl + '/login';
			logoutUrl = authUrl + '/logout';
		});

		beforeEach(function (done) {
			testUtils.createTestUser(function (err, createdUser) {
				user = createdUser;
				done();
			});
		});

		beforeEach(function () {
			payload = { email: user.email, apiToken: user.apiToken };
		});

		beforeEach(function (done) {
			request.post({url: loginUrl, body: payload, json: true}, function (err, resp) {
				error = error;
				response = resp;
				body = resp.body;
				done();
			});
		});

		beforeEach(function (done) {
			request.post({url: logoutUrl, headers: {'X-Access-Token': body.token}}, function (err, resp) {
				error = error;
				response = resp;
				done();
			});
		});

		it ('should respond with 200', function () {
			expect(response.statusCode).to.equal(200);
		});
	});
});