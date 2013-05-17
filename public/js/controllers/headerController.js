define(function (require) {
	var HeaderController = function ($scope, api) {
		$scope.user = api.get({ resource: 'user' });
	};

	return HeaderController;
});