define(function (require) {
	'use strict';

	var Hashids = require('hashids');

	function Links($window) {
		return {
			share: function (id) {
				var base = $window.appConfig.siteUrl + '/s';
				var salt = $window.appConfig.hashids.salt;
				var hashids = new Hashids(salt);

				return base + '/' + hashids.encryptHex(id);
			}
		};
	}

	return Links;
});