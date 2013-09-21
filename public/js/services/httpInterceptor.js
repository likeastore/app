define(function (require) {
	'use strict';

	function HttpInterceptor ($q, $window, $location) {
		return function (promise) {
			var success = function (response) {
				if ($location.hash() === '_=_') {
					$location.hash('');
				}
				return response;
			};

			var error = function (response) {
				if (response.status === 401) {
					$window.location = '/logout';
				}
				if (response.status === 500) {
					$location.url('/ooops');
				}
				return $q.reject(response);
			};

			return promise.then(success, error);
		};
	}

	return HttpInterceptor;
});