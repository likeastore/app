var _ = require('underscore');
var elasticsearch = require('elasticsearch');

module.exports = function (config) {
	var client = elasticsearch.Client(_.clone(config.elastic));

	return client;
};
