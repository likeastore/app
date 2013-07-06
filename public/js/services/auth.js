define(function (require) {
	'use strict';

	function Auth ($location, $window, $http, $cookies, $cookieStore) {
		return {
			getToken: function () {
				var params = $location.search();

				if (params.email && params.apiToken) {
					$http.post('/api/auth/login', params).success(function (res) {
						$cookies.token = 'Basic ' + $window.btoa(params.email + ':' + res.token);
						$window.location.href = $location.host;
					});
				}

				if (!$cookies.token) {
					this.logout();
				}

				$http.defaults.headers.common.Authorization = $cookies.token;
			},

			logout: function () {
				$cookieStore.remove('token');
				$window.location = '/api/auth/logout';
			}

		};
	}

	return Auth;
});