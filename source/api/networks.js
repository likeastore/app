var networks = require('../models/networks');
var middleware = require('../middleware');
var config = require('../../config');

function networksService(app) {

	app.get('/api/networks', getAllNetworks);

	app.del('/api/networks/:network',
		middleware.analytics.track('network deleted', {param: 'network'}),
		deleteNetwork);

	app.post('/api/networks/twitter',
		middleware.networks.twitter(),
		returnAuthUrl
	);

	app.post('/api/networks/github',
		middleware.networks.github(),
		returnAuthUrl
	);

	app.post('/api/networks/gist',
		middleware.networks.github('gist'),
		returnAuthUrl
	);

	app.post('/api/networks/stackoverflow',
		middleware.networks.stackoverflow(),
		returnAuthUrl
	);

	app.post('/api/networks/facebook',
		middleware.networks.facebook(),
		returnAuthUrl
	);

	app.post('/api/networks/vimeo',
		middleware.networks.vimeo(),
		returnAuthUrl
	);

	app.get('/api/networks/twitter/callback',
		middleware.access.guest(),
		middleware.networks.twitterCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'twitter'}),
		redirectToApp);

	app.get('/api/networks/github/callback',
		middleware.access.guest(),
		middleware.networks.githubCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'github'}),
		redirectToApp);

	app.get('/api/networks/gist/callback',
		middleware.access.guest(),
		middleware.networks.githubCallback('gist'),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'gist'}),
		redirectToApp);

	app.get('/api/networks/stackoverflow/callback',
		middleware.access.guest(),
		middleware.networks.stackoverflowCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'stackoverflow'}),
		redirectToApp);

	app.get('/api/networks/facebook/callback',
		middleware.access.guest(),
		middleware.networks.facebookCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'facebook'}),
		redirectToApp);

	app.get('/api/networks/vimeo/callback',
		middleware.access.guest(),
		middleware.networks.vimeoCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'vimeo'}),
		redirectToApp);

	function registerNetwork(req, res, next) {
		networks.createOrUpdate(req.network, next);
	}

	function getAllNetworks(req, res) {
		networks.findNetworks(req.user, function (err, nets) {
			if (err) {
				return res.send(500, err);
			}
			res.json(nets);
		});
	}

	function deleteNetwork(req, res) {
		networks.removeNetwork(req.user, req.params.network, function (err) {
			if (err) {
				return res.send(500, err);
			}
			res.send(200);
		});
	}

	function returnAuthUrl(req, res) {
		res.json({authUrl: req.authUrl});
	}

	function redirectToApp(req, res) {
		res.redirect(config.applicationUrl + '/settings');
	}
}

module.exports = networksService;