var analytics = require('seismo-client');
var config = require('../../config');

var options = {
	server: config.analytics.url,
	credentials: {
		username: config.analytics.username,
		password: config.analytics.password,
	}
};

module.exports = analytics(config.analytics.application, options);