define(function (require) {

	var DashboardController = function  ($scope, api) {
		$scope.title = 'All';
		$scope.items = api.query({ target: 'all' });
	};

	return DashboardController;
});