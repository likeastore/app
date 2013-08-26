define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function GithubController ($scope, appLoader, api) {
		appLoader.loading();

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Github';
		$scope.items = api.query({ resource: 'items', target: 'github' }, function (res) {
			appLoader.ready();
		});
	}

	return GithubController;
});