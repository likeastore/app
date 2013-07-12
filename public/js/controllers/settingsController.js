define(function (require) {
	'use strict';

	function SettingsController ($scope, appLoader, api) {
		appLoader.loading();

		$scope.title = 'Account settings';
		$scope.networks = api.query({ resource: 'networks' }, function (res) {
			appLoader.ready();
		});
	}

	return SettingsController;
});