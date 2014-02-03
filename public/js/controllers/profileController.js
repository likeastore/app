define(function () {
	'use strict';

	function ProfileController ($scope, $rootScope, $routeParams, $location, appLoader, api, _) {
		$scope.me = $rootScope.user && $rootScope.user.name === $routeParams.name;
		$rootScope.title = $scope.me ? 'Profile' : $routeParams.name + '\'s profile';

		$scope.followUser = function (profile) {
			profile.processing = true;
			api.save({ resource: 'users', target: 'me', verb: 'follow', suffix: profile._id }, {}, function (res) {
				profile.mutual = true;
				profile.processing = false;

				profile.followed.push($rootScope.user);
				$rootScope.user.follows.push(profile);
			});
		};

		$scope.unfollowUser = function (profile) {
			profile.processing = true;
			api.delete({ resource: 'users', target: 'me', verb: 'follow', suffix: profile._id }, function (res) {
				var index;

				profile.mutual = false;
				profile.processing = false;

				index = _(profile.followed).indexOf(profile);
				profile.followed.splice(index, 1);

				index = _($rootScope.user.follows).indexOf();
				$rootScope.user.follows.splice(index, 1);
			});
		};

		$scope.switchList = function (verb) {
			$scope.list = verb;
			getUserList(verb);
		};

		if ($scope.me) {
			$scope.profile = $rootScope.user;

			checkProperList();
		} else {
			api.get({ resource: 'users', target: $routeParams.name }, function (user) {
				if (!user.follows) {
					user.follows = [];
				}
				if (!user.followed) {
					user.followed = [];
				}

				$scope.profile = user;
				$scope.profile.mutual = checkMeFollowing($scope.profile.email);
				$scope.processing = false;

				checkProperList();
			});
		}

		function getUserList (verb) {
			appLoader.loading();
			api.query({ resource: 'users', target: $scope.profile.name, verb: verb }, function (list) {
				_(list).forEach(function (row) {
					row.mutual = checkMeFollowing(row.email);
				});
				$scope.followers = list;
				appLoader.ready();
			});
		}

		function checkMeFollowing (email) {
			var meFollows = $rootScope.user.follows;
			return meFollows.length && _(meFollows).find(function (row) {
				return row.email === email;
			});
		}

		function checkProperList () {
			var path = $location.path();
			if (path === '/u' + $routeParams.name + '/followers') {
				return $scope.switchList('followed');
			}
			return $scope.switchList('follows');
		}
	}

	return ProfileController;
});