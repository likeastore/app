define(function () {
	'use strict';

	function SettingsController ($rootScope, $analytics) {
		$analytics.eventTrack('settings opened');
		$rootScope.title = 'Account settings';
	}

	return SettingsController;
});