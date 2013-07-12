define(function (require) {
	'use strict';

	function User ($rootScope, api) {
		return {
			initialize: function () {
				api.get({ resource: 'users', target: 'me' }, function (res) {
					$rootScope.user = res;
				});
			}
		};
	}

	return User;
});