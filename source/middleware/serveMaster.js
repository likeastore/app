var _ = require('underscore');

function skipMaster (req) {
	var bypass = ['/api', '/components', '/css', '/js', '/build', '/auth', '/connect', '/utils'];
	return _.any(bypass, function (url) {
		return req.url.substr(0, url.length) === url;
	});
}

function hander(title, mainJs, mainCss) {
	return function (req, res, next) {
		if (skipMaster(req)) {
			return next();
		}

		res.render('master', { title: title, mainJs: mainJs, mainCss: mainCss});
	};
}

module.exports = {
	development: function () {
		return hander('likeastore.', '/js/main.js', '/css/main.css');
	},

	production: function () {
		var client = require('./../../public/build');
		return hander('likeastore.', client.js, client.css);
	}
};