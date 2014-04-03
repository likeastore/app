var pack = require('../../package');
var middleware = require('../middleware');
var config = require('../../config');
var db = require('../db')(config);

function monitorService(app) {

	app.get('/api/monitor',
		middleware.access.guest(),
		getMonitor);

	function getMonitor(req, res, next) {
		db.users.findOne({email: 'alexander.beletsky@gmail.com'}, function (err, user) {
			if (err) {
				return next(err);
			}

			res.json({app: 'app.likeastore.com', env: process.env.NODE_ENV, version: pack.version, apiUrl: '/api'});
		});

	}
}

module.exports = monitorService;