function connector(app) {
	app.post('/api/connector/github', function (req, res) {
		console.log('POST /api/connector/github');
		res.end();
	});
}

module.exports = connector;