var repository = require('./../../db/stars.js');

function connector(app) {
	app.get('/api/connector/github', function (req, res) {
		repository.all(function (err, docs) {
			// TODO: if error return 500
			res.end(docs);
		});
	});

	app.post('/api/connector/github', function (req, res) {
		var stars = req.body.stars;

		console.log('Recieved ' + stars.length + ' stars');

		repository.save(stars, function (err) {
			// TODO: if error return 500
			return res.end();
		});
	});
}

module.exports = connector;