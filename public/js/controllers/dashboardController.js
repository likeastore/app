define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function DashboardController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Inbox';
		$scope.items = api.query({ resource: 'items', target: 'all' }, function (res) {
			appLoader.ready();
		});
	}

	return DashboardController;
});