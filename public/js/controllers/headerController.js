define(function (require) {
	'use strict';

	function HeaderController ($scope, api) {
		$scope.user = api.get({ resource: 'user' });
	}

	return HeaderController;
});