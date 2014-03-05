define(function () {
	'use strict';

	function SettingsController ($scope, $rootScope, $window, $analytics) {
		$window.scrollTo(0,0);

		$analytics.eventTrack('settings opened');

		$rootScope.title = 'Account settings';
		$scope.showConfigTab = true;
	}

	return SettingsController;
});