define(function (require) {
	'use strict';

	function GithubController ($scope, api) {
		$scope.title = 'Github';
		$scope.items = api.query({ resource: 'items', target: 'github' });
	}

	return GithubController;
});