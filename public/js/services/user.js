define(function (require) {
	'use strict';

	function User ($rootScope, $timeout, api) {
		return {
			initialize: function () {
				api.get({ resource: 'users', target: 'me' }, function (user) {
					$rootScope.user = user;
				});

				return this;
			},

			getActiveNetworks: function () {
				api.query({ resource: 'networks' }, function (networks) {
					$rootScope.networks = networks;
					$timeout(function () {
						$rootScope.networksLoaded = true;
					}, 1000);
				});

				return this;
			}
		};
	}

	return User;
});