var db = require('./db.js').getDb('likeastore');

function findOrCreateUser (user, promise) {
	db.view('users/appUsers', { key: user.id }, function (err, docs) {
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

function getAllUsers () {

}

module.exports = {
	findOrCreateUser: findOrCreateUser,
	getAllUsers: getAllUsers
};