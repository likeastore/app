var analytics = require('analytics');
var config = require('../../config');

var app = 'likeastore-' + process.env.NODE_ENV;

module.exports = analytics(app, config.analytics.url);