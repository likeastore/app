define(function () {
	'use strict';

	function HttpInterceptor ($q, $window, $location) {
		return {
			'response': function (response) {
				if ($location.hash() === '_=_') {
					$location.hash('');
				}

				return response;
			},

			'responseError': function (response) {
				if (response.status === 401) {
					$window.location = '/logout';
				}
				if (response.status === 500) {
					$location.url('/ooops');
				}

				return $q.reject(response);
			}
		};
	}

	return HttpInterceptor;
});