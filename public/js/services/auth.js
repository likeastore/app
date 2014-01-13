define(function (require) {
	'use strict';

	function Auth ($http, $window, $cookies, $cookieStore, storage, api) {
		return {
			setAuthorizationHeaders: function () {
				$http.defaults.headers.common['X-Access-Token'] = $cookies.token || storage.get('token');
			},

			logout: function () {
				api.save({resource: 'auth', target: 'logout'}, {}, function () {
					// keep it for safety for early users
					if ($cookies.token) {
						var domain = $window.appConfig.env === 'development' ? '' : '.likeastore.com';
						document.cookie = 'token=;domain=' + domain + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
					} else {
						storage.remove('token');
					}
					$http.defaults.headers.common['X-Access-Token'] = null;

					$window.location = '/logout';
				});
			}

		};
	}

	return Auth;
});