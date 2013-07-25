var _ = require('underscore');
var util = require('util');
var colors = require('colors');
var moment = require('moment');
var logentries = require('node-logentries');
var sinon = require('sinon');
var config = require('../../config');

var log = logentries.logger({
	token: config.logentries.token
});

log.level('info');

var logger = {
	colorsMap: {
		'success': 'green',
		'warning': 'yellow',
		'err': 'red',
		'info': 'grey'
	},

	success: function (message) {
		this.log('success', message);
	},

	warning: function (message) {
		this.log('warning', message);
	},

	error: function (message) {
		this.log('err', message);
	},

	info: function (message) {
		this.log('info', message);
	},

	log: function (type, message) {
		var record = this.timestamptMessage(util.format('%s: %s', type.toUpperCase(), this.formatMessage(message)));
		console.log(record[this.colorsMap[type]]);
	},

	formatMessage: function (message) {
		return typeof message === 'string' ? message : JSON.stringify(message);
	},

	timestamptMessage: function (message) {
		return util.format('[%s] %s', moment(), message);
	}

};

var logentriesLogger = (function (_super) {
	var child = {
		log: function (type, message) {
			_super.log(type, message);
			log.log(type, message);
		}
	};

	return _.extend(Object.create(_super), child);
})(logger);


function loggerFactory (env) {
	return env === 'test' ? sinon.stub (logentriesLogger) : logentriesLogger;
}

module.exports = loggerFactory(process.env.TEST_ENV);