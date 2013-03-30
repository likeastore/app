var request = require('request');

module.exports = {
	handshake: function (callback) {
		var postUrl = 'http://localhost:3000/api/connector/github';

		request.post('http://localhost:3001/handshake', {form: {postUrl: postUrl}}, function(err, response) {
			return callback(err, response);
		});
	}
};