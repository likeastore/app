define(function () {
	'use strict';

	function ProfileController($scope, $rootScope, $routeParams, $location, $filter, $analytics, appLoader, api, rsAppUser) {
		appLoader.loading();

		$analytics.eventTrack('profile opened');

		$scope.list = $location.hash() || 'collections';

		$rootScope.title = $routeParams.name + ' on Likeastore';

		$scope.me = (rsAppUser.name === $routeParams.name);

		if ($scope.me) {
			$scope.profile = rsAppUser;
			$scope.profile.hasPrivate = function (collections) {
				return _(collections).find(function (row) {
					return !row.public;
				});
			};

			fetchFollowCollections();
		} else {
			$scope.profile = api.get({ resource: 'users', target: $routeParams.name });

			api.query({ resource: 'collections', target: 'user', verb: $routeParams.name }, function (collections) {
				_(collections).each(function (collection) {
					collection.mutual = checkMutual(collection._id);
				});

				$scope.profile.ownCollectionsCount = collections.length;
				$scope.colls = collections;
				appLoader.ready();
			});

			fetchFollowCollections();
		}

		function fetchFollowCollections() {
			api.query({ resource: 'collections', target: 'user', verb: $routeParams.name, suffix: 'follows' }, function (collections) {
				_(collections).each(function (collection) {
					collection.mutual = checkMutual(collection._id);
				});

				$scope.followingColls = collections;
				appLoader.ready();
			});
		}

		function checkMutual(collectionId) {
			return _(rsAppUser.followCollections).find(function (row) {
				return row.id === collectionId;
			});
		}

		// events
		$scope.$on('$routeUpdate', function () {
			$scope.list = $location.hash() || 'collections';
		});

		$scope.$on('follow.collection', function (event, collId) {
			var targetCollection = _(event.currentScope.colls).find(function (row) {
				return row._id === collId;
			});
			targetCollection.followersCount += 1;
		});

		$scope.$on('unfollow.collection', function (event, collId) {
			var targetCollection = _(event.currentScope.colls).find(function (row) {
				return row._id === collId;
			});
			targetCollection.followersCount -= 1;
		});
	}

	return ProfileController;
});
