var db = require('./db.js').collection('favorites');

function save(favorites, callback) {
	favorites.forEach(function (fav, i) {
		db.view('favorites/byId', { key: fav.itemId }, function (err, docs) {
			if (err) {
				return callback(err);
			}

			if (docs.length > 0) {
				db.merge(docs[0].id, fav, function (err, doc) {
					if (err) {
						return callback(err);
					}
					console.info('updated favorite with id:' + doc.id);
				});
			} else {
				db.save(fav, function (err, doc) {
					if (err) {
						return callback(err);
					}
					console.info('saved favorite with id:' + doc.id);
				});
			}
		});
	});
	return callback(null);
}

function all(callback) {
	db.view('favorites/all', function (err, docs) {
		return callback(err, docs);
	});
}

function top(count, callback) {
	return callback(null);
}

function removeAll(callback) {
	db.view('favorites/all', function (err, docs) {
		if (docs.length > 0) {
			docs.forEach(function (fav) {
				db.remove(fav._id, fav._rev, function (err, res) {
					if (err) {
						return callback(err);
					}
					console.info('removed favorites with id:' + res.id);
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