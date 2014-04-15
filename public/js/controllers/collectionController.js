define(function () {
	'use strict';

	function CollectionController ($scope, $rootScope, $routeParams, $location, $analytics, api, appLoader) {
		appLoader.loading();

		$analytics.eventTrack('collection opened');

		$rootScope.$watch('collections', handleCollection);

		function handleCollection (value) {
			if (!value) {
				return;
			}

			$scope.collection = _($rootScope.collections).find(function (coll) {
				return coll._id === $routeParams.id;
			});

			if ($scope.collection) {
				$rootScope.title = $scope.collection.title;
				$rootScope.description = $scope.collection.description;
			} else {
				return $location.url('/');
			}

			api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, function (items) {
				$scope.items = items;
				appLoader.ready();
			});
		}

		$scope.remove = function (id, index) {
			api.delete({ resource: 'collections', target: $routeParams.id, verb: 'items', suffix: id }, function (res) {
				$scope.items.splice(index, 1);
			});
		};
	}

	return CollectionController;
});
