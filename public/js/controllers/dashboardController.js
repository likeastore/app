define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function DashboardController ($scope, appLoader, api) {
		appLoader.loading();

		$scope.page = 1;
		$scope.haveMore = true;
		$scope.items = [];

		$scope.showMore = function () {
			appLoader.loading();
			$scope.page += 1;
			api.query({ resource: 'items', page: $scope.page }, function (res) {
				$scope.items = $scope.items.concat(res);
				$scope.haveMore = res.length === config.limit;
				appLoader.ready();
			});

		};

		$scope.title = 'Inbox';
		api.query({ resource: 'items', page: $scope.page }, function (res) {
			$scope.items = res;
			appLoader.ready();
		});
	}

	return DashboardController;
});