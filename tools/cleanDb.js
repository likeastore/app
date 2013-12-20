process.env.NODE_ENV = process.env.NODE_ENV || process.argv[2] || 'development';

var config = require('../config');
var db = require('../source/db')(config);

console.log('cleaning up likestore db...');
db.dropDatabase();
db.close(function (err) {
	if (err) {
		return console.log('clean up failed: %s', err);
	}

	return console.log('%s db is clean now!', process.env.NODE_ENV);
});
