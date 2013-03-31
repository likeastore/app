var repository = require('./../../db/favorites.js');

function connector(app) {
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