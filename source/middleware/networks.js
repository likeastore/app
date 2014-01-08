var OAuth = require('oauth').OAuth;
var OAuth2 = require('oauth').OAuth2;
var config = require('../../config');
var users = require('../models/users');

function facebook() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/facebook/callback';
		var oauth = new OAuth2(config.services.facebook.appId,
							config.services.facebook.appSecret,
							'https://graph.facebook.com');

		var authorizeUrl = oauth.getAuthorizeUrl({redirect_uri: callbackUrl, scope: 'user_likes', state: req.user });
		req.authUrl = authorizeUrl;
		next();
	};

}

function facebookCallback() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/facebook/callback';
		var oauth = new OAuth2(config.services.facebook.appId,
							config.services.facebook.appSecret,
							'https://graph.facebook.com');

		var code = req.query.code;
		var user = req.query.state;

		oauth.getOAuthAccessToken(code, {grant_type: 'authorization_code', redirect_uri: callbackUrl}, gotAccessToken);

		function gotAccessToken(err, accessToken, refreshToken) {
			if (err) {
				return next({message: 'failed to get accessToken from facebook', error: err, status: 500});
			}

			req.network = {
				accessToken: accessToken,
				accessTokenSecret: null,
				refreshToken: refreshToken,
				user: user,
				service: 'facebook'
			};

			next();
		}
	};
}

function twitter() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/twitter/callback';
		var oauth = new OAuth('https://api.twitter.com/oauth/request_token',
							'https://api.twitter.com/oauth/access_token',
							config.services.twitter.consumerKey,
							config.services.twitter.consumerSecret,
							'1.0',
							callbackUrl,
							'HMAC-SHA1');

		oauth.getOAuthRequestToken(function (err, requestToken, requestTokenSecret) {
			if (err) {
				return next({message: 'failed to get request token from twitter', error: err, status: 500});
			}

			users.update(req.user, {twitterRequestToken: requestToken, twitterRequestTokenSecret: requestTokenSecret}, function (err) {
				if (err) {
					return next({message: 'failed to update user', error: err, status: 500});
				}

				req.authUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken;
				next();
			});
		});
	};
}

function twitterCallback () {
	return function (req, res, next) {
		var oauth = new OAuth('https://api.twitter.com/oauth/request_token',
							'https://api.twitter.com/oauth/access_token',
							config.services.twitter.consumerKey,
							config.services.twitter.consumerSecret,
							'1.0',
							null,
							'HMAC-SHA1');

		var requestToken = req.query.oauth_token;
		var verifier = req.query.oauth_verifier;

		users.findByRequestToken('twitterRequestToken', requestToken, userFound);

		function userFound (err, user) {
			if (err) {
				return next(err);
			}

			oauth.getOAuthAccessToken(requestToken, user.twitterRequestTokenSecret, verifier, gotAccessToken);

			function gotAccessToken (err, accessToken, accessTokenSecret, params) {
				if (err) {
					return next({message: 'failed to get accessToken from twitter', error: err, status: 500});
				}

				req.network = {
					accessToken: accessToken,
					accessTokenSecret: accessTokenSecret,
					user: user.email,
					service: 'twitter'
				};

				next();
			}
		}
	};
}

function github(type) {
	type = type || 'github';
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/' + type + '/callback';
		var oauth = new OAuth2(config.services.github.appId,
							config.services.github.appSecret,
							'https://github.com/login');

		var authorizeUrl = oauth.getAuthorizeUrl({redirect_uri: callbackUrl, state: req.user });
		req.authUrl = authorizeUrl;
		next();
	};
}

function githubCallback(type) {
	return function (req, res, next) {
		type = type || 'github';
		var oauth = new OAuth2(config.services.github.appId,
							config.services.github.appSecret,
							'https://github.com/login');

		var code = req.query.code;
		var user = req.query.state;

		oauth.getOAuthAccessToken(code, {grant_type: 'authorization_code'}, gotAccessToken);

		function gotAccessToken(err, accessToken, refreshToken) {
			if (err) {
				return next({message: 'failed to get accessToken from github', error: err, status: 500});
			}

			req.network = {
				accessToken: accessToken,
				accessTokenSecret: null,
				refreshToken: refreshToken,
				user: user,
				service: type
			};

			next();
		}
	};
}

function stackoverflow() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/stackoverflow/callback';
		var oauth = new OAuth2(config.services.stackoverflow.clientId,
							config.services.stackoverflow.clientSecret,
							'https://stackexchange.com',
							'/oauth');

		var authorizeUrl = oauth.getAuthorizeUrl({redirect_uri: callbackUrl, state: req.user, scope: 'no_expiry' });
		req.authUrl = authorizeUrl;
		next();
	};
}

function stackoverflowCallback() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/stackoverflow/callback';
		var oauth = new OAuth2(config.services.stackoverflow.clientId,
							config.services.stackoverflow.clientSecret,
							'https://stackexchange.com',
							'/oauth');

		var code = req.query.code;
		var user = req.query.state;

		oauth.getOAuthAccessToken(code, {grant_type: 'authorization_code', redirect_uri: callbackUrl}, gotAccessToken);

		function gotAccessToken(err, accessToken, refreshToken) {
			if (err) {
				return next({message: 'failed to get accessToken from stackoverflow', error: err, status: 500});
			}

			req.network = {
				accessToken: accessToken,
				accessTokenSecret: null,
				refreshToken: refreshToken,
				user: user,
				service: 'stackoverflow'
			};

			next();
		}
	};
}

