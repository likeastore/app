var config = require('../../local_settings.js');
var cradle = require('cradle');

var connection = new cradle.Connection(
	config.couchdb.url,
	config.couchdb.port, {
		auth: {
			username: config.couchdb.admin,
			password: config.couchdb.pass
		}
});

function collection (name) {
	if (!name || typeof name !== 'string') {
		console.error('Incorrect database name');
	}

	return connection.database(name);
}

module.exports = {
	collection: collection
};