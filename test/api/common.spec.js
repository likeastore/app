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
					error = err;
					response = resp;
					done();
				});
			});

			it ('should respond with 200', function () {
				expect(response.statusCode).to.equal(200);
			});

			it ('should return master page', function () {
				expect(response.body.indexOf('<!doctype html>')).to.equal(0);
			});
		});

		describe('when requesting any route', function () {
			beforeEach(function () {
				url = root + '/anything';
			});

			beforeEach(function (done) {
				request(url, function (err, resp) {
					error = err;
					response = resp;
					done();
				});
			});

			it ('should respond with 200', function () {
				expect(response.statusCode).to.equal(200);
			});

			it ('should return master page', function () {
				expect(response.body.indexOf('<!doctype html>')).to.equal(0);
			});
		});

		describe('when requesting api', function () {
			beforeEach(function () {
				url = root + '/api/user';
				console.log(url);
			});

			beforeEach(function (done) {
				request(url, function (err, resp) {
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
					error = err;
					response = resp;
					done();
				});
			});

			it ('should respond with 200', function () {
				expect(response.statusCode).to.equal(200);
			});
		});
	});
});