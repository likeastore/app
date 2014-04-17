define(function () {
	'use strict';

	function CollectionController ($scope, $rootScope, $routeParams, $location, $analytics, api, user, appLoader, rsAppUser, rsUserCollections) {
		appLoader.loading();

		$analytics.eventTrack('collection opened');

		$rootScope.title = $routeParams.name + '\'s collection';

		$scope.list = $location.hash() || 'favorites';

		$scope.me = (rsAppUser.name === $routeParams.name);

		if ($scope.me) {
			var targetCollection = _(rsUserCollections).find(function (collection) {
				return collection._id === $routeParams.id;
			});
			if (!targetCollection) {
				return $location.url('/');
			}
			$scope.collection = targetCollection;
		} else {
			$scope.collection = api.get({ resource: 'collections', target: $routeParams.id });
		}

		api.query({ resource: 'collections', target: $routeParams.id, verb: 'items' }, function handleItems(items) {
			$scope.items = items;

			appLoader.ready();
		});

		$scope.removeItem = function (id, index) {
			api.delete({ resource: 'collections', target: $routeParams.id, verb: 'items', suffix: id }, function (res) {
				$scope.items.splice(index, 1);
			});
		};

		// events
		$scope.$on('$routeUpdate', function () {
			$scope.list = $location.hash() || 'favorites';
		});

		$scope.$on('follow.collection', function (event, collId) {
			if (!$scope.collection.followers) {
				$scope.collection.followers = [];
			}
			$scope.collection.followers.push(rsAppUser);
			$scope.collection.followersCount += 1;
		});

		$scope.$on('unfollow.collection', function (event, collId) {
			var collIndex = _($scope.collection.followers).indexOf(rsAppUser);
			$scope.collection.followers.splice(collIndex, 1);
			$scope.collection.followersCount -= 1;
		});

		$rootScope.$on('update collection', function (event, collectionId) {
			user.getCollections().then(function (collections) {
				var targetCollection = _(collections).find(function (collection) {
					return collection._id === collectionId;
				});
				$scope.collection = targetCollection;
			});
		});
	}

	return CollectionController;
});
