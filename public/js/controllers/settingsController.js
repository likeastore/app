define(function () {
	'use strict';

	function SettingsController ($scope, $rootScope, api, $analytics) {
		$analytics.eventTrack('settings opened');

		$rootScope.title = 'Account settings';

		$scope.editModes = {};
		$scope.editModeOn = function (prop) {
			$scope.editModes[prop] = true;
		};
		$scope.editModeOff = function (prop) {
			$scope.editModes[prop] = false;
		};

		$scope.form = {};
		$scope.updateDisplayName = function () {
			api.patch({ resource: 'users', target: 'me' }, { displayName: $scope.form.displayName }, function () {
				$analytics.eventTrack('user displayName updated');
				$rootScope.user.displayName = angular.copy($scope.form.displayName);
				$scope.editModes.displayName = false;
			});
		};
		$scope.updateBio = function () {
			api.patch({ resource: 'users', target: 'me' }, { bio: $scope.form.bio }, function () {
				$analytics.eventTrack('user bio updated');
				$rootScope.user.bio = angular.copy($scope.form.bio);
				$scope.editModes.bio = false;
			});
		};
		$scope.updateLocation = function () {
			api.patch({ resource: 'users', target: 'me' }, { location: $scope.form.location }, function () {
				$analytics.eventTrack('user location updated');
				$rootScope.user.location = angular.copy($scope.form.location);
				$scope.editModes.location = false;
			});
		};
		$scope.updateWebsite = function () {
			if (!/^https?/.test($scope.form.website)) {
				$scope.form.website = 'http://' + $scope.form.website;
			}
			api.patch({ resource: 'users', target: 'me' }, { website: $scope.form.website }, function () {
				$analytics.eventTrack('user website updated');
				$rootScope.user.website = angular.copy($scope.form.website);
				$scope.editModes.website = false;
			});
		};

		$scope.installPlugin = function () {
			$analytics.eventTrack('go to extension via settings');
		};

		$rootScope.$watch('user', function (user) {
			if (!user) {
				return;
			}
			if (user.bio) {
				$scope.form.bio = user.bio;
			}
			if (user.displayName) {
				$scope.form.displayName = user.displayName;
			}
			if (user.location) {
				$scope.form.location = user.location;
			}
			if (user.website) {
				$scope.form.website = user.website;
			}
		}, true);
	}

	return SettingsController;
});
