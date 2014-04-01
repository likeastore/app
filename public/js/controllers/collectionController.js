define(function () {
	'use strict';

	function CollectionController ($scope, $rootScope, $routeParams, $analytics, api, appLoader) {
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
			}
		}

		$scope.remove = function (id, index) {
			api.delete({ resource: 'collections', target: $routeParams.id, verb: 'items', suffix: id }, function (res) {
				$scope.items.splice(index, 1);
			});
		};

		api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, function (items) {
			$scope.items = items;
			appLoader.ready();
		});
	}

	return CollectionController;
});