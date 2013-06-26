var request = require('request');
var testUtils = require('../utils');

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

				});

				it ('should get 412 (bad request)', function () {

				});
			});

			describe('missing apiToken', function () {
				it ('should get 412 (bad request)', function () {

				});
			});
		});

		describe('provides right credentials', function () {
			it ('should get access token', function () {

			});

			it ('should be valid token', function () {

			});
		});
	});

	describe('when user logs off', function () {
		it ('should invalidate his access token', function () {

		});
	});
});