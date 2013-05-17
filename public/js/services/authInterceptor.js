define(function (require) {
	return function ($q, $window) {
		return function (promise) {
			var success = function (response) {
				return response;
			};

			var error = function (response) {
				if (response.status === 401) {
					$window.location = '/logout';
				}
				return $q.reject(response);
			};

			return promise.then(success, error);
		};
	};
});