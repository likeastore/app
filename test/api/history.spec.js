var request = require('request');
var testUtils = require('../utils');
var moment = require('moment');

describe('history.spec.js', function () {
	var token, user, url, headers, response, results, error;

	beforeEach(function () {
		url = testUtils.getRootUrl() + '/api/history';
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
				error = err;
				token = accessToken;
				user = createdUser;
				headers = {'X-Access-Token': accessToken};
				done(err);
			});
		});

		describe('when user have no items', function () {
			beforeEach(function (done) {
				request({url: url, headers: headers, json: true}, function (err, resp, body) {
					error = err;
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return no data', function () {
				expect(results.data.length).to.equal(0);
			});
		});

		describe('when user have one item', function () {
			beforeEach(function (done) {
				var db = testUtils.getDb();
				var item = {
					user: user.email,
					type: 'twitter',
					created: moment().toDate(),
					date: moment().toDate()
				};
				db.items.save(item, done);
			});

			beforeEach(function (done) {
				request({url: url, headers: headers, json: true}, function (err, resp, body) {
					error = err;
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return grouped feed', function () {
				expect(results.data.length).to.equal(1);
			});

			it('should have have proper data', function () {
				expect(moment(results.data[0].date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
				expect(results.data[0].twitter).to.equal(1);
			});
		});

		describe('when user have today items', function () {
			beforeEach(function (done) {
				var db = testUtils.getDb();
				var items = [
					{ user: user.email, type: 'twitter', created: moment().toDate(), date: moment().toDate() },
					{ user: user.email, type: 'twitter', created: moment().toDate(), date: moment().toDate() },
					{ user: user.email, type: 'github', created: moment().toDate(), date: moment().toDate() },
					{ user: user.email, type: 'facebook', created: moment().toDate(), date: moment().toDate() },

				];
				db.items.insert(items, done);
			});

			beforeEach(function (done) {
				request({url: url, headers: headers, json: true}, function (err, resp, body) {
					error = err;
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return grouped feed', function () {
				expect(results.data.length).to.equal(1);
			});

			it('should have have proper data - twitter', function () {
				expect(moment(results.data[0].date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
				expect(results.data[0].twitter).to.equal(2);
			});

			it('should have have proper data - github', function () {
				expect(moment(results.data[0].date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
				expect(results.data[0].github).to.equal(1);
			});

			it('should have have proper data - facebook', function () {
				expect(moment(results.data[0].date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
				expect(results.data[0].facebook).to.equal(1);
			});
		});

		describe('when user have today and yesterday items', function () {
			beforeEach(function (done) {
				var db = testUtils.getDb();

				var items = [
					{ user: user.email, type: 'twitter', created: moment().toDate(), date: moment().toDate() },
					{ user: user.email, type: 'twitter', created: moment().toDate(), date: moment().toDate() },
					{ user: user.email, type: 'github', created: moment().subtract('days', 1).toDate(), date: moment().subtract('days', 1).toDate() },
					{ user: user.email, type: 'facebook', created: moment().subtract('days', 1).toDate(), date: moment().subtract('days', 1).toDate() }
				];
				db.items.insert(items, {safe: true}, done);
			});

			beforeEach(function (done) {
				request({url: url, headers: headers, json: true}, function (err, resp, body) {
					error = err;
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return grouped feed', function () {
				expect(results.data.length).to.equal(2);
			});


			it('should have proper data for today', function () {
				expect(moment(results.data[0].date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
				expect(results.data[0].twitter).to.equal(2);
			});

			it('should have proper data for yesterday', function () {
				expect(moment(results.data[1].date).format('YYYY-MM-DD')).to.equal(moment().subtract('days', 1).format('YYYY-MM-DD'));
				expect(results.data[1].github).to.equal(1);
				expect(results.data[1].facebook).to.equal(1);
			});
		});

		describe('when user have two weeks items', function () {

		});
	});
});