function vimeo() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/vimeo/callback';
		var oauth = new OAuth('https://vimeo.com/oauth/request_token',
							'https://vimeo.com/oauth/access_token',
							config.services.vimeo.clientId,
							config.services.vimeo.clientSecret,
							'1.0',
							callbackUrl,
							'HMAC-SHA1');

		oauth.getOAuthRequestToken(function (err, requestToken, requestTokenSecret) {
			if (err) {
				return next({message: 'failed to get request token from vimeo', error: err, status: 500});
			}

			users.update(req.user, {vimeoRequestToken: requestToken, vimeoRequestTokenSecret: requestTokenSecret}, function (err) {
				if (err) {
					return next({message: 'failed to update user', error: err, status: 500});
				}

				req.authUrl = 'https://vimeo.com/oauth/authorize?oauth_token=' + requestToken;
				next();
			});
		});
	};
}

function vimeoCallback() {
	return function (req, res, next) {
		var oauth = new OAuth('https://vimeo.com/oauth/request_token',
							'https://vimeo.com/oauth/access_token',
							config.services.vimeo.clientId,
							config.services.vimeo.clientSecret,
							'1.0',
							null,
							'HMAC-SHA1');

		var requestToken = req.query.oauth_token;
		var verifier = req.query.oauth_verifier;

		users.findByRequestToken('vimeoRequestToken', requestToken, userFound);

		function userFound (err, user) {
			if (err) {
				return next(err);
			}

			oauth.getOAuthAccessToken(requestToken, user.vimeoRequestTokenSecret, verifier, gotAccessToken);

			function gotAccessToken (err, accessToken, accessTokenSecret, params) {
				if (err) {
					return next({message: 'failed to get accessToken from vimeo', error: err, status: 500});
				}

				req.network = {
					accessToken: accessToken,
					accessTokenSecret: accessTokenSecret,
					user: user.email,
					service: 'vimeo'
				};

				next();
			}
		}
	};
}

function youtube() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/youtube/callback';
		var oauth = new OAuth2(config.services.youtube.clientId,
							config.services.facebook.clientSecret,
							'https://accounts.google.com/o',
							'/oauth2/auth',
							'/oauth2/token');

		var authorizeUrl = oauth.getAuthorizeUrl({redirect_uri: callbackUrl, scope: 'https://www.googleapis.com/auth/youtube.readonly', access_type: 'offline', state: req.user,  response_type: 'code' });
		req.authUrl = authorizeUrl;
		next();
	};

}

function youtubeCallback() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/youtube/callback';
		var oauth = new OAuth2(config.services.youtube.clientId,
							config.services.youtube.clientSecret,
							'https://accounts.google.com/o',
							'/oauth2/auth',
							'/oauth2/token');

		var code = req.query.code;
		var user = req.query.state;

		oauth.getOAuthAccessToken(code, {grant_type: 'authorization_code', redirect_uri: callbackUrl}, gotAccessToken);

		function gotAccessToken(err, accessToken, refreshToken, results) {
			if (err) {
				return next({message: 'failed to get accessToken from youtube', error: err, status: 500});
			}

			req.network = {
				accessToken: accessToken,
				accessTokenSecret: null,
				refreshToken: refreshToken,
				user: user,
				service: 'youtube'
			};

			next();
		}
	};
}

function dribbble() {
	return function (req, res, next) {
		var user = req.user;
		var username = req.body.username;

		if (!username) {
			return next({message: 'missing dribbble username', status: 412});
		}

		req.network = {
			username: username,
			user: user,
			service: 'dribbble'
		};

		next();
	};
}

function behance() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/behance/callback';
		var oauth = new OAuth2(config.services.behance.clientId,
							config.services.behance.clientSecret,
							'https://www.behance.net/v2',
							'/oauth/authenticate',
							'/oauth/token');

		var authorizeUrl = oauth.getAuthorizeUrl({redirect_uri: callbackUrl, scope: 'activity_read', state: req.user, response_type: 'code' });
		req.authUrl = authorizeUrl;
		next();
	};
}

function behanceCallback() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/behance/callback';
		var oauth = new OAuth2(config.services.behance.clientId,
							config.services.behance.clientSecret,
							'https://www.behance.net/v2',
							'/oauth/authenticate',
							'/oauth/token');

		var code = req.query.code;
		var user = req.query.state;

		oauth.getOAuthAccessToken(code, {redirect_uri: callbackUrl}, gotAccessToken);

		function gotAccessToken(err, accessToken, refreshToken, results) {
			if (err) {
				return next({message: 'failed to get accessToken from behance', error: err, status: 500});
			}

			req.network = {
				accessToken: accessToken,
				accessTokenSecret: null,
				refreshToken: null,
				username: results.user.username,
				user: user,
				service: 'behance'
			};

			next();
		}
	};
}


module.exports = {
	facebook: facebook,
	facebookCallback: facebookCallback,

	twitter: twitter,
	twitterCallback: twitterCallback,

	github: github,
	githubCallback: githubCallback,

	stackoverflow: stackoverflow,
	stackoverflowCallback: stackoverflowCallback,

	vimeo: vimeo,
	vimeoCallback: vimeoCallback,

	youtube: youtube,
	youtubeCallback: youtubeCallback,

	dribbble: dribbble,

	behance: behance,
	behanceCallback: behanceCallback
};