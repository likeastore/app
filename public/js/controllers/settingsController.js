define(function (require) {
	'use strict';

	function settingsController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.title = 'Account settings';
		$scope.networks = api.query({ resource: 'networks', target: 'all' }, function (res) {
			appLoader.ready();
		});
	}

	return settingsController;
});