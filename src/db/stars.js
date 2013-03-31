var db = require('./db.js').getDb('likeastore');

function save(data, callback) {
	data.stars.forEach(function (star, i) {
		db.view('stars/stars', { key: star.id }, function (err, docs) {
			if (err) {
				return callback(err);
			}

			if (docs.length > 0) {
				db.merge(docs[0].id, star, function (err, doc) {
					if (err) {
						return callback(err);
					}
					console.info('updated star with id:' + doc.id);
				});
			} else {
				db.save(star, function (err, doc) {
					if (err) {
						return callback(err);
					}
					console.info('saved star with id:' + doc.id);
				});
			}
		});
	});
	return callback(null);
}

function all(callback) {
	db.view('stars/all', function (err, res) {
		res.forEach(function (row) {
			console.log(row);
		});
	});
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