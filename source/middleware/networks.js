var OAuth = require('oauth').OAuth;
var OAuth2 = require('oauth').OAuth2;
var config = require('../../config');

function twitter() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/twitter/callback';
		var oauth = new OAuth("https://api.twitter.com/oauth/request_token",
							"https://api.twitter.com/oauth/access_token",
							config.services.twitter.consumerKey,
							config.services.twitter.consumerSecret,
							"1.0",
							callbackUrl,
							"HMAC-SHA1");

		oauth.getOAuthRequestToken(function (err, requestToken, requestTokenSecret) {
			if (err) {
				return next({message: 'failed to get request token from twitter', error: err, status: 500});
			}

			res.cookie('oauth_' + requestToken, {secret: requestTokenSecret, user: req.user });
			res.redirect('https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken);
		});
	};
}

function twitterCallback () {
	return function (req, res, next) {
		var oauth = new OAuth("https://api.twitter.com/oauth/request_token",
							"https://api.twitter.com/oauth/access_token",
							config.services.twitter.consumerKey,
							config.services.twitter.consumerSecret,
							"1.0",
							null,
							"HMAC-SHA1");

		var requestToken = req.query.oauth_token;
		var verifier = req.query.oauth_verifier;
		var requestTokenSecret = req.cookies['oauth_' + requestToken].secret;
		var user = req.cookies['oauth_' + requestToken].user;
		res.clearCookie('oauth_' + requestToken, {path: '/'});

		oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, function (err, accessToken, accessTokenSecret) {
			if (err) {
				return next({message: 'failed to get accessToken from twitter', error: err, status: 500});
			}

			req.network = {accessToken: accessToken, accessTokenSecret: accessTokenSecret, user: user, service: 'twitter'};

			next();
		});
	};
}

function github() {
	return function (req, res, next) {
		var callbackUrl = config.applicationUrl + '/api/networks/github/callback';
		var oauth = new OAuth2(config.services.github.appId,
							config.services.github.appSecret,
							"https://github.com/login");

		var authorizeUrl = oauth.getAuthorizeUrl({redirect_uri: callbackUrl, state: req.user });
		res.redirect(authorizeUrl);
	};
}

function githubCallback() {
	return function (req, res, next) {
		var oauth = new OAuth2(config.services.github.appId,
							config.services.github.appSecret,
							"https://github.com/login");

		var code = req.query.code;
		var user = req.query.state;

		oauth.getOAuthAccessToken(code, {grant_type: 'authorization_code'}, function (err, accessToken) {
			if (err) {
				return next({message: 'failed to get accessToken from twitter', error: err, status: 500});
			}

			req.network = {accessToken: accessToken, accessTokenSecret: null, user: user, service: 'github'};

			next();
		});
	};
}

module.exports = {
	twitter: twitter,
	twitterCallback: twitterCallback,
	github: github,
	githubCallback: githubCallback
};