define(function (require) {
	'use strict';

	function StackoverflowController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.limit = 30;
		$scope.increaseLimit = function () {
			$scope.limit += 30;
		};

		$scope.title = 'Stackoverflow';
		$scope.items = api.query({ resource: 'items', target: 'stackoverflow' }, function (res) {
			appLoader.ready();
		});
	}

	return StackoverflowController;
});