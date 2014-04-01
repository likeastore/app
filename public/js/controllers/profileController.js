define(function () {
	'use strict';

	function ProfileController ($scope, $rootScope, $routeParams, $location, appLoader, api) {
		appLoader.loading();

		$rootScope.title = $routeParams.name + '\'s profile';

		api.get({ resource: 'users', target: 'me' }, function (me) {
			if (!me.follows) {
				me.follows = [];
			}

			if (!me.followed) {
				me.followed = [];
			}

			$scope.me = me.name === $routeParams.name;

			$scope.followUser = function (profile) {
				profile.processing = true;
				api.save({ resource: 'users', target: 'me', verb: 'follow', suffix: profile._id }, {}, function (res) {
					profile.mutual = true;
					profile.processing = false;

					profile.followed.push(me);
					me.follows.push(profile);
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

					index = _(me.follows).indexOf();
					me.follows.splice(index, 1);
				});
			};

			$scope.switchList = function (verb) {
				$scope.list = verb;
				getUserList(verb);
			};

			$scope.kFormat = function (num) {
				return num > 999 ? (num/1000).toFixed() + 'k' : num;
			};

			if ($scope.me) {
				$scope.profile = me;

				appLoader.ready();
				$scope.switchList('favorites');
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

					appLoader.ready();
					$scope.switchList('favorites');
				});
			}


			function getUserList (verb) {
				appLoader.loading();

				if (verb === 'favorites') {
					api.get({ resource: 'items', target: 'user', verb: $scope.profile._id }, function (res) {
						$scope.followers = false;
						$scope.items = res.data;
						appLoader.ready();
					});
				} else {
					api.query({ resource: 'users', target: $scope.profile.name, verb: verb }, function (list) {
						_(list).forEach(function (row) {
							row.mutual = checkMeFollowing(row.email);
						});
						$scope.items = false;
						$scope.followers = list;
						appLoader.ready();
					});
				}
			}

			function checkMeFollowing (email) {
				var meFollows = me.follows;
				return meFollows.length && _(meFollows).find(function (row) {
					return row.email === email;
				});
			}
		});
	}

	return ProfileController;
});