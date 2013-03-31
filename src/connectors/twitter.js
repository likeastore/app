var repository = require('./../db/favorites.js');
var request = require('request');

module.exports = {
	handshake: function (callback) {
		var postUrl = 'http://localhost:3000/api/connector/twitter';
		var twitterConnectorUrl = 'http://localhost:3002/handshake';

		console.log('Handshaking twitter on:' + twitterConnectorUrl);

		request.post(twitterConnectorUrl, {form: {postUrl: postUrl}}, function(err, response) {
			return callback(err, response);
		});
	}
};