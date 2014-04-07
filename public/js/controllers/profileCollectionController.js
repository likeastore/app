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

			api.get({ resource: 'collections', target: $routeParams.id }, handleCollection);
			function handleCollection (collection) {
				$scope.collection = collection;
				$scope.collection.owner = $routeParams.name;
				$scope.collection.mutual = _(user.followCollections).find(function (row) {
					return row.id === collection.id;
				});

				api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, handleItems);
				function handleItems(items) {
					$scope.items = items;
					appLoader.ready();
				}
			}
		});

		$scope.followCollection = function (id) {
			$scope.collection.processing = true;

			api.update({ resource: 'collections', target: id, verb: 'follow' }, {}, function () {
				$scope.collection.mutual = true;
				$scope.collection.processing = false;
			});
		};

		$scope.unfollowCollection = function (id) {
			$scope.collection.processing = true;

			api.delete({ resource: 'collections', target: id, verb: 'follow' }, {}, function () {
				$scope.collection.mutual = false;
				$scope.collection.processing = false;
			});
		};
	}

	return ProfileCollectionController;
});
