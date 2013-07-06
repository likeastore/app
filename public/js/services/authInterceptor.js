define(function (require) {
	'use strict';

	function AuthInterceptor ($q, $window) {
		return function (promise) {
			var success = function (response) {
				return response;
			};

			var error = function (response) {
				if (response.status === (400 || 401 || 412 || 418)) {
					$window.location = '/api/auth/logout';
				}
				return $q.reject(response);
			};

			return promise.then(success, error);
		};
	}

	return AuthInterceptor;
});