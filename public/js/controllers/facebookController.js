define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function FacebookController ($scope, appLoader, api) {
		appLoader.loading();

		$scope.page = 1;
		$scope.items = [];

		$scope.showMore = function () {
			appLoader.loading();
			$scope.page += 1;
			api.query({ resource: 'items', target: 'facebook', page: $scope.page }, function (res) {
				$scope.items = $scope.items.concat(res);
				appLoader.ready();
			});

		};

		$scope.title = 'Facebook';
		api.query({ resource: 'items', target: 'facebook', page: $scope.page }, function (res) {
			$scope.items = res;
			appLoader.ready();
		});
	}

	return FacebookController;
});