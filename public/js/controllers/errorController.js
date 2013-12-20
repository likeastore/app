define(function () {
	'use strict';

	function ErrorController ($scope, $rootScope) {
		$rootScope.title = 'Uh huh oh!';
		$scope.error = true;
	}

	return ErrorController;
});