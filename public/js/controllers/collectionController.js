define(function () {
	'use strict';

	function CollectionController ($scope, $rootScope, $routeParams, $analytics, api, appLoader, _) {
		$analytics.eventTrack('collection opened');

		$rootScope.$watch('collections', handleCollection);

		function handleCollection (value) {
			if (!value) {
				return;
			}

			$scope.collection = _($rootScope.collections).find(function (coll) {
				return coll._id === $routeParams.id;
			});

			$rootScope.title = $scope.collection.title;
		}

		api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, function (items) {
			$scope.items = items;
		});
	}

	return CollectionController;
});