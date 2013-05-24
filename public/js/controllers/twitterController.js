define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function TwitterController ($scope, api, appLoader, $filter) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Twitter';
		$scope.items = api.query({ resource: 'items', target: 'twitter' }, function (res) {
			appLoader.ready();
		});

		$scope.searching = function (query) {
			$scope.search = $filter('filter')($scope.items, query);
		};
	}

	return TwitterController;
});