define(function (require) {
	'use strict';

	function DashboardController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.limit = 30;
		$scope.increaseLimit = function () {
			$scope.limit += 30;
		};

		$scope.title = 'Inbox';
		$scope.items = api.query({ resource: 'items', target: 'all' }, function (res) {
			appLoader.ready();
		});
	}

	return DashboardController;
});