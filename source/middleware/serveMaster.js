var _ = require('underscore');

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

		res.render('master', { title: title, mainJs: mainJs, mainCss: mainCss });
	};
}

module.exports = {
	development: function () {
		return handler('Likeastore', '/js/main.js', '/css/main.css');
	},

	production: function () {
		var build = require('./../../public/build');
		return handler('Likeastore', build.js, build.css);
	}
};