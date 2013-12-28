define(function (require) {
	'use strict';

	function SearchController ($scope, $rootScope, $routeParams, appLoader, api) {
		appLoader.loading();

		$rootScope.title = 'Search';
		$scope.search = true;
		$scope.query = $routeParams.text;
		$scope.items = [];

		$scope.hideLike = function (id, index) {
			api.delete({ resource: 'items', target: id }, function (res) {
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
