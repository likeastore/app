define(function (require) {
	'use strict';

	function HeaderController ($scope, api) {
		$scope.user = api.get({ resource: 'users', target: 'me' });
	}

	return HeaderController;
});