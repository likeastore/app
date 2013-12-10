var analytics = require('seismo-client');
var config = require('../../config');

var env = process.env.NODE_ENV || 'development';
var app = 'likeastore-' + env;

var options = {
	server: config.analytics.url,
	credentials: {
		username: config.analytics.username,
		password: config.analytics.password,
	}
};

module.exports = analytics(app, options);