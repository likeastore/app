function connector(app) {
	app.post('/api/connector/twitter', function (req, res) {
		res.end();
	});
}

module.exports = connector;