define(function () {
	'use strict';

	function ProfileController($scope, $rootScope, $routeParams, appLoader, api, user) {
		appLoader.loading();

		$rootScope.title = $routeParams.name + '\'s profile';

		$rootScope.$watch('user', readyUser);
		function readyUser(value) {
			if (!value) {
				return;
			}
			$scope.me = ($rootScope.user.name === $routeParams.name);
		}

		$scope.profile = api.get({ resource: 'users', target: $routeParams.name });

		api.query({ resource: 'collections', target: 'user', verb: $routeParams.name }, handleCollections);
		function handleCollections(collections) {
			$scope.profileCollections = collections;

			_($scope.profileCollections).forEach(function (collection) {
				collection.mutual = isMutual(collection._id);

				function isMutual (id) {
					var meFollows = $rootScope.user.followCollections || [];
					return meFollows.length && _(meFollows).find(function (collection) {
						return collection.id === id;
					});
				}
			});

			appLoader.ready();
		}

		$scope.switchList = function (list) {
			$scope.list = list;
		};

		$scope.kFormat = function(num) {
			return num > 999 ? (num/1000).toFixed() + 'k' : num;
		};

		$scope.followCollection = function (id, index) {
			var collection = $scope.profileCollections[index];

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
			var collection = $scope.profileCollections[index];

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

	return ProfileController;
});