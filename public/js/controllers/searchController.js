define(function (require) {
	'use strict';

	function SearchController ($scope, $rootScope, $routeParams, appLoader, api, user, $analytics) {
		appLoader.loading();

		$analytics.eventTrack('search opened');

		$rootScope.title = 'Search results for "' + $routeParams.text + '"';
		$scope.search = true;
		$scope.query = $routeParams.text;
		$scope.items = [];

		$scope.remove = function (id, index) {
			api.delete({ resource: 'items', target: id }, function (res) {
				user.getInboxCount();
				$scope.items.splice(index, 1);
			});
		};

		api.get({ resource: 'search', text: $routeParams.text }, function (res) {
			$scope.items = $scope.items.concat(res.data);
			$scope.nextPage = res.nextPage;
			appLoader.ready();
		});
	}

	return SearchController;
});
