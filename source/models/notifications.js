var request = require('request');
var config = require('../../config');
var logger = require('../utils/logger');

function notifierRequestUrl() {
	return config.notifier.url + '/api/events?access_token=' + config.notifier.accessToken;
}

function welcomeEmail(user, callback) {
	var url = notifierRequestUrl();
	var event = {event: 'user-registered',  user: user.email };

	request.post({url: url, body: event, json: true}, function (err) {
		if (err) {
			logger.warning({message: 'failed to send event to notifier', err: err});
		}

		callback && callback();
	});
}

module.exports = {
	welcomeEmail: welcomeEmail
};
