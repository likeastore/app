define(function () {
	'use strict';

	function FeedController($scope, $rootScope, $window, appLoader, api) {
		$scope.items = api.get({resource: 'feed'});
	}

	return FeedController;
});