var EventEmitter = require('events').EventEmitter;
var users = [];

function auth(everyauth) {
	var emitter = new EventEmitter();

	everyauth.debug = true;
	everyauth.everymodule
		.findUserById( function (id, callback) {
			callback(null, {});
	});

	everyauth.github
		.appId('8f4dd9c04e07d9d712e5')
		.appSecret('f2156b4c154afded59ce0272b22838ce24ca2fee')
		.findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
			emitter.emit('auth:connected', {token: accessToken});
			return this.Promise().fulfill(ghUser);
		})
		.redirectPath('/');

	return emitter;
}

module.exports = auth;
