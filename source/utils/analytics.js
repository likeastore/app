var analytics = require('analytics');
var config = require('../../config');

var env = process.env.NODE_ENV || 'development';
var app = 'likeastore-' + env;

var options = {
	server: config.analytics.url,
	// TODO: move to config
	credentials: {
		username: 'alexanderbeletsky',
		token: 'ebf6140a6314d7508a02300961636e9feffa73da'
	}
};

module.exports = analytics(app, options);