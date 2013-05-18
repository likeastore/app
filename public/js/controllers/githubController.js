define(function (require) {
	'use strict';

	function GithubController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.title = 'Github';
		$scope.items = api.query({ resource: 'items', target: 'github' }, function (res) {
			appLoader.ready();
		});
	}

	return GithubController;
});