/**
 * Mongodb connector
 */
var config = require('likeastore-config');
var mongo = require('mongojs');
var logger = require('./../utils/logger');

// specify app collections here
var collections = ['users', 'networks', 'items', 'subscribers'];

// get db with default collections list
logger.info({message: 'connecting to mongo'});
var db = mongo.connect(config.connection, collections);

/*
 * Overwrite db url or collections if needed
 * @param options {Object} - possible values:
 * url {String}, collection {Array}
 * e.g. { url: username:password@host:port/dbname?params), collections: ['name', 'name2' ...] }
 */
var setDb = function (options) {
	var url = options.url ? options.url : config.connection,
		list = options.collections ? options.collections : collections;

	return mongo.connect(url, list);
};

module.exports = {
	db: db,
	setDb: setDb
};