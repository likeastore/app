define(function (require) {
	'use strict';

	function Auth ($http, $location, $window, $cookies, $cookieStore) {
		return {
			checkAccessToken: function (callback) {
				var params = $location.search();

				if (params.email && params.apiToken) {
					$http.post('/api/auth/login', params).success(function (res) {
						$cookies.token = 'Basic ' + $window.btoa(params.email + ':' + res.token);
						$window.location = $window.location.origin;
					});
				} else if (!$cookies.token) {
					this.logout();
				} else {
					callback();
				}
			},

			setAuthorizationHeaders: function () {
				$http.defaults.headers.common.Authorization = $cookies.token;
			},

			isLoggedIn: function () {
				return $http.defaults.headers.common.Authorization === $cookies.token;
			},

			logout: function () {
				$cookieStore.remove('token');
				$window.location = '/logout';
			}

		};
	}

	return Auth;
});