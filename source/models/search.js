var _ = require('underscore');
var async = require('async');

var config = require('../../config');
var elastic = require('../elastic')(config);

function genericSearch(index, filter, user, query, paging, callback) {
	var text = query.text;
	var track = query.track;
	var from = query.from || 'extention';

	if (!text) {
		return callback(null, { data: [], nextPage: false });
	}

	var page = (paging && paging.page) || 1;
	var pageSize = (paging && page.pageSize) || config.app.pageSize;
	var pageFrom = (page - 1) * pageSize;

	elastic.search({
		index: index,
		from: pageFrom,
		size: pageSize,
		body: {
			query: {
				filtered: {
					query: {
						common: {
							_all: {
								query: text,
								cutoff_frequency: 0.002,
								minimum_should_match: 2,
								low_freq_operator: 'and'
							}
						}
					},
					filter: filter,
				}
			},
			highlight: {
				fields: {
					description: { },
					title: { },
					source: { }
				}
			}
		}
	}, function (err, resp) {
		if (err) {
			return callback(err);
		}

		var items = resp.hits.hits.map(function (hit) {
			return _.omit(_.extend(hit._source, transform(hit.highlight)), 'userData');
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

function searchOwnItems (user, query, paging, callback) {
	var filter = {
		term: {
			user: user.email
		}
	};

	genericSearch('items', filter, user, query, paging, callback);
}

function searchFeed(user, query, paging, callback) {
	var filter = {
		term: {
			feedOwner: user.email
		}
	};

	genericSearch('feeds', filter, user, query, paging, callback);
}

function searchCollections(user, query, paging, callback) {
	var filter = {
	};

	genericSearch('collections', filter, user, query, paging, callback);
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
		callback(err, {items: results[0], feed: results[1], collections: results[2]});
	});
}

module.exports = {
	items: searchOwnItems,
	feed: searchFeed,
	collections: searchCollections,
	advanced: advancedSearch
};
