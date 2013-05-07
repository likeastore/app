var local = require('./production.config.js');

function createConfig() {
	var env = process.env.NODE_ENV || 'development';
	if (env === 'development') {
		return require('./local.config.js');
	}

	if (env === 'production') {
		return require('./production.config.js');
	}
}

module.exports = createConfig;