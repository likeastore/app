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

function getDb (dbname) {
	if (!dbname || typeof dbname !== 'string') {
		console.error('Incorrect database name');
	}
	
	return connection.database(dbname);
}

module.exports = {
	getDb: getDb
};