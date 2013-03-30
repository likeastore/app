var request = require('request');

module.exports = {
	handshake: function (token, callback) {
		request.post('http://localhost:3001/handshake', {token: token}, function(err, response) {
			return callback(err, response);
		});
	}
};