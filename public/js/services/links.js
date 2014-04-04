define(function (require) {
	'use strict';

	var Hashids = require('hashids');

	function Links($window, $rootScope) {
		return {
			share: function (id) {
				var base = $window.appConfig.siteUrl + '/s';
				var salt = $window.appConfig.hashids.salt;
				var hashids = new Hashids(salt);

				return base + '/' + hashids.encryptHex(id);
			},
			collection: function (id, name) {
				name = name || $rootScope.user.name;

				var base = $window.appConfig.siteUrl + '/u/' + name;
				var salt = $window.appConfig.hashids.salt;
				var hashids = new Hashids(salt);

				return base + '/' + hashids.encryptHex(id);
			}
		};
	}

	return Links;
});