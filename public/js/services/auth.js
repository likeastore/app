define(function (require) {
	'use strict';

	function Auth ($http, $window, $cookies, $cookieStore, api, Intercom) {
		return {
			setAuthorizationHeaders: function () {
				$http.defaults.headers.common['X-Access-Token'] = $cookies.token;
			},

			logout: function () {
				api.save({ resource: 'auth', target: 'logout' }, {}, function () {
					$http.defaults.headers.common['X-Access-Token'] = null;
					Intercom.shutdown();
					$window.location = '/logout';
				});
			}

		};
	}

	return Auth;
});