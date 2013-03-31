var db = require('./db.js').collection('stars');

function save(stars, callback) {
	stars.forEach(function (star, i) {
		db.view('stars/byId', { key: star.itemId }, function (err, docs) {
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
	db.view('stars/all', function (err, docs) {
		return callback(err, docs);
	});
}

function top(count, callback) {
	return callback(null);
}

function removeAll(callback) {
	db.view('stars/all', function (err, docs) {
		if (docs.length > 0) {
			docs.forEach(function (star) {
				db.remove(star._id, star._rev, function (err, res) {
					if (err) {
						return callback(err);
					}
					console.info('removed star with id:' + res.id);
				});
			});
		}
		return callback(null);
	});
}

module.exports = {
	save: save,
	all: all,
	top: top,
	removeAll: removeAll
};