var exec = require('child_process').exec;
var logger = require('./utils/logger');

function bootstrapApp(callback) {
	logger.info('bootrapping application...');
	logger.info('running grunt build...');

	exec('./node_modules/grunt-cli/bin/grunt build', function (err) {
		if (err) {
			logger.error({message: 'failed to run grunt build.', err: err});
			process.exit(1);
		}

		logger.info('build js and css sources done.');
		callback (null);
	});
}

module.exports = {
	app: bootstrapApp
};