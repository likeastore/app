var request = require('request');
var testUtils = require('../utils');

describe('common.spec.js', function () {
	var root, url, error, response;

	beforeEach(function () {
		root = testUtils.getRootUrl();
	});

	describe('when user is not authorized', function () {
		describe('when requesting app', function () {
			beforeEach(function () {
				url = root + '/';
			});

			beforeEach(function (done) {
				request(url, function (err, resp) {
					console.log(err);
					error = err;
					response = resp;
					done();
				});
			});

			it ('should respond with 401', function () {
				expect(response.statusCode).to.equal(401);
			});
		});

		describe('when requesting api', function () {
			beforeEach(function () {
				url = root + '/api/user';
			});

			beforeEach(function (done) {
				request(url, function (err, resp) {
					console.log(err);
					error = err;
					response = resp;
					done();
				});
			});

			it ('should respond with 401', function () {
				expect(response.statusCode).to.equal(401);
			});
		});

		describe('when requesting resources', function () {
			beforeEach(function () {
				url = root + '/js/app.js';
			});

			beforeEach(function (done) {
				request(url, function (err, resp) {
					console.log(err);
					error = err;
					response = resp;
					done();
				});
			});

			it ('should respond with 401', function () {
				expect(response.statusCode).to.equal(401);
			});
		});
	});
});