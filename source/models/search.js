var _ = require('underscore');
var config = require('../../config');
var db = require('../db')(config);

function fullTextItemSearch (user, query, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	db.items.runCommand('text', { search: query.toString(), filter: {user: user.email }}, function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (doc && doc.errmsg) {
			return callback(doc.errmsg);
		}

		var items = doc.results.map(function (result) {
			return result.obj;
		});

		callback(null, { data: items, nextPage: false });
	});
}

function fullTextCollectionsSearch(user, query, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	db.collections.runCommand('text', { search: query.toString() }, function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (doc && doc.errmsg) {
			return callback(doc.errmsg);
		}

		var items = doc.results.map(function (result) {
			return transformCollection(result.obj);
		});

		callback(null, { data: items, nextPage: false });
	});
}

function transformCollection(collection) {
	var clone = _.clone(collection);
	var count = (collection.items && collection.items.length) || 0;
	var followers = (collection.followers && collection.followers.length) || 0;

	return _.extend(clone, {count:  count, followersCount: followers});
}

module.exports = {
	items: fullTextItemSearch,
	collections: fullTextCollectionsSearch
};
