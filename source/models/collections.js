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

function find(user, callback) {
	db.collections.find({user: user.email}, callback);
}

function add(user, collection, item, callback) {
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

module.exports = {
	create: create,
	find: find,
	add: add,
	findItems: findItems
};