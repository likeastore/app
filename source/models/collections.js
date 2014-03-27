var _ = require('underscore');
var config = require('../../config');
var db = require('../db')(config);

var ObjectId = require('mongojs').ObjectId;

function create(user, collection, callback) {
	collection.user = user.email;

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

	db.items.update({user: user.email, collections: {$elemMatch: {id:  collection}}}, {$pull: {collections: {id: collection}}}, function (err) {
		if (err) {
			return callback(err);
		}

		db.collections.remove({_id: collection}, callback);
	});
}

function find(user, callback) {
	db.collections.find({user: user.email}, callback);
}

function addItem(user, collection, item, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	if (!item) {
		return callback({message: 'missing item id', status: 412});
	}

	db.collections.findOne({user: user.email, _id: new ObjectId(collection)}, function (err, collection) {
		if (err) {
			return callback(err);
		}

		if (!collection) {
			return callback({message: 'collection not found', status: 404});
		}

		db.items.update({user: user.email, _id: new ObjectId(item)}, {$addToSet: {collections: {id: collection._id, title: collection.title}}}, callback);
	});
}

function removeItem(user, collection, item, callback) {
	if (!collection) {
		return callback({message: 'missing collection id', status: 412});
	}

	if (!item) {
		return callback({message: 'missing item id', status: 412});
	}

	db.collections.findOne({user: user.email, _id: new ObjectId(collection)}, function (err, collection) {
		if (err) {
			return callback(err);
		}

		if (!collection) {
			return callback({message: 'collection not found', status: 404});
		}

		db.items.update({user: user.email, _id: new ObjectId(item)}, {$pull: {collections: {id: collection._id}}}, callback);
	});
}

function findItems(user, collection, callback) {
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

		db.items.find({user: user.email, collections: {$elemMatch: {id: collection._id}}}, callback);
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

module.exports = {
	create: create,
	remove: remove,
	find: find,
	addItem: addItem,
	removeItem: removeItem,
	findItems: findItems,
	update: update
};
