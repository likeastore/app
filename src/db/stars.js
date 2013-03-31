var db = require('./db.js').getDb('likeastore');

function save(stars, callback) {
	return callback(null);
}

function all(callback) {
	return callback(null);
}

function top(count, callback) {
	return callback(null);
}

function removeAll(callback) {
	return callback(null);
}

module.exports = {
	save: save,
	all: all,
	top: top,
	removeAll: removeAll
};