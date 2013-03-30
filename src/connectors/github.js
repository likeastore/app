var request = require('request');

module.exports = {
	handshake: function (token, callback) {
		var postUrl = 'http://localhost:3000/api/connector/github/stars';

		request.post('http://localhost:3001/handshake', {form: {token: token, postUrl: postUrl}}, function(err, response) {
			return callback(err, response);
		});
	}
};