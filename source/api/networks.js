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

	app.post('/api/networks/youtube',
		middleware.networks.youtube(),
		returnAuthUrl
	);

	app.post('/api/networks/dribbble',
		middleware.networks.dribbble(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'dribbble'}),
		middleware.ga.track('network', 'turnon', 'users'),
		returnNetwork
	);

	app.get('/api/networks/dribbble/:username',
		getDribbbleUser
	);

	app.post('/api/networks/behance',
		middleware.networks.behance(),
		returnAuthUrl
	);

	app.post('/api/networks/pocket',
		middleware.networks.pocket(),
		returnAuthUrl
	);

	app.post('/api/networks/tumblr',
		middleware.networks.tumblr(),
		returnAuthUrl
	);

	app.post('/api/networks/instagram',
		middleware.networks.instagram(),
		returnAuthUrl
	);

	app.get('/api/networks/twitter/callback',
		middleware.access.guest(),
		middleware.networks.twitterCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'twitter'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/github/callback',
		middleware.access.guest(),
		middleware.networks.githubCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'github'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/gist/callback',
		middleware.access.guest(),
		middleware.networks.githubCallback('gist'),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'gist'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/stackoverflow/callback',
		middleware.access.guest(),
		middleware.networks.stackoverflowCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'stackoverflow'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/facebook/callback',
		middleware.access.guest(),
		middleware.networks.facebookCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'facebook'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/vimeo/callback',
		middleware.access.guest(),
		middleware.networks.vimeoCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'vimeo'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/youtube/callback',
		middleware.access.guest(),
		middleware.networks.youtubeCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'vimeo'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/behance/callback',
		middleware.access.guest(),
		middleware.networks.behanceCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'behance'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/pocket/callback',
		middleware.access.guest(),
		middleware.networks.pocketCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'pocket'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/tumblr/callback',
		middleware.access.guest(),
		middleware.networks.tumblrCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'tumblr'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

	app.get('/api/networks/instagram/callback',
		middleware.access.guest(),
		middleware.networks.instagramCallback(),
		registerNetwork,
		middleware.analytics.track('network created', {service: 'instagram'}),
		middleware.ga.track('network', 'turnon', 'users'),
		redirectToSettings
	);

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

	function returnNetwork(req, res) {
		res.json(req.network);
	}

	function redirectToSettings(req, res) {
		res.redirect(config.applicationUrl + '/settings');
	}

	function getDribbbleUser(req, res) {
		networks.getDribbbleUser(req.params.username, function (err, user) {
			if (err) {
				return res.send(404, err);
			}
			res.json(user);
		});
	}
}

module.exports = networksService;