define(function () {
	'use strict';

	// list of uri with special handling
	var whiteListUrls = [
		'/api/emails/share',
		'/api/networks/dribbble'
	];

	function checkResponseUrl(responseUrl) {
		return function (url) {
			return responseUrl.substr(0, url.length) === url;
		};
	}

	function HttpInterceptor ($q, $window, $location) {
		return {
			'response': function (response) {
				if ($location.hash() === '_=_') {
					$location.hash('');
				}

				return response;
			},

			'responseError': function (response) {
				if (whiteListUrls.some(checkResponseUrl(response.config.url))) {
					return $q.reject(response);
				}

				if (response.status === 401) {
					$window.location = '/logout';
				}

				if (response.status === 404) {
					$location.url('/');
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