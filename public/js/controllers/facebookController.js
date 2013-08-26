define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function FacebookController ($scope, appLoader, api) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Facebook';
		$scope.items = api.query({ resource: 'items', target: 'facebook' }, function (res) {
			appLoader.ready();
		});
	}

	return FacebookController;
});