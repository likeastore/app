define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function SearchController ($scope, $routeParams, appLoader, api) {
		appLoader.loading();

		$scope.search = true;
		$scope.title = 'Search';
		$scope.query = $routeParams.text;
		$scope.items = [];

		api.get({ resource: 'search', text: $routeParams.text }, function (res) {
			$scope.items = $scope.items.concat(res.data);
			$scope.nextPage = res.nextPage;
			appLoader.ready();
		});
	}

	return SearchController;
});
