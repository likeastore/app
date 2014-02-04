var config = require('../../config');
var db = require('../db')(config);

function create(collection, callback) {
	if (!collection.public) {
		collection.public = false;
	}

	db.collections.save(collection, callback);
}

module.exports = {
	create: create
};