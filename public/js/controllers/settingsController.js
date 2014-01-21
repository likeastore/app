define(function () {
	'use strict';

	function SettingsController ($scope, $rootScope, appLoader, api, $analytics) {
		appLoader.loading();

		$analytics.eventTrack('settings opened');

		$rootScope.title = 'Account settings';
		$scope.networks = api.query({ resource: 'networks' }, function (res) {
			appLoader.ready();
		});
	}

	return SettingsController;
});