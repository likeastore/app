var github = require('./connectors/github.js');
var twitter = require('./connectors/twitter.js');
var facebook = require('./connectors/facebook.js');

function handshaking(auth) {
	auth.on('auth:github:connected', function (data) {
		console.log('connected to github');

		github.handshake(data.token, function (err, response) {
			if (err) {
				return console.log('Failed handshake to github-connector.');
			}

			return console.log('Connected to github-connector.');
		});
	});

	auth.on('auth:twitter:connected', function (data) {
		console.log('connected to twitter');

		twitter.handshake(data.token, function (err, response) {
			if (err) {
				return console.log('Failed handshake to twitter-connector.');
			}

			return console.log('Connected to github-connector.');
		});
	});

	auth.on('auth:facebook:connected', function (data) {
		console.log('connected to facebook');

		facebook.handshake(data.token, function (err, response) {
			if (err) {
				return console.log('Failed handshake to facebook-connector.');
			}

			return console.log('Connected to facebook-connector.');
		});
	});
}

module.exports = handshaking;
