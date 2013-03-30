var EventEmitter = require('events').EventEmitter;
var users = require('../db/users.js');

function auth(everyauth) {
	var emitter = new EventEmitter();

	everyauth.everymodule
		.findUserById( function (id, callback) {
			callback(null, {});
	});

	everyauth
		.facebook
		.appId('394024317362081')
		.appSecret('bc86f2ab9afcb1227227146e5ea9ad44')
		.findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
			console.log('everyauth: facebook-findOrCreateUser');
			emitter.emit('auth:facebook:connected', {token: accessToken});
			users.findOrCreateUser(accessToken, fbUserMetadata);
			return this.Promise().fulfill(fbUserMetadata);
		})
		.redirectPath('/');

	everyauth
		.twitter
		.consumerKey('dgwuxgGb07ymueGJF0ug')
		.consumerSecret('eusoZYiUldYqtI2SwK9MJNbiygCWOp9lQX7i5gnpWU')
		.findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
			var promise = this.Promise();
			console.log('everyauth: twitter-findOrCreateUser');
			emitter.emit('auth:twitter:connected', {token: accessToken});
			users.findOrCreateUser(twitUser, promise);
			return promise;
		})
		.redirectPath('/');

	everyauth.github
		.appId('8f4dd9c04e07d9d712e5')
		.appSecret('f2156b4c154afded59ce0272b22838ce24ca2fee')
		.findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
			var promise = this.Promise();
			console.log('everyauth: github-findOrCreateUser');
			emitter.emit('auth:github:connected', {token: accessToken});
			users.findOrCreateUser(ghUser, promise);
			return promise;
		})
		.redirectPath('/');

	return emitter;
}

module.exports = auth;