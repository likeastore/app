function connector(app) {
	app.post('/api/connector/github', function (req, res) {
		console.log(req.body);
		res.end();
	});
}

module.exports = connector;