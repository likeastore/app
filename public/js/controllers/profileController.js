define(function () {
	'use strict';

	function ProfileController($scope, $rootScope, $routeParams, $analytics, appLoader, api, user) {
		appLoader.loading();

		$analytics.eventTrack('profile opened');

		$rootScope.title = $routeParams.name + '\'s profile';

		$rootScope.$watch('user', readyUser);
		function readyUser(user) {
			if (!user) {
				return;
			}

			$scope.list = 'ownCollections';
			$scope.switchList = function (list) {
				$scope.list = list;

				if (list === 'ownCollections') {
					getCollections('profile');
				} else if (list === 'followCollections') {
					getCollections('follow');
				}
			};

			$scope.me = ($rootScope.user.name === $routeParams.name);

			$scope.profile = $scope.me ? user : api.get({ resource: 'users', target: $routeParams.name });

			if ($scope.me) {
				$scope.$on('collection added', function (event, collection) {
					if (collection['public']) {
						getCollections('profile');
					}
				});
			}

			getCollections('profile');

			function getCollections(listType) {
				appLoader.loading();

				var requestOptions = {
					resource: 'collections',
					target: 'user',
					verb: $routeParams.name
				};

				if (listType === 'follow') {
					_(requestOptions).extend({ suffix: 'follows' });
				}

				api.query(requestOptions, handleCollections);
				function handleCollections(collections) {
					_(collections).each(function (collection) {
						collection.mutual = isMutual(collection._id);
						function isMutual (id) {
							var meFollows = $rootScope.user.followCollections;
							return meFollows.length && _(meFollows).find(function (collection) {
								return collection.id === id;
							});
						}
					});

					if (listType === 'profile') {
						$scope.profile.ownedCollectionsCount = collections.length || 0;
					}

					$scope.collections = collections;

					appLoader.ready();
				}
			}

			$scope.$on('follow.collection', function (event, collId) {
				var targetCollection = _(event.currentScope.collections).find(function (row) {
					return row._id === collId;
				});
				targetCollection.followersCount += 1;
			});

			$scope.$on('unfollow.collection', function (event, collId) {
				var targetCollection = _(event.currentScope.collections).find(function (row) {
					return row._id === collId;
				});
				targetCollection.followersCount -= 1;
			});
		}
	}

	return ProfileController;
});
