var request = require('request');
var testUtils = require('../utils');

describe('users.spec.js', function () {
	var token, user, baseUrl, url, headers, response, body, error;

	beforeEach(function () {
		baseUrl = testUtils.getRootUrl() + '/api/users';
	});

	beforeEach(function () {
		url = baseUrl + '/me';
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

		describe('when start follow', function () {
			var userToFollow;

			beforeEach(function (done) {
				testUtils.createTestUser(function (err, createdUser) {
					userToFollow = createdUser;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.post({url: url + '/follow/' + userToFollow._id, headers: headers, json: true}, function (err, resp) {
					error = err;
					response = resp;
					done(err);
				});
			});

			it('should respond with 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			describe('and following after', function () {
				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it('should contain follows field', function () {
					expect(body.follows).to.be.ok;
				});

				it('should have id and email', function () {
					expect(body.follows[0].id).to.be.ok;
					expect(body.follows[0].email).to.be.ok;
				});
			});

			describe('and followed user', function () {
				beforeEach(function (done) {
					request.get({url: baseUrl + '/' + userToFollow.name, headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it('should contain followed field', function () {
					expect(body.followed).to.be.ok;
				});
			});

			describe('and get follows', function () {
				beforeEach(function (done) {
					request.get({url: url + '/follows', headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it('should return follows users', function () {
					expect(body.length).to.equal(1);
					expect(body[0].email).to.equal(userToFollow.email);
				});
			});

			describe('and get followed', function () {
				beforeEach(function (done) {
					request.get({url: url + '/followed', headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it('should return follows users', function () {
					expect(body.length).to.equal(0);
				});
			});

			describe('and followed twice', function () {
				beforeEach(function (done) {
					request.post({url: url + '/follow/' + userToFollow._id, headers: headers, json: true}, function (err, resp) {
						error = err;
						response = resp;
						done(err);
					});
				});

				it('should respond with 403 (forbidden)', function () {
					expect(response.statusCode).to.equal(403);
				});
			});
		});

		describe('when stop follow', function () {
			var userToFollow;

			beforeEach(function (done) {
				testUtils.createTestUser(function (err, createdUser) {
					userToFollow = createdUser;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.post({url: url + '/follow/' + userToFollow._id, headers: headers, json: true}, function (err, resp) {
					error = err;
					response = resp;
					done(err);
				});
			});

			beforeEach(function (done) {
				request.del({url: url + '/follow/' + userToFollow._id, headers: headers, json: true}, function (err, resp) {
					error = err;
					response = resp;
					done(err);
				});
			});

			it('should respond with 200 (ok)', function () {
				expect(response.statusCode).to.equal(200);
			});

			describe('and following after', function () {
				beforeEach(function (done) {
					request.get({url: url, headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it('should follows nobody', function () {
					expect(body.follows.length).to.equal(0);
				});
			});

			describe('and followed user', function () {
				beforeEach(function (done) {
					request.get({url: baseUrl + '/' + userToFollow.name, headers: headers, json: true}, function (err, resp, bod) {
						response = resp;
						body = bod;
						done(err);
					});
				});

				it('should followed by nobody', function () {
					expect(body.followed.length).to.equal(0);
				});
			});

			describe('and unfollowed twice', function () {
				beforeEach(function (done) {
					request.del({url: url + '/follow/' + userToFollow._id, headers: headers, json: true}, function (err, resp) {
						error = err;
						response = resp;
						done(err);
					});
				});

				it('should respond with 403 (forbidden)', function () {
					expect(response.statusCode).to.equal(403);
				});
			});
		});
	});
});