var db = require('./db.js').getDb('likeastore');

function save(stars, callback) {
	return callback(null);
}

module.exports = {
	save: save
};