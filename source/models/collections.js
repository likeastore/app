var _ = require('underscore');
var async = require('async');
var moment = require('moment');

var config = require('../../config');
var db = require('../db')(config);

var users = require('./users');

var ObjectId = require('mongojs').ObjectId;

var userPickFields = ['_id', 'email', 'avatar', 'displayName', 'name'];
var itemOmitFields = ['collections', 'userData'];
var collectionOmitFields = ['items'];
var notifier = require('./notifier');

var pageSize = 30;

function transform(collection) {
	var clone = _.clone(collection);
	var count = (collection.items && collection.items.length) || 0;
	var followers = (collection.followers && collection.followers.length) || 0;

	return _.omit(_.extend(clone, {count:  count, followersCount: followers}), collectionOmitFields);
}

function create(user, collection, callback) {
	async.waterfall([
		createCollection,
		notifyFollowers
	], callback);

	function createCollection(callback) {
		collection.user = user.email;
		collection.userData = _.pick(user, userPickFields);

		if (!collection.public) {
			collection.public = false;
		}

		db.collections.save(collection, callback);
	}

	function notifyFollowers(collection, callback) {
		if (collection.public) {
			notifier('collection created', user, {collection: collection._id});
		}

		callback(null, collection);
	}
}

function remove(user, collection, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	collection = new ObjectId(collection);

	async.waterfall([
		removeCollectionFromItems,
		removeCollection
	], callback);

	function removeCollectionFromItems(callback) {
		db.items.findAndModify({
			query: {user: user.email, collections: {$elemMatch: {id: collection}}},
			update: {$pull: {collections: {id: collection}}}
		}, function (err) {
			callback(err);
		});
	}

	function removeCollection(callback) {
		db.collections.remove({_id: collection}, callback);
	}
}

function find(user, callback) {
	db.collections.find({user: user.email}, function (err, collections) {
		if (err) {
			return callback(err);
		}

		callback(null, collections.map(transform));
	});
}

function findOne(user, collection, callback) {
	db.collections.findOne({_id: new ObjectId(collection)}, function(err, collection) {
		if (err) {
			return callback(err);
		}

		if (!collection) {
			return callback({message: 'collection not found', status: 404});
		}

		callback(null, transform(collection));
	});
}

function findByUser(userName, callback) {
	users.findByName(userName, function (err, user) {
		if (err) {
			return callback(err);
		}

		if (!user) {
			return callback({message: 'user not found', username: userName, status: 404});
		}

		find(user, function (err, collections) {
			if (err) {
				return callback(err);
			}

			var public = collections.filter(function (c) {
				return c.public === true;
			});

			callback(null, public);
		});
	});
}

function addItem(user, collection, item, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	if (!item) {
		return callback({message: 'missing item id', status: 412});
	}

	async.waterfall([
		findCollection,
		putCollectionIdToItem,
		putItemToCollection,
		notifyFollowers
	], callback);


	function findCollection(callback) {
		db.collections.findOne({user: user.email, _id: new ObjectId(collection)}, callback);
	}

	function putCollectionIdToItem(collection, callback) {
		db.items.findAndModify({
			query: {_id: new ObjectId(item)},
			update: {$addToSet: {collections: {id: collection._id}}}
		}, function (err, item) {
			if (err) {
				return callback(err);
			}

			callback(err, item, collection);
		});
	}

	function putItemToCollection(item, collection, callback) {
		var exists = _.find(collection.items, function (i) {
			return i._id.equals(item._id);
		});

		if (exists) {
			return callback(null, null, collection);
		}

		var extended = _.extend(item, {added: moment().toDate()});

		var updateCollectionQuery = {
			$addToSet: {items: _.omit(extended, itemOmitFields)}
		};

		if (item.thumbnail && !collection.thumbnail) {
			updateCollectionQuery = _.extend(updateCollectionQuery, {
				$set: {thumbnail: item.thumbnail}
			});
		}

		db.collections.findAndModify({
			query: {user: user.email, _id: collection._id},
			update: updateCollectionQuery
		}, function (err) {
			callback(err, item, collection);
		});
	}

	function notifyFollowers(item, collection, callback) {
		if (item) {
			notifier('collection item added', user, {item: item._id, collection: collection._id});
		}

		callback(null, item, collection);
	}
}

function removeItem(user, collection, item, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	if (!item) {
		return callback({message: 'missing item id', status: 412});
	}

	async.waterfall([
		pullItemFromCollection,
		pullCollectionFromItem
	], callback);

	function pullItemFromCollection(callback) {
		db.collections.findAndModify({
			query: {user: user.email, _id: new ObjectId(collection)},
			update: {$pull: {items: {_id: new ObjectId(item)}}}
		}, callback);
	}

	function pullCollectionFromItem(collection) {
		db.items.findAndModify({
			query: {_id: new ObjectId(item)},
			update: {$pull: {collections: {id: collection._id}}}
		}, callback);
	}
}

