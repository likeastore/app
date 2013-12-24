var request = require('request');
var testUtils = require('../utils');

describe.only('users.spec.js', function () {
	var token, user, url, headers, response, body, error;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/users';
	});

	beforeEach(function () {
		url += '/me';
	});

	describe('non authorized', function () {

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

	describe('authorized', function () {
		beforeEach(function (done) {
			testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
				token = accessToken;
				user = createdUser;
				headers = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when getting user', function () {
			beforeEach(function (done) {
				request.get({url: url, headers: headers, json: true}, function (err, resp, bod) {
					response = resp;
					body = bod;
					done(err);
				});
			});

			it ('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it ('should response contain user object', function () {
				expect(body._id).to.be.ok;
				expect(body.email).to.equal(user.email);
				expect(body.apiToken).to.equal(user.apiToken);
			});

			it ('should have no warnings', function () {
				expect(body.warning).to.not.be.ok;
			});

			describe('when there is disabled network', function () {
				beforeEach(function (done) {
					testUtils.createTestNetworks(user, {disabled: true}, function (err) {
						done(err);
					});
				});

				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it ('should user contain warning flag', function () {
					expect(body.warning).to.be.true;
				});
			});
		});

		describe('when deleting user', function () {
			beforeEach(function (done) {
				testUtils.createTestUserAndLoginToApi(function (err, createdUser, accessToken) {
					token = accessToken;
					user = createdUser;
					headers = {'X-Access-Token': accessToken};
					done(err);
				});
			});

			beforeEach(function (done) {
				request.del({url: url, headers: headers, json: true}, function (err, resp, bod) {
					response = resp;
					body = bod;
					done(err);
				});
			});

			it('should respond 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			describe('and try to login after', function () {
				beforeEach(function (done) {
					testUtils.loginToApi(user, function (err, user, toke) {
						error = err;
						token = toke;
						done();
					});
				});

				it('should reject user', function () {
					expect(token).to.not.be.ok;
				});
			});

			describe('and try to access user', function () {
				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp) {
						error = err;
						response = resp;
						done(err);
					});
				});

				it('should respond with 401 (unauthorized)', function () {
					expect(response.statusCode).to.equal(401);
				});
			});
		});

		describe('when resetting password', function () {
			var requestId, newPassword;

			beforeEach(function (done) {
				url += '/resetpasswordrequest';
				request.post({url: url, headers: headers, json: true}, function (err, resp, bod) {
					error = err;
					response = resp;
					body = bod;
					done(err);
				});
			});

			it('should respond 201(created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should create reset password request', function () {
				expect(body.id).to.be.ok;
				expect(body.timestamp).to.be.ok;
			});

			describe('and using wrong request id', function () {
				beforeEach(function () {
					requestId = 'wrong-request-id';
					newPassword = 'new password';
				});

				beforeEach(function (done) {
					url += '/resetpassword';
					request.post({url: url, body: {id: requestId, email: user.email, password: newPassword}, json: true}, function (err, resp, bod) {
						error = err;
						response = resp;
						body = body;
						done(err);
					});
				});

				it('should respond 403(forbidden)', function () {
					expect(response.statusCode).to.equal(403);
				});
			});
		});
	});
});