define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function DashboardController ($scope, $filter, appLoader, api) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Inbox';
		$scope.items = api.query({ resource: 'items' }, function (res) {
			appLoader.ready();
		});

		$scope.searching = function (query) {
			$scope.search = $filter('filter')($scope.items, query);
		};
	}

	return DashboardController;
});