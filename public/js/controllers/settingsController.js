define(function () {
	'use strict';

	function SettingsController ($scope, $rootScope, appLoader, api) {
		appLoader.loading();

		$rootScope.title = 'Account settings';
		$scope.networks = api.query({ resource: 'networks' }, function (res) {
			appLoader.ready();
		});
	}

	return SettingsController;
});