define(function () {
	'use strict';

	function ProfileController($scope, $rootScope, $routeParams, appLoader, api, user) {
		appLoader.loading();

		$rootScope.title = $routeParams.name + '\'s profile';

		$rootScope.$watch('collections', readyCollections, true);
		function readyCollections(collection) {
			if (!collection) {
				return;
			}

			$scope.profile.ownedCollections = _($rootScope.collections).filter(isPublic);
			function isPublic(row) {
				return row['public'];
			}
		}

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
				if (!listType || !_(listType).isString()) {
					throw new Error('Collections list type is required');
				}

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
					$scope.collections = collections;

					_($scope.collections).forEach(function (collection) {
						collection.mutual = isMutual(collection._id);
						function isMutual (id) {
							var meFollows = $rootScope.user.followCollections;
							return meFollows.length && _(meFollows).find(function (collection) {
								return collection.id === id;
							});
						}
					});

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
