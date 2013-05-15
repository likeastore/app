define(function (require) {

	var TwitterController = function  ($scope, api) {
		$scope.title = 'Twitter';
		$scope.items = api.query({ resource: 'items', target: 'twitter' });
	};

	return TwitterController;
});