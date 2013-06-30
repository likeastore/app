var OAuth= require('oauth').OAuth;
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
		res.clearCookie('oauth_' + requestToken);

		oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, function (err, accessToken, accessTokenSecret) {
			if (err) {
				return next({message: 'failed to get accessToken from twitter', error: err, status: 500});
			}

			req.network = {accessToken: accessToken, accessTokenSecret: accessTokenSecret, user: user};

			next();
		});
	};
}

module.exports = {
	twitter: twitter,
	twitterCallback: twitterCallback
};