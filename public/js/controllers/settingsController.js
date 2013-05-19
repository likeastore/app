define(function (require) {
	'use strict';

	function settingsController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.title = 'Account settings';
		$scope.networks = api.query({ resource: 'user', target: 'networks' }, function (res) {
			appLoader.ready();
		});
	}

	return settingsController;
});