define(function (require) {
	var StackoverflowController = function ($scope, api) {
		$scope.title = 'Stackoverflow';
		$scope.items = api.query({ resource: 'items', target: 'stackoverflow' });
	};

	return StackoverflowController;
});