var repository = require('./../db/favorites.js');
var request = require('request');

module.exports = {
	handshake: function (callback) {
		var postUrl = 'http://localhost:3000/api/connector/github';
		var twitterConnectorUrl = 'http://localhost:3002/handshake';

		console.log('Handshaking twitter on:' + twitterConnectorUrl);

		repository.removeAll(serviceHandshake);

		function serviceHandshake(err) {
			if (err) {
				return callback(err);
			}

			request.post(twitterConnectorUrl, {form: {postUrl: postUrl}}, function(err, response) {
				return callback(err, response);
			});
		}
	}
};