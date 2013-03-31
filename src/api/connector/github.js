function connector(app) {
	app.post('/api/connector/github', function (req, res) {
		res.end();
	});
}

module.exports = connector;