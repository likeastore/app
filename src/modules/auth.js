var EventEmitter = require('events').EventEmitter;
var users = [];

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
			return this.Promise().fulfill(fbUserMetadata);
		})
		.redirectPath('/');

	everyauth
		.twitter
		.consumerKey('dgwuxgGb07ymueGJF0ug')
		.consumerSecret('eusoZYiUldYqtI2SwK9MJNbiygCWOp9lQX7i5gnpWU')
		.findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
			console.log('everyauth: twitter-findOrCreateUser');
			emitter.emit('auth:twitter:connected', {token: accessToken});
			return this.Promise().fulfill(twitUser);
		})
		.redirectPath('/');

	everyauth.github
		.appId('8f4dd9c04e07d9d712e5')
		.appSecret('f2156b4c154afded59ce0272b22838ce24ca2fee')
		.findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
			console.log('everyauth: github-findOrCreateUser');
			emitter.emit('auth:github:connected', {token: accessToken});
			return this.Promise().fulfill(ghUser);
		})
		.redirectPath('/');

	return emitter;
}

module.exports = auth;