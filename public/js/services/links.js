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
			collection: function (id) {
				var base = $window.appConfig.siteUrl + '/u/' + $rootScope.user.name;
				var salt = $window.appConfig.hashids.salt;
				var hashids = new Hashids(salt);

				return base + '/' + hashids.encryptHex(id);
			}
		};
	}

	return Links;
});