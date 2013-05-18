define(function (require) {
	'use strict';

	function TwitterController ($scope, api) {
		$scope.title = 'Twitter';
		$scope.items = api.query({ resource: 'items', target: 'twitter' });
	}

	return TwitterController;
});