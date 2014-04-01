var _ = require('underscore');
var config = require('../../config');
var build = require('./../../public/build');

function skipMaster (req) {
	var bypass = ['/api', '/components', '/css', '/js', '/build', '/auth', '/connect', '/utils'];
	return _.any(bypass, function (url) {
		return req.url.substr(0, url.length) === url;
	});
}

function handler (title, mainJs, mainCss) {
	return function (req, res, next) {
		if (skipMaster(req)) {
			return next();
		}

		var appConfig = {
			env: process.env.NODE_ENV || 'development',
			siteUrl: config.siteUrl,
			applicationUrl: config.applicationUrl,
			hashids: config.hashids,
			analytics: config.analytics,
			tracking: config.tracking.enabled,
			appId: config.services.facebook.appId
		};

		res.render('master', { title: title, mainJs: mainJs, mainCss: mainCss, appConfig: appConfig });
	};
}

module.exports = {
	development: function () {
		return handler('Likeastore', '/js/main.js', '/css/main.css');
	},

	production: function () {
		return handler('Likeastore', build.js, build.css);
	}
};