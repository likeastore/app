define(function (require) {
	'use strict';

	function Auth ($http, $window, $cookies, $cookieStore, storage, api) {
		return {
			setAuthorizationHeaders: function () {
				$http.defaults.headers.common['X-Access-Token'] = $cookies.token || storage.get('token');
			},

			logout: function () {
				api.save({ resource: 'auth', target: 'logout' }, {}, function () {
					storage.remove('token'); // keep it for safety
					$http.defaults.headers.common['X-Access-Token'] = null;
					$window.location = '/logout';
				});
			}

		};
	}

	return Auth;
});