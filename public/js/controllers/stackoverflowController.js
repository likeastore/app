define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function StackoverflowController ($scope, appLoader, api) {
		appLoader.loading();

		$scope.page = 1;
		$scope.items = [];

		$scope.showMore = function () {
			appLoader.loading();
			$scope.page += 1;
			api.query({ resource: 'items', target: 'stackoverflow', page: $scope.page }, function (res) {
				$scope.items = $scope.items.concat(res);
				appLoader.ready();
			});

		};

		$scope.title = 'Stackoverflow';
		api.query({ resource: 'items', target: 'stackoverflow', page: $scope.page }, function (res) {
			$scope.items = res;
			appLoader.ready();
		});
	}

	return StackoverflowController;
});