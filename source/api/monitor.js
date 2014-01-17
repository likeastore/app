var pack = require('../../package');
var middleware = require('../middleware');

function monitorService(app) {

	app.get('/api/monitor',
		middleware.access.guest(),
		getMonitor);

	function getMonitor(req, res) {
		res.json({app: 'app.likeastore.com', env: process.env.NODE_ENV, version: pack.version, apiUrl: '/api'});
	}
}

module.exports = monitorService;