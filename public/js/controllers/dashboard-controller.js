define(function (require) {
	var DashboardController = function ($scope, api) {
		$scope.title = 'All';
		$scope.items = api.query({ resource: 'items', target: 'all' });
	};

	return DashboardController;
});