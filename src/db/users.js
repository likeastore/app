var db = require('./db.js').collection('appusers');

function findOrCreateUser (user, promise) {
	db.view('users/byId', { key: user.id }, function (err, docs) {
		if (err) {
			promise.fail(err);
			console.error(err);
			return false;
		}

		if (docs.length > 0) {
			var existing = docs[0].value;
			console.info('User exists');
			promise.fulfill(existing);
		} else {
			db.save(user, function (err, doc) {
				console.info('New user created');
				promise.fulfill(doc);
			});
		}
	});
}

function getAllUsers (callback) {
	db.view('users/all', function (err, docs) {
		callback(err, docs);
	});
}

module.exports = {
	findOrCreateUser: findOrCreateUser,
	getAllUsers: getAllUsers
};