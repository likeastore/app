var exec = require('child_process').exec;
var logger = require('./utils/logger');

logger.info('bootrapping application in: ' + process.cwd());
logger.info('running grunt build...');

exec('./node_modules/grunt-cli/bin/grunt build', function (err, stdout, stderr) {
	if (err) {
		logger.fatal({message: 'fatal error', err: JSON.stringify(err), stdout: stdout, stderr: stderr});
		process.exit(1);
	}

	logger.info('build js and css sources done.');
	process.exit(0);
});
