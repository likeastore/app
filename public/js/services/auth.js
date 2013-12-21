define(function (require) {
	'use strict';

	function Auth ($http, $window, $cookies, $cookieStore, api) {
		return {
			setAuthorizationHeaders: function () {
				$http.defaults.headers.common['X-Access-Token'] = $cookies.token;
			},

			logout: function () {
				api.save({resource: 'auth', target: 'logout'}, {}, function () {
					$cookieStore.remove('token');
					$http.defaults.headers.common['X-Access-Token'] = null;

					$window.location = '/logout';
				});
			}

		};
	}

	return Auth;
});