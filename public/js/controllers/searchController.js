define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function SearchController ($scope, $routeParams, appLoader, api) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.search = true;
		$scope.title = 'Search';

		$scope.items = api.query({ resource: 'search', text: $routeParams.text }, function (res) {
			appLoader.ready();
		});
	}

	return SearchController;
});
