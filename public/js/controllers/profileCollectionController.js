define(function () {
	'use strict';

	function ProfileCollectionController($scope, $rootScope, $routeParams, $location, $analytics, api, appLoader) {
		appLoader.loading();

		$analytics.eventTrack('collection opened');

		$rootScope.title = $routeParams.name + '\'s collection';

		$rootScope.$watch('user', function (user) {
			if (!user) {
				return;
			}

			if (user.name === $routeParams.name) {
				return $location.url('/collections/' + $routeParams.id);
			}

			api.query({ resource: 'collections', target: 'user', verb: $routeParams.name }, handleCollections);
			function handleCollections(collections) {
				$scope.collection = _(collections).find(function (collection) {
					return collection._id === $routeParams.id;
				});

				if (!$scope.collection) {
					return $location.url('/');
				}

				$scope.collection.mutual = _(user.followCollections).find(function (collection) {
					return collection.id === $routeParams.id;
				});

				$scope.collection.owner = $routeParams.name;

				api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, handleItems);
				function handleItems(items) {
					$scope.items = items;

					appLoader.ready();
				}
			}

		});

	}

	return ProfileCollectionController;
});