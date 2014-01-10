define(function (require) {
	'use strict';

	function User ($rootScope, $templateCache, api) {
		return {
			initialize: function () {
				api.get({ resource: 'users', target: 'me' }, function (user) {
					$rootScope.user = user;
				});
			}
		};
	}

	return User;
});