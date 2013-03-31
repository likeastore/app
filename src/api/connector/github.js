var repository = require('./../../db/stars.js');

function connector(app) {
	app.post('/api/connector/github', function (req, res) {
		var stars = req.body;

		repository.save(stars, function (err) {
			// TODO: if error return 500
			return res.end();
		});
	});
}

module.exports = connector;