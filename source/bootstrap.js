process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var exec = require('child_process').exec;
var logger = require('./utils/logger');

function bootstrapApp(callback) {
	if (process.env.NODE_ENV === 'development') {
		return callback (null);
	}

	logger.info('bootrapping application...');
	logger.info('running grunt build...');

	exec('./node_modules/grunt-cli/bin/grunt build', function (err) {
		if (err) {
			logger.error({message: 'failed to run grunt build.', err: err});
			process.exit(1);
		}

		logger.info('build js and css sources done.');
		return callback (null);
	});
}

module.exports = {
	app: bootstrapApp
};