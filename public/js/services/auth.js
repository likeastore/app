define(function (require) {
	'use strict';

	function Auth ($http, $location, $window, $cookies, $cookieStore) {
		return {
			setAuthorizationHeaders: function () {
				var params = $location.search();

				if (params.email && params.apiToken) {
					$http.post('/api/auth/login', params).success(function (res) {
						$cookies.token = 'Basic ' + $window.btoa(params.email + ':' + res.token);
						$window.location = $window.location.origin;
					});
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