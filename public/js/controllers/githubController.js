define(function (require) {
	'use strict';

	function GithubController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.limit = 30;
		$scope.increaseLimit = function () {
			$scope.limit += 30;
		};

		$scope.title = 'Github';
		$scope.items = api.query({ resource: 'items', target: 'github' }, function (res) {
			appLoader.ready();
		});
	}

	return GithubController;
});