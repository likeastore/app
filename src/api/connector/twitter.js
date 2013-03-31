var repository = require('./../../db/favorites.js');

function connector(app) {
	app.get('/api/connector/github', function (req, res) {
		repository.all(function (err, docs) {
			// TODO: if error return 500
			res.end(docs);
		});
	});

	app.post('/api/connector/twitter', function (req, res) {
		var favorites = req.body.favorites;

		console.log('Recieved ' + favorites.length + ' favorites');

		repository.save(favorites, function (err) {
			// TODO: if error return 500
			return res.end();
		});
	});
}

module.exports = connector;