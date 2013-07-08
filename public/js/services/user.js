define(function (require) {
	'use strict';

	function User ($rootScope, $cookies, auth, api) {
		return {
			initialize: function () {
				auth.checkAccessToken(function () {
					api.get({ resource: 'users', target: 'me' }, function (res) {
						$rootScope.user = res;
					});
				});
			}
		};
	}

	return User;
});