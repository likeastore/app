define(function (require) {
	'use strict';

	function SettingsController ($scope, networks) {
		$scope.title = 'Account settings';
		$scope.networks = networks;
	}

	SettingsController.resolve = {
		networks: function ($q, appLoader, api, auth) {
			var deferred = $q.defer();

			appLoader.loading();
			auth.checkAccessToken(function () {
				api.query({ resource: 'networks' }, function (res) {
					appLoader.ready();
					deferred.resolve(res);
				});
			});

			return deferred.promise;
		}
	};

	return SettingsController;
});