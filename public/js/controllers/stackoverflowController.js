define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function StackoverflowController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Stackoverflow';
		$scope.items = api.query({ resource: 'items', target: 'stackoverflow' }, function (res) {
			appLoader.ready();
		});
	}

	return StackoverflowController;
});