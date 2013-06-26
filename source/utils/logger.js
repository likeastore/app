var util = require('util');
var colors = require('colors');
var moment = require('moment');
var logentries = require('node-logentries');
var sinon = require('sinon');

var log = logentries.logger({
	token:process.env.LOGENTRIES_TOKEN
});
log.level('info');

var logger = {
	success: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('SUCCESS: %s', message)).green);
		log.log('info', message);
	},

	warning: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('WARNING: %s', message)).yellow);
		log.log('warning', message);
	},

	error: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('ERROR: %s', message)).red);
		log.log('err', message);
	},

	info: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(message));
		log.log('info', message);
	},

	connector: function (name) {
		var me = this;

		return {
			info: function (message) {
				me.info('connector ' + name + ': ' + message);
			},
			warning: function (message) {
				me.warning('connector ' + name + ': ' + message);
			},
			error: function (message) {
				me.error('connector ' + name + ': ' + message);
			},
			success: function (message) {
				me.success('connector ' + name + ': ' + message);
			}
		};
	},

	timestamptMessage: function (message) {
		return util.format('[%s] %s', moment(), message);
	}
};

function loggerFactory (env) {
	return env === 'test' ? sinon.stub (logger) : logger;
}

module.exports = loggerFactory(process.env.TEST_ENV);