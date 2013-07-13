define(function (require) {
	'use strict';

	function Auth ($http, $window, $cookies, $cookieStore) {
		return {
			setAuthorizationHeaders: function () {
				$http.defaults.headers.common['X-Access-Token'] = $cookies.token;
			},

			logout: function () {
				$cookieStore.remove('token');
				$window.location = '/logout';
			}

		};
	}

	return Auth;
});