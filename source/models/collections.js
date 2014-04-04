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

function transform(collection) {
	var clone = _.clone(collection);
	var count = (collection.items && collection.items.length) || 0;

	return _.omit(_.extend(clone, {count:  count}), collectionOmitFields);
}

function create(user, collection, callback) {
	collection.user = user.email;
	collection.userData = _.pick(user, userPickFields);

	if (!collection.public) {
		collection.public = false;
	}

	db.collections.save(collection, callback);
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
	db.collections.findOne({user: user.email, _id: new ObjectId(collection)}, function(err, collection) {
		if (err) {
			return callback(err);
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
		putItemToCollection
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
		var extended = _.extend(item, {added: moment().toDate()});

		db.collections.findAndModify({
			query: {user: user.email, _id: collection._id},
			update: {$addToSet: {items: _.omit(extended, itemOmitFields)}}
		}, callback);
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
			update: {$pull: {items: {_id: new ObjectId(item)}}},
		}, callback);
	}

	function pullCollectionFromItem(collection) {
		db.items.findAndModify({
			query: {_id: new ObjectId(item)},
			update: {$pull: {collections: {id: collection._id}}}
		}, callback);
	}
}

function findItems(user, collection, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

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
		}
	], function (err, items) {
		items = (items && items.map(function (i) {
			return _.extend(i.item, {collection: i.collection});
		})) || [];

		callback(null, items);
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
		}, callback);
	});
}

function follow(user, collection, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	async.waterfall([
		checkCollection,
		followCollection,
		updateUser
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

	function updateUser(collection, callback) {
		db.users.findAndModify({
			query: {email: user.email},
			update: {$addToSet: {followCollections: {id: collection._id}}}
		}, callback);
	}
}

function unfollow(user, collection, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	async.waterfall([
		checkUser,
		unfollowCollection,
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
	followedBy: followedBy
};