function findItems(user, collection, page, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	page = page || 1;

	db.collections.aggregate([
		{
			$match: {_id: new ObjectId(collection)}
		},
		{
			$unwind: '$items'
		},
		{
			$project: {
				_id: 0,
				item: '$items',
				collection: {
					_id: '$_id',
					title: '$title',
					description: '$description',
					owner: '$userData'
				}
			}
		},
		{
			$sort: { 'item.added': -1 }
		},
		{
			$skip: pageSize * (page - 1)
		},
		{
			$limit: pageSize
		}
	], function (err, items) {
		items = (items && items.map(function (i) {
			return _.extend(i.item, {collection: i.collection});
		})) || [];

		callback(null, {data: items, nextPage: items.length === pageSize});
	});
}

function update(user, collection, patch, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	db.collections.findOne({user: user.email, _id: new ObjectId(collection)}, function (err, collection) {
		if (err) {
			return callback(err);
		}

		if (!collection) {
			return callback({message: 'collection not found', status: 404});
		}

		patch = _.extend(collection.properties || {}, patch);

		db.collections.findAndModify({
			query: {user: user.email, _id: collection._id},
			update: {$set: patch},
			'new': true
		}, function (err, collection) {
			if (collection.public) {
				notifier('collection created', user, {collection: collection._id});
			}

			callback(err, collection);
		});
	});
}

function follow(user, collection, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	async.waterfall([
		checkCollection,
		followCollection,
		updateOwner,
		updateUser,
		notifyOwner
	], callback);

	function checkCollection(callback) {
		db.collections.findOne({_id: new ObjectId(collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', status: 404});
			}

			if (!collection.public) {
				return callback({message: 'can\'t follow private collection', status: 403 });
			}

			if (collection.user === user.email) {
				return callback({message: 'can\'t follow own collection', status: 403});
			}

			callback(null, collection);
		});
	}

	function followCollection(collection, callback) {
		db.collections.findAndModify({
			query: {_id: collection._id},
			update: { $addToSet: { followers: _.pick(user, userPickFields) }}
		}, function (err, collection) {
			callback(err, collection);
		});
	}

	function updateOwner(collection, callback) {
		db.users.findAndModify({
			query: {_id: collection.userData._id },
			update: { $addToSet: { followed: _.pick(user, userPickFields) }}
		}, function (err) {
			callback(err, collection);
		});
	}

	function updateUser(collection, callback) {
		db.users.findAndModify({
			query: {email: user.email},
			update: {$addToSet: {followCollections: {id: collection._id}}}
		}, function (err, user) {
			callback(err, user, collection);
		});
	}

	function notifyOwner(user, collection, callback) {
		notifier('collection followed', user, {follower: user._id, collection: collection._id}, callback);
	}
}

function unfollow(user, collection, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	async.waterfall([
		checkUser,
		unfollowCollection,
		updateOwner,
		updateUser
	], callback);

	function checkUser(callback) {
		db.collections.findOne({_id: new ObjectId(collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', status: 404});
			}

			if (collection.user === user.email) {
				return callback({message: 'can\'t unfollow own collection', status: 403});
			}

			callback(null, collection);
		});
	}

	function unfollowCollection(collection, callback) {
		db.collections.findAndModify({
			query: {_id: collection._id},
			update: { $pull: { followers: _.pick(user, userPickFields) }}
		}, function (err, collection) {
			callback(err, collection);
		});
	}

	function updateOwner(collection, callback) {
		db.users.findAndModify({
			query: {_id: collection.userData._id },
			update: { $pull: { followed: _.pick(user, userPickFields) }}
		}, function (err) {
			callback(err, collection);
		});
	}

	function updateUser(collection, callback) {
		db.users.findAndModify({
			query: {email: user.email},
			update: {$pull: {followCollections: {id: collection._id}}}
		}, callback);
	}
}

function followedBy(user, name, callback) {
	users.findByName(name, function (err, user) {
		if (err) {
			return callback(err);
		}

		var follows = user.followCollections;

		if (!follows || follows.length === 0) {
			return callback(null, []);
		}

		var ids = follows.map(function (f) {
			return f.id;
		});

		db.collections.find({_id: {$in: ids}}, function (err, collections) {
			if (err) {
				return callback(err);
			}

			callback(null, collections.map(transform));
		});
	});
}

function popular(user, callback) {
	db.collections.find({public: true, followers: {$exists: true}}).limit(50, function (err, collections) {
		if (err) {
			return callback(err);
		}

		callback(null, collections.map(transform));
	});
}

function search(user, query, callback) {
	if (!query) {
		return callback(null, { data: [], nextPage: false });
	}

	db.collections.runCommand('text', { search: query.toString(), filter: {'public': true} }, function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (doc && doc.errmsg) {
			return callback(doc.errmsg);
		}

		var items = doc.results.map(function (result) {
			return transform(result.obj);
		});

		callback(null, { data: items, nextPage: false });
	});
}


module.exports = {
	create: create,
	remove: remove,
	find: find,
	findOne: findOne,
	findByUser: findByUser,
	addItem: addItem,
	removeItem: removeItem,
	findItems: findItems,
	update: update,
	follow: follow,
	unfollow: unfollow,
	followedBy: followedBy,
	popular: popular,
	search: search
};
