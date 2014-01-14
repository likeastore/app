define(function () {
	'use strict';

	function HistoryController($scope, $rootScope, $window, appLoader, api) {
		$scope.items = api.get({resource: 'history'});
	}

	return HistoryController;
});