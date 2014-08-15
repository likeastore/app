var _ = require('underscore');
var async = require('async');

var config = require('../../config');
var elastic = require('../elastic')(config);
var collections = require('./collections');

var ObjectId = require('mongojs').ObjectId;

function elasticSearch(query, filter, index, sort, pageFrom, pageSize, callback) {
	var searchQuery = {
		query: {
			filtered: {
				query: query,
				filter: filter
			}
		},
		highlight: {
			fields: {
				description: { },
				title: { },
				source: { }
			}
		},
		sort: sort
	};

	elastic.search({
		index: index,
		from: pageFrom,
		size: pageSize,
		body: searchQuery
	}, callback);
}

function genericSearch(options, callback) {
	var user = options.user;
	var index = options.index;
	var filter = options.filter || {};
	var sort = options.sort || {};
	var query = options.query;
	var text = options.query.text;
	var paging = options.paging;
	var elasticQuery = options.elasticQuery;
	var track = query.track;
	var from = query.from || 'extention';

	var page = (paging && paging.page) || 1;
	var pageSize = (paging && paging.pageSize) || config.app.pageSize;
	var pageFrom = (page - 1) * pageSize;

	elasticSearch(elasticQuery, filter, index, sort, pageFrom, pageSize, function (err, resp) {
		if (err) {
			return callback(err);
		}

		var items = resp.hits.hits.map(function (hit) {
			return _.omit(_.extend(hit._source, transform(hit.highlight)), options.omit);
		});

		items = items.map(function (item) {
			return track ? trackUrl(item, user, text) : item;
		});

		callback(null, {data: items, nextPage: items.length === paging.pageSize});
	});

	function transform(highlight) {
		var transformed = {};

		if (highlight && highlight.description && highlight.description.length > 0) {
			transformed.descriptionHtml = highlight.description[0];
		}

		if (highlight && highlight.title && highlight.title.length > 0) {
			transformed.titleHtml = highlight.title[0];
		}

		if (highlight && highlight.source && highlight.source.length > 0) {
			transformed.sourceHtml = highlight.source[0];
		}

		return transformed;
	}

	function trackUrl(item, user, text) {
		var track = {
			action: 'search results clicked',
			index: index,
			user: user.email, id: item._id,
			url: item.source,
			query: text.trim(),
			source: from
		};

		var payload = new Buffer(JSON.stringify(track)).toString('base64');
		var url = config.tracker.url + '/api/track?d=' + payload;

		return _.extend(item, {trackUrl: url});
	}
}

function commonSearch(options, callback) {
	var query = options.query;
	var text = query.text;

	if (!text) {
		return callback(null, { data: [], nextPage: false });
	}

	var elasticQuery = {
		common: {
			_all: {
				query: text,
				cutoff_frequency: 0.002,
				minimum_should_match: 2,
				low_freq_operator: 'and'
			}
		}
	};

	genericSearch(_.extend(options, {elasticQuery: elasticQuery}), callback);
}

function simpleSearch(options, callback) {
	var query = options.query;
	var text = query.text;

	if (!text) {
		return callback(null, { data: [], nextPage: false });
	}

	var elasticQuery = {
		simple_query_string: {
			query: text,
			analyzer: 'snowball',
			fields: ['_all'],
			default_operator: 'and'
		}
	};

	genericSearch(_.extend(options, {elasticQuery: elasticQuery}), callback);
}

function fallbackSearch(options, callback) {
	commonSearch(options, function (err, results) {
		if (err) {
			return callback(err);
		}

		if (results.data.length > 0) {
			return callback(null, results);
		}

		simpleSearch(options, callback);
	});
}

function searchOwnItems (user, query, paging, callback) {
	fallbackSearch({
		index: 'items',
		filter: {
			term: {
				user: user.email
			}
		},
		user: user,
		query: query,
		paging: paging,
		sort: { date: {order: 'desc'}},
		omit: 'userData'
	}, callback);
}

function searchFeed(user, query, paging, callback) {
	fallbackSearch({
		index: 'feeds',
		filter: {
			term: {
				feedOwner: user.email
			}
		},
		user: user,
		query: query,
		paging: paging,
		sort: { added: {order: 'desc'}},
		omit: 'userData'
	}, callback);
}

function searchCollections(user, query, paging, callback) {
	fallbackSearch({
		index: 'collections',
		filter: {
			term: {
				public: true
			}
		},
		user: user,
		query: query,
		paging: paging
	}, function (err, results) {
		if (err) {
			return callback(err);
		}

		var ids = results.data.map(function (c) {
			return new ObjectId(c._id);
		});

		collections.resolve(ids, function (err, resolved) {
			if (err) {
				return callback(err);
			}

			results.data = resolved;

			callback(null, results);
		});
	});
}

function advancedSearch(user, query, paging, callback) {
	async.parallel([
		function (callback) {
			searchOwnItems(user, query, paging, callback);
		},
		function (callback) {
			searchFeed(user, query, paging, callback);
		},
		function (callback) {
			searchCollections(user, query, paging, callback);
		}
	], function (err, results) {
		callback(err, {items: results[0], feeds: results[1], collections: results[2]});
	});
}

module.exports = {
	items: searchOwnItems,
	feed: searchFeed,
	collections: searchCollections,
	advanced: advancedSearch
};
