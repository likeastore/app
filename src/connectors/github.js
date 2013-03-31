var repository = require('./../db/stars.js');
var request = require('request');

module.exports = {
	handshake: function (callback) {
		var postUrl = 'http://localhost:3000/api/connector/github';
		var githubConnectorUrl = 'http://localhost:3001/handshake';

		console.log('Handshaking github on:' + githubConnectorUrl);

		repository.removeAll(serviceHandshake);

		function serviceHandshake(err) {
			if (err) {
				return callback(err);
			}

			request.post(githubConnectorUrl, {form: {postUrl: postUrl}}, function(err, response) {
				return callback(err, response);
			});
		}

	}
};