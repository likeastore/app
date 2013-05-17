define(function (require) {
	var DashboardController = function ($scope, api) {
		$scope.title = 'Inbox';
		$scope.items = api.query({ resource: 'items', target: 'all' });
	};

	return DashboardController;
});