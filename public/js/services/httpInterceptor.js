define(function () {
	'use strict';

	// list of uri with special handling
	var whiteListUrls = [
		'/api/emails/share'
	];

	function HttpInterceptor ($q, $window, $location) {
		return {
			'response': function (response) {
				if ($location.hash() === '_=_') {
					$location.hash('');
				}

				return response;
			},

			'responseError': function (response) {
				if (whiteListUrls.indexOf(response.config.url) !== -1) {
					return $q.reject(response);
				}

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