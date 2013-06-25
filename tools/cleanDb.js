var db = require('./../source/db/dbConnector').db;

console.log('cleaning up likestore db...');

db.dropDatabase();
db.close(function (err) {
	if (err) {
		return console.log('clean up failed: ' + err);
	}

	console.log('likestore db is clean now.');
});