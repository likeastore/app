define(function () {
	'use strict';

	function ProfileController($scope, $rootScope, $routeParams, appLoader, api, user) {
		appLoader.loading();

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
					if (collection.public) {
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

			$scope.followCollection = function (id, index) {
				var collection = $scope.collections[index];
				collection.followers = collection.followers || [];

				collection.processing = true;

				api.update({ resource: 'collections', target: id, verb: 'follow' }, {}, function () {
					// add user to collection followers
					collection.followers.push($rootScope.user);

					// add collection to user followings
					$rootScope.user.followCollections.push({ id: id });

					collection.mutual = true;
					collection.processing = false;
				});
			};

			$scope.unfollowCollection = function (id, index) {
				var collection = $scope.collections[index];

				collection.processing = true;

				api.delete({ resource: 'collections', target: id, verb: 'follow' }, {}, function () {
					var uIndex = _($rootScope.user.followCollections).indexOf(collection);
					var cIndex = _(collection.followers).indexOf($rootScope.user);

					// remove user from collection followers
					collection.followers.splice(cIndex, 1);

					// remove collection from user followings
					$rootScope.user.followCollections.splice(uIndex, 1);

					collection.mutual = false;
					collection.processing = false;
				});
			};
		}
	}

	return ProfileController;
});
