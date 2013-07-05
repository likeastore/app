define(function (require) {
	'use strict';

	function Auth ($location, $window, $http, $cookies) {
		return {
			getToken: function () {
				var params = $location.search();

				if (params.email && params.apiToken) {
					$http.post('/api/auth/login', params).success(function (res) {
						$cookies.token = 'Basic ' + $window.btoa(params.email + ':' + res.token);
						$window.location = $location.host;
					});
				}

				if (!$cookies.token) {
					$window.location = '/api/auth/logout';
					return false;
				}

				$http.defaults.headers.common['Authorization'] = $cookies.token;
			}
		};
	}

	return Auth;
});