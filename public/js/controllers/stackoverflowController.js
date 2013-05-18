define(function (require) {
	'use strict';

	function StackoverflowController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.title = 'Stackoverflow';
		$scope.items = api.query({ resource: 'items', target: 'stackoverflow' }, function (res) {
			appLoader.ready();
		});
	}

	return StackoverflowController;
});