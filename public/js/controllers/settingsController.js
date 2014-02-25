define(function () {
	'use strict';

	function SettingsController ($scope, $rootScope, $analytics) {
		$analytics.eventTrack('settings opened');
		$rootScope.title = 'Account settings';
		$rootScope.ctaButtonType = 'logout';
		$scope.showConfigTab = true;
	}

	return SettingsController;
});