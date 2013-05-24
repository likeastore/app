define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function StackoverflowController ($scope, api, appLoader, $filter) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Stackoverflow';
		$scope.items = api.query({ resource: 'items', target: 'stackoverflow' }, function (res) {
			appLoader.ready();
		});

		$scope.searching = function (query) {
			$scope.search = $filter('filter')($scope.items, query);
		};
	}

	return StackoverflowController;
});