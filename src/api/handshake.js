var github = require('./../connectors/github.js');
var twitter = require('./../connectors/twitter.js');
var facebook = require('./../connectors/facebook.js');

function handshake(app) {

	app.post('/api/handshake/github', function (req, res) {
		console.log('/api/handshake/github');

		github.handshake(function (err, response) {
			if (err) {
				return console.log('failed handshake to github-connector.');
			}

			return console.log('connected to github-connector.');
		});
	});
}

module.exports = handshake;