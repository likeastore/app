var github = require('./../connectors/github.js');
var twitter = require('./../connectors/twitter.js');
var facebook = require('./../connectors/facebook.js');

function handshake(app) {

	app.post('/api/handshake/github', function (req, res) {
		console.log('POST /api/handshake/github');

		github.handshake(function (err, response) {
			if (err) {
				return console.log('failed handshake to github-connector.');
			}

			res.end();
		});
	});


	app.post('/api/handshake/twitter', function (req, res) {
		console.log('POST /api/handshake/twitter');

		twitter.handshake(function (err, response) {
			if (err) {
				return console.log('FAILED handshake to github-connector.');
			}

			res.end();
		});
	});
}

module.exports = handshake;