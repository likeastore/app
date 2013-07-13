define(function (require) {
	'use strict';

	function Auth ($http, $window, $location, $cookies, $cookieStore) {
		return {
			setAuthorizationHeaders: function () {
				var params = $location.search();
				if (params.email && params.apiToken) {
					$window.location.href = $window.location.origin;
				}
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