define(function (require) {
	'use strict';

	function DashboardController ($scope, api) {
		$scope.title = 'Inbox';
		$scope.items = api.query({ resource: 'items', target: 'all' });
	}

	return DashboardController;
});