define(function () {
	'use strict';

	function CollectionController ($scope, $rootScope, $routeParams, $analytics, api, appLoader, _) {
		$rootScope.$watch('collections', handleCollection);

		function handleCollection (value) {
			if (!value) {
				return;
			}

			$scope.collection = _($rootScope.collections).find(function (coll) {
				return coll._id === $routeParams.id;
			});

			$rootScope.title = $scope.collection.title;
			$rootScope.ctaButtonType = 'addNetwork';
		}

		api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, function (items) {
			$scope.items = items;
		});
	}

	return CollectionController;
});