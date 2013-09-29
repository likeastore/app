var analytics = require('analytics');
var config = require('../../config');

var env = process.env.NODE_ENV || 'development';
var app = 'likeastore-' + env;

module.exports = analytics(app, config.analytics.url);