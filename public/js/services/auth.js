define(function (require) {
	'use strict';

	function Auth ($http, $window, $cookies, $cookieStore, api, Intercom) {
		return {
			logout: function () {
				api.save({ resource: 'auth', target: 'logout' }, {}, function () {
					Intercom.shutdown();
					$window.location = '/logout';
				});
			}

		};
	}

	return Auth;
});