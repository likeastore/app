define(function (require) {
	'use strict';

	function StackoverflowController ($scope, api) {
		$scope.title = 'Stackoverflow';
		$scope.items = api.query({ resource: 'items', target: 'stackoverflow' });
	}

	return StackoverflowController;
});