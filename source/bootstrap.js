var exec = require('child_process').exec;
var logger = require('./utils/logger');

function bootstrapApp(callback) {
	var env = process.env.NODE_ENV || 'development';
	if (env === 'development') {
		return callback (null);
	}

	logger.info('bootrapping application in: ' + __dirname);
	logger.info('running grunt build...');

	exec('./node_modules/grunt-cli/bin/grunt build', function (err) {
		if (err) {
			return callback(err);
		}

		logger.info('build js and css sources done.');
		return callback (null);
	});
}

module.exports = {
	app: bootstrapApp
};