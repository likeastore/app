define(function () {
	'use strict';

	function ProfileController ($scope, $rootScope, $routeParams, appLoader, api, _) {
		$scope.showFollows = true;
		$scope.me = $rootScope.user && $rootScope.user.name === $routeParams.name;
		$rootScope.title = $scope.me ? 'Profile' : $routeParams.name + '\'s profile';

		if ($scope.me) {
			$scope.profile = $rootScope.user;
			getUserList('follows');
		} else {
			api.get({ resource: 'users', target: $routeParams.name }, function (user) {
				if (!user.follows) {
					user.follows = [];
				}
				if (!user.followed) {
					user.followed = [];
				}

				$scope.profile = user;
				getUserList('follows');

				$scope.profile.mutual = checkMeFollowing($scope.profile.email);
				$scope.processing = false;
			});
		}

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
	}

	return ProfileController;
});