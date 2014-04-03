var _ = require('underscore');
var async = require('async');
var moment = require('moment');

var config = require('../../config');
var db = require('../db')(config);

var ObjectId = require('mongojs').ObjectId;

var userPickFields = ['_id', 'email', 'avatar', 'displayName', 'username'];
var itemOmitFields = ['collections', 'userData'];

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
	db.collections.find({user: user.email}, {fields: {items: 0, userData: 0}}, callback);
}

function findOne(user, collection, callback) {
	db.collections.findOne({user: user.email, _id: new ObjectId(collection)}, {fields: {items: 0}}, callback);
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
		checkUser,
		followCollection,
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

module.exports = {
	create: create,
	remove: remove,
	find: find,
	findOne: findOne,
	addItem: addItem,
	removeItem: removeItem,
	findItems: findItems,
	update: update,
	follow: follow
};